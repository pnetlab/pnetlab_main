<?php

namespace App\Console\Commands;

use App\Helpers\Box\License;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Helpers\Request\Query;
use App\Helpers\Control\Ctrl;
use App\Helpers\DB\Models;

class Relicense extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'relicense {now?}';

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

        $now = $this->argument('now');
        if($now != 'now'){
            sleep(rand(0, 180));
        }

        $users = Models::get('Admin/Users')->read([[ [USER_ONLINE_TIME, '>', time()-3600], [USER_OFFLINE, '=', 0] ]]);
        if(!$users['result']){print_r($users); return; }
        $users = $users['data'];
        foreach($users as $user){
            $result = License::relicense(false, $user);
            print_r($result);
        }

    }

}
