<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class MysqlRecovery extends Command
{

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mysql_recovery {action}';

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

    private function getMysqlStatus()
    {
        $o = [];
        exec('service mysql status | grep "Active"', $o, $r);
        if ($r !== 0) return null;
        if (!isset($o[0])) return null;
        $o = $o[0];
        if (preg_match('/\s*Active:\s*(active|inactive|activating|failed).*/', $o, $match)) {
            return $match[1];
        }
        return null;
    }

    private function stopMysql()
    {
        $cmd = 'pkill -9 -f mysqld';
        $o = [];
        exec($cmd, $o, $rc);

        $cmd = 'service mysql stop';
        $o = [];
        exec($cmd, $o, $rc);

        for ($i = 0; $i < 3; $i++) {
            $status = $this->getMysqlStatus();
            if ($status == 'inactive' || $status == 'failed') return true;
            sleep(5);
        }
        return false;
    }

    private function startMysql()
    {
        $cmd = 'service mysql start 2>/dev/null';
        $o = [];
        exec($cmd, $o, $rc);

        for ($i = 0; $i < 3; $i++) {
            $status = $this->getMysqlStatus();
            if ($status == 'active') return true;
            sleep(5);
        }
        return false;
    }

    private function restartMysql()
    {
        $cmd = 'service mysql restart 2>/dev/null';
        $o = [];
        exec($cmd, $o, $rc);

        for ($i = 0; $i < 3; $i++) {
            $status = $this->getMysqlStatus();
            if ($status == 'active') return true;
            sleep(5);
        }
        return false;
    }

    private function showLog($log)
    {
        $log = $log . "\n";
        $result = exec('tty');
        if ($result != '/dev/tty1') {
            exec('echo "' . $log . '" >> /dev/tty1');
        }
        echo $log;
    }

    private function recoveryMysql()
    {
        $this->showLog("Try recovering mysql database");
        $this->showLog("Stop mysql...");
        $result = $this->stopMysql();
        if (!$result) {
            $this->showLog("Can't stop mysql service");
            return false;
        }
        $this->showLog("Stop mysql service successfully");

        $cmd = 'rm -rf /var/lib/mysql/ib_logfile*';
        $o = [];
        exec($cmd, $o, $rc);

        $cmd = 'ls -l /var/lib/mysql | grep ib_logfile';
        $o = [];
        exec($cmd, $o, $rc);
        if (count($o) > 0) {
            $this->showLog("Can't Delete ib_logfile");
            return false;
        }
        return $result = $this->startMysql();
    }

    private function setForceRecovery($level = null)
    {
        exec("sed -i '/\[mysqld\]/d' /etc/mysql/mysql.cnf");
        exec("sed -i '/innodb_force_recovery/d' /etc/mysql/mysql.cnf");
        if ($level !== null) {
            exec('echo "[mysqld]" >> /etc/mysql/mysql.cnf');
            exec('echo "innodb_force_recovery=' . $level . '" >> /etc/mysql/mysql.cnf');
        }
    }

    private function resetMysql()
    {
        $this->showLog("Try resetting mysql database");
        $this->showLog("Stop mysql...");
        $result = $this->stopMysql();
        if (!$result) {
            $this->showLog("Can't stop mysql service");
            return false;
        }
        $this->showLog("Stop mysql service successfully");

        $cmd = 'rm -rf /var/lib/mysql/ib_logfile*';
        $o = [];
        exec($cmd, $o, $rc);

        for ($i = 3; $i < 7; $i++) {
            $this->showLog('Try to start mysql service with level ' . $i);
            $this->setForceRecovery($i);
            $result = $this->startMysql();
            if ($result) {
                $this->showLog("Start mysql service successfully with level " . $i);
                break;
            } else {
                $result = $this->stopMysql();
            }
        }

        $status = $this->getMysqlStatus();
        if ($status !== 'active') {
            $this->showLog('Can not start mysql service with all level');
            return false;
        }

        $this->showLog('Starting backup database');
        exec('rm -rf /opt/unetlab/database_backup');
        exec('mkdir /opt/unetlab/database_backup');
        exec('mysqldump -uroot -ppnetlab pnetlab_db --add-drop-table > /opt/unetlab/database_backup/pnetlab_db.sql 2>/dev/null', $o, $r1);
        exec('mysqldump -uroot -ppnetlab guacdb --add-drop-table > /opt/unetlab/database_backup/guacdb.sql 2>/dev/null', $o, $r2);
        if ($r1 != 0) {
            $this->showLog("Can't backup pnetlab_db");
            return false;
        }
        if ($r2 != 0) {
            $this->showLog("Can't backup guacdb");
            return false;
        }
        $this->showLog("Backup database successfully. Database backup folder: /opt/unetlab/database_backup");

        $result = $this->stopMysql();
        if (!$result) {
            $this->showLog("Can not stop service mysql");
            return false;
        }
        $this->showLog("Clean mysql lib folder");

        $cmd = 'rm -rf /var/lib/mysql/ib_logfile*';
        $o = [];
        exec($cmd, $o, $rc);

        $cmd = 'ls -l /var/lib/mysql | grep ib_logfile';
        $o = [];
        exec($cmd, $o, $rc);
        if (count($o) > 0) {
            $this->showLog("Can't Delete ib_logfile");
            return false;
        }

        $cmd = 'rm -f /var/lib/mysql/ibdata1';
        exec($cmd, $o, $rc);

        $cmd = 'rm -rf /var/lib/mysql/pnetlab_db';
        exec($cmd, $o, $rc);

        $cmd = 'rm -rf /var/lib/mysql/guacdb';
        exec($cmd, $o, $rc);

        $this->setForceRecovery(null);
        $result = $this->startMysql();
        if (!$result) {
            $this->showLog("Can't start mysql again");
            return false;
        }
        $this->showLog("Start service mysql successfully");

        $this->showLog("Create databases again");
        exec('mysql -uroot -ppnetlab -e "create database pnetlab_db" 2>/dev/null', $o, $r1);
        exec('mysql -uroot -ppnetlab -e "create database guacdb" 2>/dev/null', $o, $r2);
        if ($r1 != 0 || $r2 != 0) {
            $this->showLog("Can't create databases");
            return false;
        }
        $this->showLog("Import backed up databases");
        exec('mysql -uroot -ppnetlab pnetlab_db < /opt/unetlab/database_backup/pnetlab_db.sql 2>/dev/null', $o, $r1);
        exec('mysql -uroot -ppnetlab guacdb < /opt/unetlab/database_backup/guacdb.sql 2>/dev/null', $o, $r2);
        if ($r1 != 0 || $r2 != 0) {
            $this->showLog("Can't import databases");
            return false;
        }

        $this->showLog("Import backed up databases successfully");
        return $this->restartMysql();
    }


    private function checkHardisk()
    {
        $o = [];
        exec('df -k /', $o, $r);
        if ($r !== 0) return null;
        foreach ($o as $ouput) {
            if (preg_match('/([0-9]+)%\s*\/$/', $ouput, $match)) {
                return $match[1];
            }
        }
        return null;
    }

    private function main()
    {
        if (!is_dir('/opt/unetlab/html/store/')) {
            $this->showLog("Download PNETLab from pnetlab.com");
            return;
        }

        $hd = $this->checkHardisk();
        if ($hd === null) {
            $this->showLog('Can not check the hard disk');
            return;
        }
        if ($hd > 95) {
            $this->showLog("Hard disk is full. Please add more hardisk first");
            $this->showLog("Hard drive current is " . $hd . "%. Please add another hard drive and reboot (Do not expand existed Hard dirver)");
            return;
        }
        
        $this->setForceRecovery(null);
        $status = $this->getMysqlStatus();
        if ($status == 'active') {
            $this->showLog('Your service is working normally');
            return;
        }

        $result = $this->restartMysql();
        if ($result) {
            $this->showLog('Restart service successfully');
            return;
        }

        $result = $this->recoveryMysql();
        if ($result) {
            $this->showLog('Recovery mysql service successfully');
            $this->showLog("Note! Don't shut down your computer suddenly when PNETLab is working");
            return;
        }
        $this->showLog("Recovery mysql service faild. Need to reset mysql service");

        $result = $this->resetMysql();
        if ($result) {
            $this->showLog('Reset mysql service successfully');
            $this->showLog("Note! Don't shut down your computer suddenly when PNETLab is working");
            return;
        }
        exec("sed -i '/\[mysqld\]/d' /etc/mysql/mysql.cnf");
        exec("sed -i '/innodb_force_recovery/d' /etc/mysql/mysql.cnf");

        $this->showLog('Reset Mysql service faild. Please contact pnetlab.com for helping');
    }

    public function handle(){
        set_time_limit(0);
        $action = $this->argument('action');
        if($action == 'run'){
            $this->main();
        }
    }
}
