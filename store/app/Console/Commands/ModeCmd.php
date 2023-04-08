<?php

namespace App\Console\Commands;

use App\Helpers\Admin\Upgrade;
use App\Helpers\Control\Ctrl;
use App\Helpers\DB\Models;
use Illuminate\Console\Command;

class ModeCmd extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mode {action} {object?}';

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
        
        
        
        
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */

    public function handle()
    {
        set_time_limit(0);

        $action = $this->argument('action');
        $obj = $this->argument('object');
        if($action == 'default'){
            if($obj == 'online'){
                Ctrl::set(CTRL_DEFAULT_MODE, 'online');
                echo "ONLINE Mode is set as Default\n";
            }else{
                Ctrl::set(CTRL_DEFAULT_MODE, 'offline');
                echo "OFFLINE Mode is set as Default\n";
            }
        }
        else if ($action == 'reset'){
            if($obj == 'offline'){
                Ctrl::set(CTRL_DEFAULT_MODE, 'offline');
                Ctrl::set(CTRL_ONLINE_MODE, '0');
                Ctrl::set(CTRL_OFFLINE_MODE, '1');
                $userModel = Models::get('Admin/Users');
                if($userModel->is_exist([[[USER_USERNAME, '=', 'admin']]])){
                    $userModel->edit([
                        DATA_KEY => [[[USER_USERNAME, '=', 'admin']]],
                        DATA_EDITOR => [USER_ROLE => '0', USER_PASSWORD => hash('sha256', LOCAL_PASS), USER_OFFLINE=>'1']
                    ]);
                }else{
                    $userModel->add([[
                        USER_USERNAME => 'admin',
                        USER_ROLE => '0',
                        USER_OFFLINE => '1',
                        USER_PASSWORD => hash('sha256', LOCAL_PASS),
                    ]]);
                }

                echo "OFFLINE Mode is reset. Default Account is admin/".LOCAL_PASS."\n";
            }
            else if($obj == 'all'){
                Ctrl::set(CTRL_DEFAULT_MODE, '0');
                Ctrl::set(CTRL_ONLINE_MODE, '0');
                Ctrl::set(CTRL_OFFLINE_MODE, '0');
                Models::get('Admin/Users')->drop([[[USER_ROLE, '=', '0']]]);       
                echo "System Mode is reset\n";     
            }
        }
    }
    
}
