<?php

namespace App\Model;

use App\Exceptions\FinishException;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

use App\Helpers\Request\Checker;
use Illuminate\Database\QueryException;
use App\Helpers\Request\Reply;
use Illuminate\Support\Facades\Auth;
use App\Helpers\Uploader\FileToken;
use App\Helpers\DB\Transactions;

class Model_basic extends Model
{
    public $timestamps = false;
    public $query_builder;
    public $struct;

    public $name = '';
    public $id;
    public $uploader;

    private $sql = [];
    private $sqlStatus = false;
    public $registerSql = [];

    private $depend = [];
    private $dependStatus = false;
    public $registerDepend = [];


    function __construct()
    {

        parent::__construct();
    }

    //validate input data functions
    public function check($data)
    {

        // function for checking input data. Form of input data:
        // array(column_name => values): Function will checking data input of correspond column

        if (!is_array($data)) throw new \Exception('Data must be an array');

        foreach ($data as $key => $val) {

            if (isset($this->struct[$key])) {

                if (isset($this->struct[$key][PROP_NULL]) && $this->struct[$key][PROP_NULL]) {
                    if (!Checker::validate($val, $this->struct[$key][PROP_REGEX])) {

                        Reply::finish(false, ERROR_FORMAT, ['data' => $key, 'type' => Checker::$log]);
                    }
                } else {
                    if (!Checker::validate($val, $this->struct[$key][PROP_REGEX]) || $val === '') {

                        Reply::finish(false, ERROR_FORMAT, ['data' => $key, 'type' => Checker::$log]);
                    }
                }
            } else {
                Reply::finish(false, ERROR_UNDEFINE, ['data' => $key]);
            }
        }
    }

    public function checkCondition($condition)
    {

        if (!is_array($condition) || count($condition) != 3) throw new \Exception('Key must be an array with 3 elements');

        if ($condition[0] == '' || $condition[1] == '') {
            throw new \Exception('Can not validate value. ' . $condition[0] . ': ' . $condition[2]);
        }

        if (!Checker::validate($condition[0], 'Varchar')) {
            throw new \Exception(Checker::$log);
        }

        if (!Checker::validate($condition[1], 'Logic')) {
            throw new \Exception(Checker::$log);
        }

        if ($condition[2] != 'NULL') {
            if (!Checker::validate($condition[2], 'SQL')) {
                throw new \Exception(Checker::$log);
            }
        }
    }

    public function keyToCondition($keys)
    {
        $condition = [];

        foreach ($keys as $key => $val) {
            if (!isset($this->struct[$key])) throw new \Exception('Undefined key :' . $key);
            $condition[] = [$key, '=', $val];
        }
        return $condition;
    }

    public function filterToCondition($colID, $filterItem)
    {

        $fitlerData = $filterItem['data'];
        $filterLogic = get($filterItem['logic'], 'and');

        $condition = [];

        foreach ($fitlerData as $filter) {
            $filterKey = array_merge([$colID], $filter);

            if (isset($filterLogic) && $filterLogic == 'or') {
                $condition[] = [$filterKey];
            } else {
                $condition[] = $filterKey;
            }
        }

        if (isset($filterLogic) && $filterLogic == 'or') {
            return $condition;
        } else {
            return [$condition];
        }
    }

    public function getPropName($propID)
    {
        return $this->struct[$propID][PROP_NAME];
    }

    public function buildCondition(&$dbBuilder, $keys, $trust = false)
    {

        if (!is_array($keys)) throw new \Exception('Can not validate value. Key must be an array');

        foreach ($keys as $orGroup) {

            if (!is_array($orGroup)) throw new \Exception('Can not validate value. Key must be an array');
            $orGroupBuild = array();

            foreach ($orGroup as $andGroup) {
                if (!$trust) $this->checkCondition($andGroup);

                if ($andGroup[1] == 'contain') {
                    $andGroup[1] = 'like';
                    $andGroup[2] = '%' . $andGroup[2] . '%';
                }

                if ($andGroup[2] === 'NULL') {
                    $andGroup[2] = NULL;
                }

                $orGroupBuild[] = [$this->getPropName($andGroup[0]), $andGroup[1], $andGroup[2]];
            }

            $dbBuilder->orWhere($orGroupBuild);
        }
    }

    public function buildFilter(&$dbBuilder, $filters, $logic = 'and', $trust = false)
    {
        /*filter item: [key=>[logic:'and', data:[['>', 'compare']] ]]*/
        if (!is_array($filters)) throw new \Exception('Can not validate value. Condition must be an array');

        foreach ($filters as $colID => $filter) {

            if ($logic == 'or') {

                $dbBuilder->orWhere(function ($db) use ($colID, $filter, $trust) {
                    $this->buildCondition($db, $this->filterToCondition($colID, $filter), $trust);
                });
            } else {
                $dbBuilder->where(function ($db) use ($colID, $filter, $trust) {
                    $this->buildCondition($db, $this->filterToCondition($colID, $filter), $trust);
                });
            }
        }
    }

    public function id2name($data)
    {

        $datasBuild = [];

        foreach ($data as $colID => $colVal) {

            if (isset($this->struct[$colID][PROP_DEFAULT]) && $colVal == '') {
                $colVal = $this->struct[$colID][PROP_DEFAULT];
            }

            if ($colVal === ''  && $this->struct[$colID][PROP_REGEX] == 'Number') {
                $datasBuild[$this->getPropName($colID)] = null;
            } else {
                $datasBuild[$this->getPropName($colID)] = $colVal;
            }
        }

        return $datasBuild;
    }

    protected function loadDependData(&$data)
    {

        $this->loadDepend();
        if (count($this->depend) == 0) return;
        foreach ($this->depend as $depend) {

            $keyLocal = isset($depend['key_local']) ? $depend['key_local'] : $depend['col_local'];
            $keyRemote = isset($depend['key_remote']) ? $depend['key_remote'] : $depend['col_remote'];

            try {
                $data[$keyLocal];
            } catch (\ErrorException $e) {
                continue;
            }

            if (!isset($depend['model']->dependData[$keyRemote][$data[$keyLocal]])) {
                $remoteData = $depend['model']->read([[[$keyRemote, '=', $data[$keyLocal]]]]);
                if (!$remoteData['result'] || !isset($remoteData['data'][0])) {
                    $data[$depend['col_local']] = get($this->struct[$depend['col_local']][PROP_DEFAULT], null);
                    continue;
                }
                $depend['model']->dependData[$keyRemote][$data[$keyLocal]] = $remoteData['data'][0];
            }

            $remoteData = $depend['model']->dependData[$keyRemote][$data[$keyLocal]];

            if (isset($remoteData->{$depend['col_remote']})) {
                $data[$depend['col_local']] = $remoteData->{$depend['col_remote']};
            } else {
                $data[$depend['col_local']] = '';
            }
        }
    }

    /* API function */

    public function db(){
        $dataBuilderRoot = $this->query_builder;
        $dataBuilder = clone $dataBuilderRoot;
        return $dataBuilder;
    }

    public function add($datas, $special = null, $trust = false)
    {

        $dataBuilderRoot = $this->query_builder;
        $dataBuilder = clone $dataBuilderRoot;

        try {

            //Transactions::begin($dataBuilder);
            $datasBuild = [];

            foreach ($datas as $key => $data) {
                if (!$trust) $this->check($data);
                $this->loadDependData($data);
                $this->add_relation($data);
                $datasBuild[$key] = $this->id2name($data);
            }

            if (is_callable($special)) {
                $special($dataBuilder);
            }

            $dataBuilder->insert(
                $datasBuild
            );
            //Transactions::commit($dataBuilder);
            return Reply::make(true, 'Success');
        }
        
        catch (\Exception $e) {
            //Transactions::rollback($dataBuilder);
            if (get_class($e) == 'App\Exceptions\FinishException') return $e->response->original;
            return Reply::finish(false, ERROR_DB, $e->getMessage());
        }
    }

    private function add_relation($newData)
    {

        $this->loadSql();
        if (count($this->sql) == 0) return;

        $affectSql = [];
        foreach ($this->sql as $relation) {
            if ($relation->addCheck($newData)) {
                $affectSql[] = $relation;
            }
        }

        if (count($affectSql) == 0) return;

        foreach ($affectSql as $relation) {
            $relation->add($newData);
        }
    }

    public function addGetId($datas, $special = null, $trust = false)
    {

        $dataBuilderRoot = $this->query_builder;
        $dataBuilder = clone $dataBuilderRoot;

        try {

            //Transactions::begin($dataBuilder);
            $datasBuild = [];
            $ids = [];
            foreach ($datas as $key => $data) {
                if (!$trust) $this->check($data);
                $data[$this->id] = makeId();
                $ids[] = $data[$this->id];
                $this->loadDependData($data);
                $this->add_relation($data);
                $datasBuild[$key] = $this->id2name($data);
            }

            if (is_callable($special)) {
                $special($dataBuilder);
            }

            $dataBuilder->insert(
                $datasBuild
            );
            //Transactions::commit($dataBuilder);
            return Reply::make(true, 'Success', $ids);
        }
        
        catch (\Exception $e) {
            //Transactions::rollback($dataBuilder);
            if (get_class($e) == 'App\Exceptions\FinishException') return $e->response->original;
            return Reply::finish(false, ERROR_DB, $e->getMessage());
        }
    }

    public function edit($datas, $special = null, $trust = false)
    {

        $dataBuilderRoot = $this->query_builder;
        $dataBuilder = clone $dataBuilderRoot;

        try {

            //Transactions::begin($dataBuilder);

            if (count($datas[DATA_EDITOR]) == 0)
                return Reply::make(true, 'Success');
            if ($datas[DATA_KEY] != 'All' && count($datas[DATA_KEY]) == 0)
                return Reply::make(false, 'Error', 'No Key defined');
            if ($datas[DATA_KEY] == 'All') $datas[DATA_KEY] = [];



            $this->buildCondition($dataBuilder, $datas[DATA_KEY], $trust);

            if (!$trust) $this->check($datas[DATA_EDITOR]);

            $this->loadDependData($datas[DATA_EDITOR]);

            $datasEditorBuild = $this->id2name($datas[DATA_EDITOR]);

            if (is_callable($special)) {
                $special($dataBuilder);
            }

            $editBuilder = clone $dataBuilder;

            $this->edit_relation($editBuilder, $datas[DATA_EDITOR]);

            $dataBuilder->update($datasEditorBuild);

            //Transactions::commit($dataBuilder);

            return Reply::make(true, 'Success');
        } catch (\Exception $e) {
            //Transactions::rollback($dataBuilder);
            if (get_class($e) == 'App\Exceptions\FinishException') return $e->response->original;
            return Reply::finish(false, ERROR_DB, $e->getMessage());
        }
    }

    private function edit_relation($datasBuild, $newData)
    {

        $this->loadSql();

        if (count($this->sql) == 0) return;

        $affectSql = [];
        foreach ($this->sql as $relation) {

            if ($relation->editCheck($newData)) {
                $affectSql[] = $relation;
            }
        }

        if (count($affectSql) == 0) return;

        $limit = 200;
        $offset = 0;
        $editDatas = $datasBuild->offset($offset)->limit($limit)->get();

        while (count($editDatas) > 0) {

            foreach ($affectSql as $relation) {
                $relation->edit($editDatas, $newData);
            }

            if (count($editDatas) < $limit) {
                $editDatas = [];
            } else {
                $offset += $limit;
                $editDatas = $datasBuild->offset($offset)->limit($limit)->get();
            }
        }
    }


    public function drop($keys,  $special = null, $trust = false)
    {

        $dataBuilderRoot = $this->query_builder;
        $dataBuilder = clone $dataBuilderRoot;

        try {

            if ($keys != 'All' && count($keys) == 0)
                return Reply::make(false, 'Error', 'No Key defined');
            if ($keys == 'All') $keys = [];

            //Transactions::begin($dataBuilder);

            $this->buildCondition($dataBuilder, $keys, $trust);

            if (is_callable($special)) {
                $special($dataBuilder);
            }
            $deleteDataBuilder = clone $dataBuilder;
            $this->drop_relation($deleteDataBuilder);

            $dataBuilder->delete();
            //Transactions::commit($dataBuilder);
            return Reply::make(true, 'Success');
        } catch (\Exception $e) {
            //Transactions::rollback($dataBuilder);
            if (get_class($e) == 'App\Exceptions\FinishException') return $e->response->original;
            return Reply::finish(false, ERROR_DB, $e->getMessage());
        }
    }



    private function drop_relation($datasBuild)
    {
        $this->loadSql();

        if (count($this->sql) == 0) return;

        $affectSql = [];
        foreach ($this->sql as $relation) {
            if ($relation->dropCheck()) {
                $affectSql[] = $relation;
            }
        }

        if (count($affectSql) == 0) return;

        $limit = 200;
        $offset = 0;
        $deleteDatas = $datasBuild->offset($offset)->limit($limit)->get();

        while (count($deleteDatas) > 0) {

            foreach ($affectSql as $relation) {
                $relation->drop($deleteDatas);
            }

            if (count($deleteDatas) < $limit) {
                $deleteDatas = [];
            } else {
                $offset += $limit;
                $deleteDatas = $datasBuild->offset($offset)->limit($limit)->get();
            }
        }
    }



    public function read($keys = null, $special = null, $trust = false, $select = null)
    {
        try {

            if (!isset($keys)) $keys = [];
            $dataBuilderRoot = $this->query_builder;
            $dataBuilder = clone $dataBuilderRoot;

            $this->buildCondition($dataBuilder, $keys, $trust);

            if (!$select) {
                $select = [];
                foreach ($this->struct as $propID => $propStruct) {
                    $select[] = $this->getPropName($propID) . ' as ' . $propID;
                }
            }

            if (is_callable($special)) {
                $special($dataBuilder);
            }

            $data = $dataBuilder->select($select)->get();

            return Reply::make(true, 'Success', $data);
        } catch (\Illuminate\Database\QueryException $e) {
            return Reply::finish(false, ERROR_DB, $e->errorInfo[2]);
        }
    }

    public function count($keys = null, $special = null, $trust = false)
    {
        try {

            if (!isset($keys)) $keys = [];
            $dataBuilderRoot = $this->query_builder;
            $dataBuilder = clone $dataBuilderRoot;

            $this->buildCondition($dataBuilder, $keys, $trust);

            if (is_callable($special)) {
                $special($dataBuilder);
            }

            $data = $dataBuilder->count();

            return Reply::make(true, 'Success', $data);
        } catch (\Illuminate\Database\QueryException $e) {

            return Reply::finish(false, ERROR_DB, $e->errorInfo[2]);
        }
    }


    public function filter($datas,  $special = null, $trust = false, $select = null)
    {

        try {

            $dataBuilderRoot = $this->query_builder;
            $dataBuilder = clone $dataBuilderRoot;

            $orderBy = get($datas[DATA_SORT], []);
            if (!Checker::validate($orderBy, 'Word')) Reply::finish(false, ERROR_FORMAT, ['data' => 'order_by', 'type' => Checker::$log]);

            if (!Checker::validate([
                $datas[PAGE_ACTIVE],
                $datas[PAGE_QUANTITY],
                $datas[PAGE_TOTAL],
                $datas[FLAG_FILTER_CHANGE]
            ], 'Number')) Reply::finish(false, ERROR_FORMAT, ['data' => 'page', 'type' => Checker::$log]);

            $filters = get($datas[DATA_FILTERS], []);
            $logic = get($datas[FLAG_FILTER_LOGIC], 'and');

            if (!$select) {
                $select = [];

                foreach ($this->struct as $propID => $propStruct) {

                    if (isset($this->struct[$propID][PROP_FILTER_RETURN]) && !$this->struct[$propID][PROP_FILTER_RETURN]) {
                        continue;
                    }

                    if (isset($this->struct[$propID][PROP_SELECT_DECORATOR])) {

                        $select[] = $this->struct[$propID][PROP_SELECT_DECORATOR]();
                    } else {
                        $select[] = $this->getPropName($propID) . ' as ' . $propID;
                    }
                }
            }

            //==================================================
            $dataBuilder->select($select);

            $this->buildFilter($dataBuilder, $filters, $logic, $trust);

            if (is_callable($special)) {
                $special($dataBuilder);
            }

            $totalRows = $datas[PAGE_TOTAL];
            if ($datas[FLAG_FILTER_CHANGE]) {
                $totalRows = $dataBuilder->count();
                $totalPage = ceil($totalRows / (int) $datas[PAGE_QUANTITY]);
                if ($datas[PAGE_ACTIVE] > $totalPage) {
                    $datas[PAGE_ACTIVE] = $totalPage;
                }
                if ($datas[PAGE_ACTIVE] == 0) {
                    $datas[PAGE_ACTIVE] = 1;
                }
            }

            $dataBuilder->offset(($datas[PAGE_ACTIVE] - 1) * $datas[PAGE_QUANTITY]);
            $dataBuilder->limit($datas[PAGE_QUANTITY]);

            foreach ($orderBy as $colID => $vector) {
                $dataBuilder->orderBy($this->getPropName($colID), $vector);
            }


            $data = [];
            //echo $dataBuilder->toSql();
            $data = $dataBuilder->get();

            $returnData = [
                DATA_TABLE => $data,
                PAGE_ACTIVE => $datas[PAGE_ACTIVE],
                PAGE_TOTAL => $totalRows
            ];

            return Reply::make(true, 'Success', $returnData);
        } catch (\Illuminate\Database\QueryException $e) {

            return Reply::finish(false, ERROR_DB, $e->errorInfo[2]);
        }
    }

    public function is_exist($keys, $special = null, $trust = false)
    {
        $dataBuilderRoot = $this->query_builder;
        $dataBuilder = clone $dataBuilderRoot;
        $this->buildCondition($dataBuilder, $keys, $trust);
        if (is_callable($special)) {
            $special($dataBuilder);
        }

        return $dataBuilder->count() > 0;
    }


    public function loadSql()
    {
        if (!$this->sqlStatus) {

            $models = resolve('Models');
            foreach ($this->registerSql as $sql) {

                $model = isset($sql[0]) ? $sql[0] : null;
                $colLocal = isset($sql[1]) ? $sql[1] : null;
                $colRemote = isset($sql[2]) ? $sql[2] : null;

                $name = $model . $colLocal . $colRemote;

                if (isset($this->sql[$name])) continue;

                $this->sql[$name] = new Relation($sql);
            }

            $this->sqlStatus = true;
        }
    }


    public $dependData = [];
    public function addDepend($model, $col_local, $col_remote, $key_local, $key_remote)
    {
        $name = $model . $col_local . $col_remote;
        $models = resolve('Models');
        if (isset($this->depend[$name])) return;
        $this->depend[$name] = [
            'model' => $models->getModel($model),
            'col_local' => $col_local,
            'col_remote' => $col_remote,
            'key_local' => $key_local,
            'key_remote' => $key_remote,
        ];
    }

    public function loadDepend()
    {
        if (!$this->dependStatus) {


            $models = resolve('Models');
            foreach ($this->registerDepend as $depend) {

                $model = isset($depend[0]) ? $depend[0] : null;
                $colLocal = isset($depend[1]) ? $depend[1] : null;
                $colRemote = isset($depend[2]) ? $depend[2] : null;
                $keyLocal = isset($depend[3]) ? $depend[3] : null;
                $keyRemote = isset($depend[4]) ? $depend[4] : null;

                $name = $model . $colLocal . $colRemote;

                if (isset($this->depend[$name])) continue;

                $this->depend[$name] = [
                    'model' => $models->getModel($model),
                    'col_local' => $colLocal,
                    'col_remote' => $colRemote,
                    'key_local' => $keyLocal,
                    'key_remote' => $keyRemote,
                ];
            }

            $this->dependStatus = true;
        }
    }

    
}
