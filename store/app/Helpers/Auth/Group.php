<?php 
namespace App\Helpers\Auth;
use Illuminate\Support\Facades\DB;
use Exception;
use App\Helpers\Request\Checker;
class Group {

    
    /**
     * create group tree
     * param unknown $groupID
     */
    private $groupTreeOfGroup = [];
    private function scandParent($groupID){
        try {
            $groupTree = [];
            $groupInfo = DB::table(GROUP_TABLE)
            ->where(GROUP_ID, '=', $groupID)
            ->select(GROUP_ID, GROUP_NAME, GROUP_OWNER, GROUP_PARENT)
            ->get();
            if(count($groupInfo) == 0){
                return $groupTree;
            }
            
            $groupTree[] = (array)$groupInfo[0];
            
            if($groupInfo[0]->{GROUP_PARENT} != 0){
                $groupTree = array_merge($this->getGroupTreeByGroupId($groupInfo[0]->{GROUP_PARENT}, false) , $groupTree);
            }
            return $groupTree;
        } catch (Exception $e) {
            return $groupTree;
        }
    
    }
    
    public function getGroupTreeByGroupId($groupID, $check = true){
        // Get group tree by group id. Return an array [groupID1, groupID2]
        if($check) if(!Checker::validate($groupID, 'Number')) return [];
        if(!isset($this->groupTreeOfGroup[$groupID])){
            $this->groupTreeOfGroup[$groupID] = $this->scandParent($groupID);
        }
        
        return $this->groupTreeOfGroup[$groupID];
    }
    
    
    /**
     * Get group childrent of group
     */
    
    private $groupChildOfGroup = [];  
    private function scandChild($groupID){
        try {
            $groupChild = [];
            $groupInfo = DB::table(GROUP_TABLE)
            ->where(GROUP_PARENT, '=', $groupID)
            ->select(GROUP_ID, GROUP_NAME, GROUP_OWNER, GROUP_PARENT)
            ->get();
            
            if(count($groupInfo) == 0){
                return $groupChild;
            }
    
            foreach ($groupInfo as $key=>$value){
                $groupChild[$value->{GROUP_ID}] = (array)$value;
                $groupChild = $groupChild + $this->getGroupChildByGroupId($value->{GROUP_ID}, false);
            }
            return $groupChild;
    
        } catch (Exception $e) {
            return $groupChild;
        }
    
    }
    
    public function getGroupChildByGroupId($groupID, $check=true){
        // Get group tree by group id. Return an array [groupID1, groupID2]
        if($check) if(!Checker::validate($groupID, 'Number')) return [];
        if(!isset($this->groupChildOfGroup[$groupID])){
            $this->groupChildOfGroup[$groupID] = $this->scandChild($groupID);
        }
    
        return $this->groupChildOfGroup[$groupID];
    }
    
    private $groupChildOfUser=[];
    public function getGroupChildByUserId($userID){
        // Get group tree by group id. Return an array [groupID1, groupID2]
        if(!Checker::validate($userID, 'Number')) return [];
  
        if(!isset($this->groupChildOfUser[$userID])){
            $groupIDs = DB::table(GROUP_TABLE)->where(GROUP_OWNER, '=', $userID)->get();
            if(count($groupIDs) == 0) return [];
            $groupChild = [];
            foreach ($groupIDs as $groupID){
                $groupChild[$groupID->{GROUP_ID}] = (array)$groupID;
                $groupChild = $groupChild + $this->getGroupChildByGroupId($groupID->{GROUP_ID}, false);
            }
            $this->groupChildOfUser[$userID] = $groupChild;
        }
        
        return $this->groupChildOfUser[$userID];
    }
    
    /**
     * Get group tree array by userID
     */
    private $groupTreeOfUser=[];
    public function getGroupTreeByUserId($userID){
    
        if(!Checker::validate($userID, 'Number')) return [];
  
        if(!isset($this->groupTreeOfUser[$userID])){
            $groupIDs = DB::table(MAP_UG_TABLE)->where(MAP_UG_PEOPLEID, '=', $userID)->get();
            if(count($groupIDs) == 0) return [];
            $groupTree = [];
            foreach ($groupIDs as $groupID){
                $groupTree[] = $this->getGroupTreeByGroupId($groupID->{MAP_UG_GROUPID});
            }
            $this->groupTreeOfUser[$userID] = $groupTree;
        }
       
        return $this->groupTreeOfUser[$userID];
    }
    
    /*
     * get power grop tree of user
     */
    private $powerGroupTree = [];
    
    private function getShortestArray($arrayofArray){
        $leng = array_map('count', $arrayofArray);
        return array_keys($leng, min($leng))[0];
    }
    
    public function setPowerGroupTree($userID, $powerGroupTree){
        $this->powerGroupTree[$userID] = $powerGroupTree;
    }
    
    public function getPowerGroupTree($userID){
        
        if(!Checker::validate($userID, 'Number')) return [];
        if(!isset($this->powerGroupTree[$userID])){
            $groupTreeOfUser = $this->getGroupTreeByUserId($userID);
            if(is_null($groupTreeOfUser)) return [];
            $powerGroupTrees = [];
             
            while (count($groupTreeOfUser) > 0){
                $minID = $this->getShortestArray($groupTreeOfUser);
                $powerGroupTree = $groupTreeOfUser[$minID];
                unset($groupTreeOfUser[$minID]);
                $compareID = count($powerGroupTree)-1;
                foreach ($groupTreeOfUser as $key => $groupTree){
                    if($groupTree[$compareID][GROUP_ID] == $powerGroupTree[$compareID][GROUP_ID]){
                        unset($groupTreeOfUser[$key]);
                    }
                }
                $powerGroupTrees[] = $powerGroupTree;
            }
            $this->powerGroupTree[$userID] = $powerGroupTrees;
        }
        return $this->powerGroupTree[$userID];
    }
    
    
    /**
     * return power group information
     * 
     */
    public function getPowerGroups($userID){
        $powerGroupTree = resolve('Group')->getPowerGroupTree($userID);
        if($powerGroupTree == null) return [];
        $powerGroups = [];
        foreach ($powerGroupTree as $element){
            $lastIndex = count($element)-1;
            $powerGroups[$element[$lastIndex][GROUP_ID]] = $element[$lastIndex];
        }
        return $powerGroups;
    }
    
    
    public function checkRoot($uid){
        $root = DB::table(MAP_UG_TABLE)
        ->where([[MAP_UG_PEOPLEID, '=', $uid], [MAP_UG_GROUPID, '=', 1]])
        ->count();
        return $root > 0;
    }
    
}

?>