<?php

namespace App\Console\Commands;

use App\Helpers\DB\Models;
use App\Helpers\Request\Query;
use App\Helpers\Request\Reply;
use Illuminate\Console\Command;

class ScandProcess extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scand_process';

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
        exec('sudo rm -f /root/.toprc');

        $cores = exec('sudo nproc --all');
        $cores = (int)$cores;

        $out = [];
        $data = exec('sudo top -n2 -c -b -w 512 | egrep "%CPU|qemu|unetlab\/tmp|dynamip|vpcs" | grep -v "grep" | grep -v "wrapper"', $out, $rc);
        $start = 0;

        $nodeData = [];
        $labData = [];

        foreach($out as $line){
            
            if (strpos($line, '%CPU %MEM') !== false){
                $start++;
                continue;
            }
            
            if($start == 2){
                $line = trim($line);
                if(preg_match('/^\d+\s+unl\w+\s+[^\s]+\s+[^\s]+\s+[^\s]+\s+[^\s]+\s+[^\s]+\s+[SRZI]\s+([\w\.]+)\s+([\w\.]+)[^\/]*\/opt\/unetlab\/tmp\/\d+\/(\d+)\/.*$/', $line, $matches)){
                    if(!isset($nodeData[$matches[3]])){
                        $nodeData[$matches[3]] = [round($matches[1]*1000/$cores)/1000, $matches[2]];
                    }else{
                        $nodeData[$matches[3]] = [ round($matches[1]*1000/$cores)/1000 + $nodeData[$matches[3]][0], $matches[2]+$nodeData[$matches[3]][1] ];
                    }
                }

                else if(preg_match('/^\d+\s+\w+\s+[^\s]+\s+[^\s]+\s+[^\s]+\s+[^\s]+\s+[^\s]+\s+[SRZI]\s+([\w\.]+)\s+([\w\.]+)[^\/]*\/opt\/qemu.*vunl(\d+)_.*$/', $line, $matches)){
                    if(!isset($nodeData[$matches[3]])){
                        $nodeData[$matches[3]] = [round($matches[1]*1000/$cores)/1000, $matches[2]];
                    }else{
                        $nodeData[$matches[3]] = [ round($matches[1]*1000/$cores)/1000 + $nodeData[$matches[3]][0], $matches[2]+$nodeData[$matches[3]][1] ];
                    }
                }

                else if(preg_match('/^\d+\s+\w+\s+[^\s]+\s+[^\s]+\s+[^\s]+\s+[^\s]+\s+[^\s]+\s+[SRZI]\s+([\w\.]+)\s+([\w\.]+)[^ds]*\sdynamips.*vunl(\d+)_.*$/', $line, $matches)){
                    if(!isset($nodeData[$matches[3]])){
                        $nodeData[$matches[3]] = [round($matches[1]*1000/$cores)/1000, $matches[2]];
                    }else{
                        $nodeData[$matches[3]] = [ round($matches[1]*1000/$cores)/1000 + $nodeData[$matches[3]][0], $matches[2]+$nodeData[$matches[3]][1] ];
                    }
                }

                else if(preg_match('/^\d+\s+\w+\s+[^\s]+\s+[^\s]+\s+[^\s]+\s+[^\s]+\s+[^\s]+\s+[SRZI]\s+([\w\.]+)\s+([\w\.]+)[^\/]*\/opt\/vpcsu\/bin\/vpcs.*vunl(\d+)_.*$/', $line, $matches)){
                    if(!isset($nodeData[$matches[3]])){
                        $nodeData[$matches[3]] = [round($matches[1]*1000/$cores)/1000, $matches[2]];
                    }else{
                        $nodeData[$matches[3]] = [ round($matches[1]*1000/$cores)/1000 + $nodeData[$matches[3]][0], $matches[2]+$nodeData[$matches[3]][1] ];
                    }
                }
            } 
        }

        $cmd = 'free -m';
        $o=[];
        $totalRam = 0;
        exec($cmd, $o, $rc);
        foreach ($o as $output) {
            if (preg_match('/^mem:\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+).*$/mi', $output, $match)) {
                $totalRam = $match[1]*$this->unitMapping['MiB'];
            }
        }


        $out = [];
        $data = exec('docker -H=tcp://127.0.0.1:4243 stats --no-stream', $out, $rc);
        foreach($out as $line){
            if(preg_match('/^\w+\s+docker(\d+)\s+([\d\.]+)%\s+([\d\.]+)(\w+).*$/', $line, $matches)){
                if($totalRam == 0) continue;
                $cpu = round($matches[2]*1000/$cores)/1000;
                $ram = round($matches[3] * $this->unitMapping[$matches[4]] * 1000 / $totalRam)/10;
                $nodeData[$matches[1]] = [$cpu, $ram];
            }
            
        }
        
        $nodeModel = Models::get('Admin/Node_sessions');
        $nodeModel->db()->update([NODE_SESSION_CPU => 0, NODE_SESSION_RAM => 0, NODE_SESSION_RUNNING=>0]);

        $nodes = $nodeModel->read();

        if($nodes['result']){
            $nodes = $nodes['data'];
            foreach($nodes as $node){
                $nodeId = $node->{NODE_SESSION_ID};
                if(isset($nodeData[$nodeId])){
                    $result = $nodeModel->edit([
                        DATA_KEY => [[[NODE_SESSION_ID, '=', $nodeId]]],
                        DATA_EDITOR => [NODE_SESSION_CPU => $nodeData[$nodeId][0], NODE_SESSION_RAM => $nodeData[$nodeId][1], NODE_SESSION_RUNNING => 1]
                    ]);

                    if(!isset($labData[$node->{NODE_SESSION_LAB}])){
                        $labData[$node->{NODE_SESSION_LAB}] = 1;
                    }else{
                        $labData[$node->{NODE_SESSION_LAB}] ++;
                    }
                }
            }
        }

        $labModel = Models::get('Admin/Lab_sessions');
        $labModel->db()->update([LAB_SESSION_RUNNING => 0]);
        
        foreach($labData as $key => $lab){
            $result = $labModel->edit([
                DATA_KEY => [[[LAB_SESSION_ID, '=', $key]]],
                DATA_EDITOR => [LAB_SESSION_RUNNING => $lab]
            ]);
        }

    }
}
