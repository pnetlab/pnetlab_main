<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\Auth\Role;
use App\Helpers\Request\Reply;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\Resource;

class StatusController extends Controller
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

    public function getInfo()
    {

        $cmd = '/opt/qemu/bin/qemu-system-x86_64 -version | sed \'s/.* \([0-9]*\.[0-9.]*\.[0-9.]*\).*/\1/g\'';

        $o = '';
        exec($cmd, $o, $rc);
        if ($rc != 0) {
            error_log(date('M d H:i:s ') . 'ERROR: 60044');
            $qemu_version = '';
        } else {
            $qemu_version = $o[0];
        }

        $cmd = 'nproc';
        $o = '';
        exec($cmd, $o, $rc);
        if ($rc != 0) {
            $cores = '';
        } else {
            $cores = $o[0];
        }

        $o = '';
        $cmd = 'cat /sys/kernel/mm/uksm/run';
        exec($cmd, $o, $rc);
        if ($rc != 0) {
            $uksm = 'unsupported';
        } else {
            if ($o[0] == "1") {
                $uksm = "enabled";
            } else {
                $uksm = "disabled";
            }
        }

        $o = '';
        $cmd = 'cat /sys/kernel/mm/ksm/run';
        exec($cmd, $o, $rc);
        if ($rc != 0) {
            $ksm = 'unsupported';
        } else {
            if ($o[0] == "1") {
                $ksm = "enabled";
            } else {
                $ksm = "disabled";
            }
        }

        $o = "";
        $cmd = 'systemctl is-active cpulimit.service';
        exec($cmd, $o, $rc);
        if ($rc != 0) {
            $cpulimit = 'disabled';
        } else {
            if ($o[0] == "active") {
                $cpulimit = 'enabled';
            } else {
                $cpulimit = 'disabled';
            }
        }

        Reply::finish(true, 'success', [
            'qemu_version' => $qemu_version,
            'uksm' => $uksm,
            'ksm' => $ksm,
            'cpulimit' => $cpulimit,
            'cores' => $cores,
        ]);
    }

    public function getRunningNodes()
    {
        if (!Role::checkRoot()) Reply::finish(true, 'success', []);
        $cmd = 'pgrep -f -c -P 1 iol_wrapper';
        exec($cmd, $o_iol, $rc);
        $cmd = 'pgrep -f -c -P 1 dynamips';
        exec($cmd, $o_dynamips, $rc);
        $cmd = 'pgrep -f -c -P 1 qemu-system';
        exec($cmd, $o_qemu, $rc);
        $cmd = 'docker -H=tcp://127.0.0.1:4243 ps -q | wc -l';
        exec($cmd, $o_docker, $rc);
        $cmd = 'pgrep -f -c -P 1 vpcs';
        exec($cmd, $o_vpcs, $rc);
        $data = array(
            'iol' => (int) current($o_iol),
            'dynamips' => (int) current($o_dynamips),
            'qemu' => (int) current($o_qemu),
            'docker' => (int) current($o_docker),
            'vpcs' => (int) current($o_vpcs)
        );
        Reply::finish(true, 'success', $data);
    }

    public function getSystemInfo()
    {
        
       
        $data = [
            'cpu' => 0,
            'ram' => 0,
            'swap' => 0,
            'disk' => 0,
            'total_ram' => 0,
            'total_swap' => 0,
            'total_disk' => 0,
        ];

        $o = [];
        $cmd = 'free -m';
        exec($cmd, $o, $rc);
        foreach ($o as $output) {
            if (preg_match('/^mem:\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+).*$/mi', $output, $match)) {
                if((int) $match[1] > 0){
                    $data['ram'] = 100 - round((int) $match[6] * 100 / (int) $match[1]);
                    $data['total_ram'] = $match[1]*1024;
                }
            }
            if (preg_match('/^swap:\s+(\d+)\s+(\d+)\s+(\d+).*$/mi', $output, $match)) {
                if((int)$match[1] > 0){
                    $data['swap'] = round((int) $match[2] * 100 / (int) $match[1]);
                    $data['total_swap'] = $match[1]*1024;
                }
                
            }
        }

        if (!Role::checkRoot()) Reply::finish(true, 'success', $data);

        $o = [];
        $cmd = 'top -b -n2 -p1 -d1';
        exec($cmd, $o, $rc);

        foreach ($o as $output) {
            if (preg_match('/^%cpu.*\s([\d\.]+)(?=\sid).*$/mi', $output, $match)) {
                $data['cpu'] = 100 - (int) round($match[1]);
            }
        }

        $o = [];
        $cmd = 'df -h /';
        exec($cmd, $o, $rc);
        foreach ($o as $output) {
            if (preg_match('/^.*\s([\d\.]+[TGMKB]+)\s*([\d\.]+[TGMKB]+)\s*([\d\.]+[TGMKB])\s*([\d]+)%.*$/mi', $output, $match)) {
                $data['disk'] = $match[4];
                $data['total_disk'] = $match[1];
            }
        }

        Reply::finish(true, 'success', $data);
    }


    function apiSetCpuLimit(Request $request)
    {
        if (!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        $state = $request->input('state', true);
        if ($state == true) {
            $cmd = "sudo /opt/unetlab/wrappers/unl_wrapper -a cpulimiton";
        } else {
            $cmd = "sudo /opt/unetlab/wrappers/unl_wrapper -a cpulimitoff";
        }
        exec($cmd, $o, $rc);
        
        if ($rc == 0) {
            Reply::finish(true, 'success');
        } else {
            Reply::finish(false, 'Change CPU limit status fail');
        }
    }

    function apiSetUksm(Request $request)
    {
        if (!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        $state = $request->input('state', true);
        if ($state == true) {
            $cmd = "sudo /opt/unetlab/wrappers/unl_wrapper -a uksmon";
            error_log(date('M d H:i:s ') . 'DEBUG: uksm on');
        } else {
            $cmd = "sudo /opt/unetlab/wrappers/unl_wrapper -a uksmoff";
            error_log(date('M d H:i:s ') . 'DEBUG: uksm off');
        }
        exec($cmd, $o, $rc);
        if ($rc == 0) {
            Reply::finish(true, 'success');
        } else {
            Reply::finish(false, 'Change UKSM status fail');
        }
    }

    /*
* Function to set KSM status.
*
* @return  Bool Success operation
*/

    function apiSetKsm(Request $request)
    {
        if (!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        $state = $request->input('state', true);
        if ($state == true) {
            $cmd = "sudo /opt/unetlab/wrappers/unl_wrapper -a ksmon";
            error_log(date('M d H:i:s ') . 'DEBUG: ksm on');
        } else {
            $cmd = "sudo /opt/unetlab/wrappers/unl_wrapper -a ksmoff";
            error_log(date('M d H:i:s ') . 'DEBUG: ksm off');
        }
        exec($cmd, $o, $rc);
        if ($rc == 0) {
            Reply::finish(true, 'success');
        } else {
            Reply::finish(false, 'Change KSM status fail');
        }
    }
}
