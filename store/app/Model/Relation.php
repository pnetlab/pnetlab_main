<?php

namespace App\Model;

use App\Helpers\Request\Reply;
class Relation {
    public $model = null;
    public $col_local = null;
    public $col_remote = null;
    public $key_local = null;
    public $key_remote = null;
    public $on_delete = null;
    public $on_update = null;
    public $on_add = null;
    
    function __construct($sql){
        $models = resolve('Models');
        $model = isset($sql[0]) ? $sql[0] : null;
        $colLocal = isset($sql[1]) ? $sql[1] : null;
        $colRemote = isset($sql[2]) ? $sql[2] : null;
        $keyLocal = isset($sql[3]) ? $sql[3] : null;
        $keyRemote = isset($sql[4]) ? $sql[4] : null;
        $onDelete = isset($sql[5]) ? $sql[5] : null;
        $onUpdate = isset($sql[6]) ? $sql[6] : null;
        $onAdd = isset($sql[7]) ? $sql[7] : null;
        
        $this->model = $models->getModel($model);
        $this->col_local = $colLocal;
        $this->col_remote = $colRemote;
        $this->key_local = isset($keyLocal)? $keyLocal : $this->col_local;
        $this->key_remote = isset($keyRemote)? $keyRemote : $this->col_remote;
        $this->on_add = $onAdd;
        $this->on_delete = $onDelete;
        $this->on_update = $onUpdate;
        
    }
    
    
    public function addCheck($newData){
        if(is_callable($this->on_add)) return true;
        if(!isset($this->col_local) || !isset($this->col_remote) || !isset($this->on_add)) return false;
        try {
            $newData[$this->col_local];
            $newData[$this->key_local];
            return true;
        } catch (\ErrorException $e) {
            return false;
        }
    }
    
    public function add($newData){
        //new Data is not an array. It object

        if(is_callable($this->on_add)){
            $onAdd = $this->on_add;
            $returnValue = $onAdd(['new'=> $newData]);
            if($returnValue === false) return;
        }

        if(!$this->addCheck($newData)) return;
        
        $dataKey = [[ [$this->key_remote, '=',  $newData[$this->key_local]] ]];
        $value = $newData[$this->col_local];
        
        if($this->on_add === 'cascade'){
            $dataEdit = [$this->col_remote => $value];
            $editResult = $this->model->edit([DATA_KEY => $dataKey, DATA_EDITOR => $dataEdit], null, true);
            if(!$editResult['result']) Reply::finish($editResult);
        }
        elseif($this->on_add === 'deny'){
            if($this->model->is_exist($dataKey)){
                Reply::finish(false, 'ERROR_DB', 'Edit '.$this->model->name.' first');
            }
        }elseif(is_callable($this->on_add)){
            $dataEdit = [$this->col_remote => $returnValue];
            $editResult = $this->model->edit([DATA_KEY => $dataKey, DATA_EDITOR => $dataEdit], null, true);
            if(!$editResult['result']) Reply::finish($editResult);
        }else{
            Reply::finish(false, 'ERROR_DB', 'Define '.$this->model->name.' on Add');
        }
    }
    
    
    public function dropCheck(){
        if(is_callable($this->on_delete)) return true;
        if(!isset($this->col_local) || !isset($this->col_remote) || !isset($this->on_delete)) return false;
        return true;
    }
    
    public function drop($deleteDatas){
        

        if(is_callable($this->on_delete)){
            $onDel = $this->on_delete;
            $returnValue = $onDel(['data'=>$deleteDatas]);
            if($returnValue === false) return;
        }

        if(!$this->dropCheck()) return;
        
        $deleteKey = [];
        
        foreach ($deleteDatas as $deleteData){
            if(isset($deleteData->{$this->col_local})) {
                $deleteKey[] = [[$this->key_remote, '=', $deleteData->{$this->key_local}]];
            }
        }
        
        if(count($deleteKey) > 0){
        
            if($this->on_delete==='cascade'){
                $dropResult = $this->model->drop($deleteKey, null, true);
                if(!$dropResult['result']) Reply::finish($dropResult);
        
            }elseif($this->on_delete==='deny'){
                if($this->model->is_exist($deleteKey)){
                    Reply::finish(false, 'ERROR_DB', 'Remove '.$this->model->name.' first');
                }
                
            }elseif(is_callable($this->on_delete)){
                $dataEdit = [$this->col_remote => $returnValue];
                $editResult = $this->model->edit([DATA_KEY=>$deleteKey, DATA_EDITOR=>$dataEdit], null, true);
                if(!$editResult['result']) Reply::finish($editResult);
            }else{
                Reply::finish(false, 'ERROR_DB', 'Define '.$this->model->name.' on Delete');
            }
        }
    }
    
    public function editCheck($newData){
        if(is_callable($this->on_update)) return true;
        if(!isset($this->col_local) || !isset($this->col_remote) || !isset($this->on_update)) return false;
       
        try {
            $newData[$this->col_local];
            return true;
        } catch (\ErrorException $e) {
            try {
                $newData[$this->key_local];
                return true;
            } catch (\ErrorException $e) {
                return false;
            }
        }
    }
    
    public function edit($editDatas, $newData){

        if(is_callable($this->on_update)){
            $onUpdate = $this->on_update;
            $returnValue = $onUpdate(['data'=>$editDatas, 'new'=> $newData]);
            if($returnValue === false) return;
        }
        
        if(!$this->editCheck($newData)) return ;
        
        $dataKey = [];
        
        foreach ($editDatas as $editData){
            
            try {
                 if($newData[$this->key_local] !== $editData->{$this->key_local}){ 
                     if($this->key_local !== $this->col_local){
                         $this->drop([$editData]);
                         $this->add($newData);
                         continue;
                     }
                 }else{
                     throw new \ErrorException();
                 }
            } catch (\ErrorException $e) {
                if($newData[$this->col_local] == $editData->{$this->col_local}){
                    continue;
                }
            }
            
            $dataKey[] = [[$this->key_remote, '=', $editData->{$this->key_local}]];
            
        
        }
        
        if(count($dataKey) > 0){
        
            $value = $newData[$this->col_local];
        
            if($this->on_update === 'cascade'){
                $dataEdit = [$this->col_remote => $value];
        
                $editResult = $this->model->edit([DATA_KEY => $dataKey, DATA_EDITOR => $dataEdit], null, true);
        
                if(!$editResult['result']) Reply::finish($editResult);
            }
            elseif($this->on_update === 'deny'){
                if($this->model->is_exist($dataKey)){
                    Reply::finish(false, 'ERROR_DB', 'Edit '.$this->model->name.' first');
                }
            }elseif(is_callable($this->on_update)){
                $dataEdit = [$this->col_remote => $returnValue];
                $editResult = $this->model->edit([DATA_KEY => $dataKey, DATA_EDITOR => $dataEdit], null, true);
                if(!$editResult['result']) Reply::finish($editResult);
            }else{
                Reply::finish(false, 'ERROR_DB', 'Define '.$this->model->name.' on Update');
            }
        
        }
    }
    
    
}