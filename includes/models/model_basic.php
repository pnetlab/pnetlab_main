<?php

class model_basic
{
    protected $table;
    protected $db;
    public function __construct()
    {
        $this->db = checkDatabase();
    }

    /** 
     * conditions: array of conditions
     * return array of condition string
     */
    private function resolveCondition($conditions, &$param){
        try {
            $conditionArray = [];
            foreach($conditions as $key => $value){
                $indent = 'condition_'.$value[0];
                $conditionArray[] = $value[0] . ' ' . $value[1] . ' :' . $indent;
                $param[$indent] = $value[2];
            }
            return implode(' AND ', $conditionArray);
        } catch (Exception $th) {
            throw new Exception('Condition is wrong');
        }
        
    }

    private function resolveData($data, &$param){
        try {
            $dataArray = [];
            foreach($data as $key => $value){
                $indent = 'data_'.$key;
                $dataArray[] = $key . ' = :' . $indent;
                $param[$indent] = $value;
            }
            return implode(',', $dataArray);
        } catch (Exception $th) {
            throw new Exception('data is wrong');
        }
        
    }


    public function isExist($conditions){
        $param = [];
        $conditionArray = $this->resolveCondition($conditions, $param);
        $cmd = 'SELECT 1 FROM ' . $this->table . ' WHERE ' . $conditionArray . ' LIMIT 1';
        $statement = $this->db->prepare($cmd);
        $statement->execute($param);
        return $statement->rowCount() > 0;

    }

    public function insert($data){
        $dataValues = array_map(function($item){
            return ':'.$item;
        }, array_keys($data));
        $cmd = 'INSERT INTO ' . $this->table . ' ('.implode(',', array_keys($data)).') VALUES ' . '('. implode(',', $dataValues) .')'; 
        $statement = $this->db->prepare($cmd);
        $statement->execute($data);
        return true;
    }

    public function update($data, $conditions){
        $param = [];
        $conditionArray = $this->resolveCondition($conditions, $param);
        $dataArray = $this->resolveData($data, $param);
        $cmd = 'UPDATE ' . $this->table . ' SET ' . $dataArray . ' WHERE ' . $conditionArray;
       
        $statement = $this->db->prepare($cmd);
        $statement->execute($param);
        return true;
    }

    public function drop($conditions){
        $param = [];
        $conditionArray = $this->resolveCondition($conditions, $param);
        $cmd = 'DELETE FROM ' . $this->table . ' WHERE ' . $conditionArray;
        $statement = $this->db->prepare($cmd);
        $statement->execute($param);
        return true;
    }

    public function get($conditions=null, $selection=null){
        $param = [];
        if($selection === null) $selection = '*';
        if($selection !== '*') $selection = implode(',', $selection);
        if($conditions === null){
            $cmd = 'SELECT '.$selection.' FROM ' . $this->table;
        }else{
            $conditionArray = $this->resolveCondition($conditions, $param);
            $cmd = 'SELECT '.$selection.' FROM ' . $this->table . ' WHERE ' . $conditionArray;
        }
       
        $statement = $this->db->prepare($cmd);
        $statement->execute($param);
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }





}