<?php

/**
 * 
 * @author LIN 
 * @copyright pnetlab.com
 * @link https://www.pnetlab.com/
 * 
 */

class device_c2691 extends device_dynamips
{

    public function createEthernets($quantity)
    {
        return $this->createModule(0, 0, 'GT96100-FE');
    }

    public function editParams($p)
    {

        parent::editParams($p);

        for ($i = 1; $i <= 1; $i++) {
            $key = 'slot' . $i;
            $nmid = $i . '/0';
            if (isset($p[$key]) && $p[$key] != '') {
                if (!isset($this->modules[$nmid]) || $this->modules[$nmid]->getName() != $p[$key]) {
                    $this->createModule($i, 0, $p[$key]);
                }
            } else if(isset($p[$key])){
                unset($this->modules[$nmid]);
            }
        }
        
        for ($i = 1; $i <= 3; $i++) {
            $key = 'wic' . $i;
            $nmid = '0/' . $i;
           
            if (isset($p[$key]) && $p[$key] != '') {
                if (!isset($this->modules[$nmid]) || $this->modules[$nmid]->getName() != $p[$key]) {
                    $this->createModule(0, $i, $p[$key]);
                }
            } else if(isset($p[$key])){
                unset($this->modules[$nmid]);
            }
        }
    }

    public function getParams()
    {
        $params = parent::getParams();
        $data = [];
        for ($i = 1; $i <= 1; $i++) {
            $key = 'slot' . $i;
            $nmid = $i . '/0';
            $data[$key] = isset($this->modules[$nmid]) ? $this->modules[$nmid]->getName() : '';
        }

        for ($i = 1; $i <= 3; $i++) {
            $key = 'wic' . $i;
            $nmid = '0/' . $i;
            $data[$key] = isset($this->modules[$nmid]) ? $this->modules[$nmid]->getName() : '';
        }
        return array_replace($params, $data);
    }
}
