<?php 
namespace App\Helpers\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Exception;
use App\Helpers\Request\Checker;
class Permission {

    private $groupHelper;
    public $status;
    function __construct(){
        $this->groupHelper = resolve('Group');
    }
    /**
     * create group tree
     * param unknown $groupID
     */
    function checkGroupPermission($groupID, $function){
        $this->status = -1;
        try {
             
            if(!Checker::validate([$groupID, $function], 'Number')) return false;
            
            $groupTree = $this->groupHelper->getGroupTreeByGroupId($groupID);
            
            $groupTreeLength = count($groupTree);
            
            if(is_null($groupTree)) return false;
            
            $userGroupTree = $this->groupHelper->getPowerGroupTree(Auth::user()->{AUTHEN_ID});
//             print_r($groupTree);
//             print_r($userGroupTree); die;
            if(is_null($userGroupTree)) return false;
            
            foreach ($userGroupTree as $tree){
                $leng = count($tree);
                if(isset($groupTree[$leng - 1]) && $groupTree[$leng - 1] == $tree[$leng - 1]){
                    if($leng == $groupTreeLength){
                        
                        if($function == FUNC_VIEW_GROUP){
                            $this->status = 0;
                            return true;
                        }
                        
                        $checkExit = DB::table(AUTHZ_RB_TABLE)->where([[AUTHZ_RB_GID, '=', $groupID], [AUTHZ_RB_FUNC, '=', $function]])->get();
                        if(count($checkExit) > 0) {
                            $this->status = 0;
                            return true;
                        }
                        
                    }elseif (isset($groupTree[$leng])){
                        
                        $checkExit = DB::table(GROUP_TABLE)->where([[GROUP_ID, '=', $groupTree[$leng][GROUP_ID]], [GROUP_OWNER, '=', Auth::user()->{AUTHEN_ID}]])->get();
                        if(count($checkExit) > 0) {
                            $this->status = 1;
                            return true;
                        }
                    }
                }
            }
            
            return false;
        } catch (Exception $e) {
            return false;
        }
        
    }
    
    var $groupFunctions = [];
    function getGroupFunction($groupID){
        /**
         * return an array of function ID
         */
        try {
            if(!isset($this->groupFunctions[$groupID])){
                $totalFunctions = config('constants.authen.FUNCTIONS');
                if(!Checker::validate($groupID, 'Number')) return [];
                $permissions = DB::table(AUTHZ_RB_TABLE)->where(AUTHZ_RB_GID, '=', $groupID)->get();
                $this->groupFunctions[$groupID] = [];
                foreach ($permissions as $permission){
                    $this->groupFunctions[$groupID][$permission->{AUTHZ_RB_FUNC}] = $totalFunctions[$permission->{AUTHZ_RB_FUNC}];
                }
            }
            return $this->groupFunctions[$groupID];
        } catch (Exception $e) {
            return [];
        }
        
    }
    
}

?>