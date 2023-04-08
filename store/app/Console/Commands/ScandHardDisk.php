<?php

namespace App\Console\Commands;

use App\Helpers\Admin\SystemHelper;
use App\Helpers\DB\Models;
use App\Helpers\Request\Query;
use App\Helpers\Request\Reply;
use Illuminate\Console\Command;

class ScandHardDisk extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scand_hard_disk';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();

        $this->unitMapping = [
            'B' => 1,

            'KiB' => pow(1024, 1),
            'MiB' => pow(1024, 2),
            'GiB' => pow(1024, 3),
            'TiB' => pow(1024, 4),
            'PiB' => pow(1024, 5),

            'kB' => pow(1000, 1),
            'MB' => pow(1000, 2),
            'GB' => pow(1000, 3),
            'TB' => pow(1000, 4),
            'PB' => pow(1000, 5),
        ];
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */

    public function handle()
    {
        set_time_limit(0);

        $nodeData = [];
        
        $tmpFolder = '/opt/unetlab/tmp';

        $labSessions = scandir($tmpFolder);
        array_splice($labSessions, 0, 2);

        foreach ($labSessions as $labSession) {
            $nodeSessions = scandir("$tmpFolder/$labSession");
            array_splice($nodeSessions, 0, 2);
            foreach ($nodeSessions as $nodeSession) {
                $nodeData[$nodeSession] = [
                    'size' => round(SystemHelper::FolderSize("$tmpFolder/$labSession/$nodeSession")*10 / pow(1000,2))/10,
                    'path' => "$tmpFolder/$labSession/$nodeSession",
                    'docker' => false,
                ];
            }
        }


        $out = [];
        exec('docker -H=tcp://127.0.0.1:4243 container ls -a --format={{.Names}}:{{.Size}}', $out, $rc);
        if ($rc == 0) {
            foreach ($out as $dockerName) {
                if (preg_match('/docker(\d+):([\d\.]+)(\w+)/', $dockerName, $maches)) {
                    if (!isset($nodeData[$maches[1]])) $nodeData[$maches[1]] = [];
                    $nodeData[$maches[1]]['size'] = round($maches[2] * $this->unitMapping[$maches[3]]*10 / pow(1000,2))/10;
                    $nodeData[$maches[1]]['docker'] = true;
                }
            }
        }


        $nodeModel = Models::get('Admin/Node_sessions');
        $nodeModel->db()->update([NODE_SESSION_HDD => 0]);
        $nodes = $nodeModel->read();
        if ($nodes['result']) {
            $nodes = $nodes['data'];
            foreach ($nodes as $node) {
                $nodeId = $node->{NODE_SESSION_ID};
                if (isset($nodeData[$nodeId])) {
                    $result = $nodeModel->edit([
                        DATA_KEY => [[[NODE_SESSION_ID, '=', $nodeId]]],
                        DATA_EDITOR => [NODE_SESSION_HDD => $nodeData[$nodeId]['size']]
                    ]);
                    unset($nodeData[$nodeId]);
                }
            }
        }

        if (count($nodeData) > 0) {
            foreach ($nodeData as $key => $node) {
                $this->stop($key, $node);
                $this->wipe($key, $node);
            }
        }
    }

    private function wipe($session, $node)
    {
        if (isset($node['docker']) && $node['docker']) {
            $cmd = 'sudo /usr/bin/docker -H=tcp://127.0.0.1:4243 rm docker' . $session;
            exec($cmd, $o, $rc);
        }
        $runningPath = $node['path'];
        if ($runningPath != null && $runningPath != '') {
            $cmd = 'sudo rm -rf ' . $runningPath;
            exec($cmd, $o, $rc);
        }
        return 0;
    }

    private function stop($session, $node)
    {
        if (isset($node['docker']) && $node['docker']) {
            $cmd = 'sudo docker -H=tcp://127.0.0.1:4243 stop docker' . $session;
        } else {
            $cmd = 'sudo fuser -k -TERM ' . $node['path'] . ' > /dev/null 2>&1';
        }
        error_log(date('M d H:i:s ') . 'INFO: stopping ' . $cmd);
        exec($cmd, $o, $rc);
        usleep(200000); //sleep waiting for vunl free
        $cmd = 'ifconfig | grep vunl' . $session . ' | cut -d\' \' -f1 | while read line; do sudo ip link set $line down; sudo tunctl -d $line; done';
        error_log(date('M d H:i:s ') . 'ERROR: ' . $cmd);
        exec($cmd, $o, $rc);

    }
}
