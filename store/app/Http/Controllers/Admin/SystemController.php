<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\Auth\Role;
use App\Helpers\Control\Ctrl;
use App\Helpers\Request\Checker;
use App\Helpers\Request\Query;
use App\Helpers\Request\Reply;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\Resource;

class SystemController extends Controller
{

    function __construct()
    {
        //Load intital variable to page that is not React
        parent::__construct();
        $this->viewblade = 'reactjs.reactjs';
        
    }

    public function view()
    {
        return view($this->viewblade);
    }

    public function getProxy(){
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        Reply::finish(true, 'success', Query::getProxy());
    }

    public function setProxy(Request $request){
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        $proxy_ip = $request->input('proxy_ip', null);
        $proxy_port = $request->input('proxy_port', null);
        $proxy_username = $request->input('proxy_username', null);
        $proxy_password = $request->input('proxy_password', null);
       
        Query::setProxy([
            'proxy_ip' => $proxy_ip,
            'proxy_port' => $proxy_port,
            'proxy_username' => $proxy_username,
            'proxy_password' => $proxy_password,
        ]);

        Reply::finish(true, 'success');

    }


    public function update(Request $request){
        $datas = $request->all();
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION, '');
        foreach($datas as $key=>$value){
            if(is_array($value)){
                $query = Ctrl::set($key, $value, true);
            }else{
                $query = Ctrl::set($key, $value);
            }
            if(!$query['result']) return $query;
        }
        Reply::finish(true, 'success');
    }

    public function get(){
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION, '');
        $returnData = [
            CTRL_DOCKER_WIRESHARK => Ctrl::get(CTRL_DOCKER_WIRESHARK, '0'),
            CTRL_DEFAULT_CONSOLE => Ctrl::get(CTRL_DEFAULT_CONSOLE, ''),
            CTRL_DEFAULT_LANG => Ctrl::get(CTRL_DEFAULT_LANG, ''),
        ];
        Reply::finish(true, 'success', $returnData);
    }

    public function getShareFolder(){
        $shareFolder = Ctrl::get(CTRL_SHARED, [], true);
        $permission = Ctrl::get(CTRL_SHARED_PERMISSION, (object)[], true);
        return Reply::finish(true, 'Success', [CTRL_SHARED => $shareFolder, CTRL_SHARED_PERMISSION => $permission]);
    }

    public function shutdown(){
        Checker::method('post');
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION, '');
        exec('sudo shutdown -h now > /dev/null 2>&1 &');
        Reply::finish(true, 'success');
    }

    public function reboot(){
        Checker::method('post');
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION, '');
        exec('sudo reboot > /dev/null 2>&1 &');
        Reply::finish(true, 'success');
    }

    public function fixPermission(){
        Checker::method('post');
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION, '');
        exec('sudo /opt/unetlab/wrappers/unl_wrapper -a fixpermissions');

        exec('sudo chmod 755 /opt/unetlab/addons/iol/bin/CiscoIOUKeygen.py');
        exec('license=$(python /opt/unetlab/addons/iol/bin/CiscoIOUKeygen.py | grep "=" | grep -v "hostname") && sudo echo -e "[license]\n$license" > /opt/unetlab/addons/iol/bin/iourc');
       
        Reply::finish(true, 'success');
    }

    public function stopAllNodes(){
        Checker::method('post');
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION, '');
        exec('sudo /opt/unetlab/wrappers/unl_wrapper -a stopall');
        Reply::finish(true, 'success');
    }

    public function restartWebService(){
        Checker::method('post');
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION, '');
        exec('sudo service apache2 restart');
        Reply::finish(true, 'success');
    }

    public function restartDBService(){
        Checker::method('post');
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION, '');
        exec('sudo service mysql restart');
        Reply::finish(true, 'success');
    }

    public function restartHTMLConsoleService(){
        Checker::method('post');
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION, '');
        exec('sudo service guacd restart');
        exec('sudo service tomcat8 restart');
        Reply::finish(true, 'success');
    }

    public function restartDockerService(){
        Checker::method('post');
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION, '');
        exec('sudo service docker restart');
        Reply::finish(true, 'success');
    }

    public function restartPnetNatService(){
        Checker::method('post');
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION, '');
        exec('sudo service pnetnat restart');
        Reply::finish(true, 'success');
    }



}