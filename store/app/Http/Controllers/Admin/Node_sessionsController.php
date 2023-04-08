<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\Admin\SystemHelper;
use App\Helpers\Auth\Role;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\Request\Checker;
use App\Helpers\Request\Reply;
use Illuminate\Support\Facades\Auth;
use App\Helpers\Uploader\FileFunc;
use App\Helpers\DB\Models;
use App\Model\Relation;

use function PHPSTORM_META\type;

class Node_sessionsController extends Controller
{

    function __construct()
    {
        parent::__construct();
        $this->mainModel = Models::get('Admin/Node_sessions');
        $this->viewblade = 'reactjs.reactjs';
        $this->dependCols = array_unique(array_column($this->mainModel->registerDepend, 1, 1));
        $this->dependCols[NODE_SESSION_ID] = true;
    }

    public function getNodeWorkspace(Request $request)
    {
        $node_id = $request->input('node_id', '');
        $nodeSession = $this->mainModel->read([[[NODE_SESSION_NID, '=', $node_id], [NODE_SESSION_LAB, '=', Auth::user()->{USER_LAB_SESSION}]]]);
        if (!$nodeSession['result']) return $nodeSession;
        if (!isset($nodeSession['data'][0])) Reply::finish(false, ERROR_UNDEFINE, ['data' => 'Node Session']);
        $node = $nodeSession['data'][0];
        $path = $nodeSession['data'][0]->{NODE_SESSION_WORKSPACE};
        if (is_dir($path)) {
            $status = 1;
            $size = SystemHelper::FolderSize($path);
        } else {
            $status = 0;
            $size = 0;
        }
        $attach = '';
        if($node->{NODE_SESSION_TYPE} == 'docker'){
            $attach = 'docker container attach docker'.$node->{NODE_SESSION_ID};
        }
        Reply::finish(true, 'success', ['path' => $path, 'status' => $status, 'size' => $size, 'attach' => $attach]);
    }

    public function checkCommitDevice(Request $request)
    {

        if (!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        $node_id = $request->input('node_id', '');
        if ($node_id == '') Reply::finish(false, ERROR_UNDEFINE, ['data' => 'Node ID']);

        $node_image = $request->input('node_image', '');
        if ($node_image == '') Reply::finish(false, ERROR_UNDEFINE, ['data' => 'Node Image']);

        $type = $request->input('type', '');
        if ($type == '') Reply::finish(false, ERROR_UNDEFINE, ['data' => 'Commit Type']);

        $nodeSession = $this->mainModel->read([[[NODE_SESSION_NID, '=', $node_id], [NODE_SESSION_LAB, '=', Auth::user()->{USER_LAB_SESSION}]]]);
        if (!$nodeSession['result']) return $nodeSession;
        if (!isset($nodeSession['data'][0])) Reply::finish(false, ERROR_UNDEFINE, ['data' => 'Node Session']);
        $nodeSession = $nodeSession['data'][0];
        if ($nodeSession->{NODE_SESSION_TYPE} != 'docker' && $nodeSession->{NODE_SESSION_TYPE} != 'qemu') Reply::finish(false, 'This device does not support committing');

        if ($nodeSession->{NODE_SESSION_TYPE} == 'docker') {
            $addSize = SystemHelper::getNodeDisk($nodeSession);
            if ($addSize == null) Reply::finish(false, 'Can not find Docker container');
        } else if ($nodeSession->{NODE_SESSION_TYPE} == 'qemu') {

            $addSize = 0;
            if ($type == 'snapshot') {
                $addSize = (int) SystemHelper::FolderSize($nodeSession->{NODE_SESSION_WORKSPACE});
            } else {
                $files = scandir($nodeSession->{NODE_SESSION_WORKSPACE});
                $qcowFiles = [];
                foreach ($files as $file) {
                    if (preg_match('/^.+\.qcow2$/', $file)) {
                        $qcowFiles[] = $nodeSession->{NODE_SESSION_WORKSPACE} . '/' . $file;
                    }
                }

                foreach ($qcowFiles as $qcowFile) {
                    $o = [];
                    $result = exec('sudo qemu-img info --backing-chain ' . secureCmd($qcowFile) . ' | grep image', $o, $r);
                    foreach ($o as $item) {
                        if (preg_match('/^image\:\s+(.+)$/', $item, $match)) {
                            $qcowTree[] = $match[1];
                            if (!is_file($match[1])) Reply::finish(false, 'Can not define: {data}', ['data' => $match[1]]);
                        }
                    }
                    $qcowTree[0] = $qcowFile;
                    foreach ($qcowTree as $item) {
                        $addSize += filesize($item);
                    }
                }
            }
        }

        Reply::finish(true, 'success', $addSize);
    }

    public function commitDevice(Request $request)
    {
        if (!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        $node_id = $request->input('node_id', '');
        if ($node_id == '') Reply::finish(false, ERROR_UNDEFINE, ['data' => 'Node ID']);

        $node_image = $request->input('node_image', '');
        if ($node_image == '') Reply::finish(false, ERROR_UNDEFINE, ['data' => 'Node Image']);

        $type = $request->input('type', '');
        if ($type == '') Reply::finish(false, ERROR_UNDEFINE, ['data' => 'Commit Type']);

        if ($type == 'snapshot' || $type == 'new') {
            $deviceName = $request->input('device_name');
            $deviceName = preg_replace('/[^\w]/', '_', $deviceName);
            if ($deviceName == '') Reply::finish(false, ERROR_UNDEFINE, ['data' => 'Device Name']);
        }

        $nodeSession = $this->mainModel->read([[[NODE_SESSION_NID, '=', $node_id], [NODE_SESSION_LAB, '=', Auth::user()->{USER_LAB_SESSION}]]]);
        if (!$nodeSession['result']) return $nodeSession;
        if (!isset($nodeSession['data'][0])) Reply::finish(false, ERROR_UNDEFINE, ['data' => 'Node Session']);
        $nodeSession = $nodeSession['data'][0];
        if ($nodeSession->{NODE_SESSION_TYPE} != 'docker' && $nodeSession->{NODE_SESSION_TYPE} != 'qemu') Reply::finish(false, 'ERROR', ['data' => 'This device does not support committing']);

        $freeDisk = SystemHelper::getTotalDisk();
        if (!isset($freeDisk['free'])) Reply::finish(false, 'Your hardisk is full');
        $freeDisk = $freeDisk['free'] * 1024;

        if ($nodeSession->{NODE_SESSION_TYPE} == 'docker') {
            $addSize = SystemHelper::getNodeDisk($nodeSession);
            if ($addSize == null) Reply::finish(false, 'Can not find Docker container');
            if (($freeDisk - $addSize) < (100 * 1024 * 1024)) Reply::finish(false, 'You do not have enough free hard disk to save the new device');

            if ($type == 'new' || $type == 'snapshot') {
                $imageDocker = explode(':', $node_image);
                if (count($imageDocker) < 2) Reply::finish(false, ERROR_FORMAT, ['data' => 'Docker Image']);
                $newName = $imageDocker[0] . ':' . $deviceName;

                $result = exec('docker -H=tcp://127.0.0.1:4243 images -q ' . $newName, $o, $r);
                if (isset($o[0])) Reply::finish(false, 'This Name already exists');

                $result = exec('docker -H=tcp://127.0.0.1:4243 commit docker' . $nodeSession->{NODE_SESSION_ID} . ' ' . $newName, $o, $r);
                if ($r != 0) Reply::finish(false, 'Docker Commit Failed');
                Reply::finish(true, 'success', ['name' => $newName]);
            } else if ($type == 'existed') {

                $result = exec('docker -H=tcp://127.0.0.1:4243 images -q ' . $node_image, $o, $r);
                if (!isset($o[0])) Reply::finish(false, ERROR_UNDEFINE, ['data' => 'Docker Image']);
                $oldId = $o[0];

                $o = [];
                $result = exec('docker -H=tcp://127.0.0.1:4243 inspect ' . $oldId . ' --format="{{.Parent}}"', $o, $r);
                if (!isset($o[0]) || $o[0] == '') Reply::finish(false, "docker_commit_alert");

                $result = exec('docker -H=tcp://127.0.0.1:4243 commit docker' . $nodeSession->{NODE_SESSION_ID} . ' ' . $node_image, $o, $r);
                if ($r != 0) Reply::finish(false, 'Docker Commit Failed', 'Docker Commit Failed');

                if (isset($oldId)) $result = exec('docker -H=tcp://127.0.0.1:4243 image rm ' . $oldId, $o, $r);

                Reply::finish(true, 'success', ['name' => '']);
            }
        } else if ($nodeSession->{NODE_SESSION_TYPE} == 'qemu') {
            $addSize = SystemHelper::getNodeDisk($nodeSession);
            if ($addSize == null) Reply::finish(false, 'Can not find Qemu folder');

            $addSize += (int) SystemHelper::FolderSize('/opt/unetlab/addons/qemu/' . $node_image);
            if ($freeDisk - $addSize < 100 * 1024 * 1024) Reply::finish(false, 'You do not have enough free hard disk to save the new device');


            $files = scandir($nodeSession->{NODE_SESSION_WORKSPACE});
            $qcowFiles = [];
            foreach ($files as $file) {
                if (preg_match('/^.+\.qcow2$/', $file)) {
                    $qcowFiles[] = $nodeSession->{NODE_SESSION_WORKSPACE} . '/' . $file;
                }
            }

            if ($type == 'existed') {
                foreach ($qcowFiles as $qcowFile) {
                    $result = exec('sudo qemu-img commit ' . $qcowFile . ' 2>&1', $o, $r);
                    if ($r != 0) Reply::finish(false, 'Qemu Commit Failed.' . $result);
                }
                Reply::finish(true, 'success', ['name' => '']);
            } else if ($type == 'snapshot') {
                $imageQemu = explode('-', $node_image);
                if (count($imageQemu) < 1) Reply::finish(false, ERROR_FORMAT, ['data' => 'Qemu Image']);

                $newName = $imageQemu[0] . '-' . $deviceName;
                $newFolder = '/opt/unetlab/addons/qemu/' . $newName;

                if (is_dir($newFolder)) Reply::finish(false, 'This Name already exists');
                $result = exec('sudo mkdir ' . $newFolder);

                foreach ($qcowFiles as $qcowFile) {
                    $result = exec('sudo cp -f ' . $qcowFile . ' ' . $newFolder . '/' . basename($qcowFile), $o, $r);
                    if ($r != 0) Reply::finish(false, 'Qemu Commit Failed.' . $result);
                }

                $result = exec('sudo chown -R www-data:www-data ' . $newFolder);
                Reply::finish(true, 'success', ['name' => $newName]);
            } else if ($type == 'new') {
                $imageQemu = explode('-', $node_image);
                if (count($imageQemu) < 1) Reply::finish(false, ERROR_FORMAT, ['data' => 'Qemu Image']);

                $newName = $imageQemu[0] . '-' . $deviceName;
                $newFolder = '/opt/unetlab/addons/qemu/' . $newName;
                $oldFolder = '/opt/unetlab/addons/qemu/' . $node_image;
                $tmpFolder = '/tmp/commit/' . $nodeSession->{NODE_SESSION_ID};
                $result = exec('sudo rm -rf ' . $tmpFolder);

                if (is_dir($newFolder)) Reply::finish(false, 'This Name already exists');

                if (!is_dir($oldFolder)) Reply::finish(false, 'Original Folder is not exists');
                $result = exec('sudo mkdir ' . $newFolder);

                foreach ($qcowFiles as $qcowFile) {
                    $o = [];
                    $result = exec('sudo qemu-img info --backing-chain ' . $qcowFile . ' | grep image', $o, $r);
                    $qcowTree = [];

                    foreach ($o as $item) {
                        if (preg_match('/^image\:\s+(.+)$/', $item, $match)) {
                            $qcowTree[] = $match[1];
                            if (!is_file($match[1])) Reply::finish(false, 'Can not define: ' . $match[1]);
                        }
                    }
                    $qcowTree[0] = $qcowFile;

                    foreach ($qcowTree as $item) {
                        $tmpFile = $tmpFolder . $item;
                        $result = exec('sudo mkdir -p ' . dirname($tmpFile), $o, $r);
                        $result = exec('sudo cp -f ' . $item . ' ' . $tmpFile);
                    }

                    foreach ($qcowTree as $key => $item) {
                        $tmpFile = $tmpFolder . $item;
                        if (isset($qcowTree[$key + 1])) {
                            $parentFile = $tmpFolder . $qcowTree[$key + 1];
                            $result = exec('sudo qemu-img rebase -b ' . $parentFile . ' ' . $tmpFile, $o, $r);
                            $result = exec('sudo qemu-img commit ' . $tmpFile, $o, $r);
                        } else {
                            exec('sudo mv -f ' . $tmpFile . ' ' . $newFolder . '/' . basename($tmpFile));
                        }
                    }
                }

                $result = exec('sudo rm -rf ' . $tmpFolder);
                $result = exec('sudo chown -R www-data:www-data ' . $newFolder);

                Reply::finish(true, 'success', ['name' => $newName]);
            }
        }
    }


    public function read(Request $request)
    {
        Checker::method('post');
        $readResult = $this->mainModel->read([], function($db){
            $db->where(NODE_SESSION_LAB, '=', Auth::user()->{USER_LAB_SESSION});
        });
        return $readResult;
    }

    public function getConsume(Request $request)
    {
        if($request->isMethod('get')) Reply::finish(false, 'ERROR', ['data'=>'Not support Get']);
        $readResult = $this->mainModel->read([], null, true, [
            NODE_SESSION_LAB, 
            NODE_SESSION_CPU, 
            NODE_SESSION_RAM, 
            NODE_SESSION_HDD,
            NODE_SESSION_POD
        ]);
        return $readResult;
    }



}
