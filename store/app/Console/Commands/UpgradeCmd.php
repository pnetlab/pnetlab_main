<?php

namespace App\Console\Commands;

use App\Helpers\Admin\Upgrade;
use Illuminate\Console\Command;

class UpgradeCmd extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'upgrade {now?}';

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
            sleep(rand(0, 3600));
        }
        print_r(Upgrade::run()); 
    }
    
}
