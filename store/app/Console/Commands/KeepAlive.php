<?php

namespace App\Console\Commands;

use App\Helpers\Admin\SystemHelper;
use App\Helpers\Box\License;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Helpers\Request\Query;
use App\Helpers\Control\Ctrl;
use App\Helpers\DB\Models;

class KeepAlive extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'keepalive {now?}';

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
            sleep(rand(0, 50*60));
        }

        try {
            $result = SystemHelper::updateDomain();
            print_r($result);
        } catch (\Exception $e) {
            echo $e->getMessage();
        }
       

        $result = License::keepalive();
        print_r($result);

       
        
    }
    
}
