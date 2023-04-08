<?php


class Lab
{
    private $author;
    private $body;
    private $description;
    private $filename;
    private $id;
    private $name;
    private $networks = array();
    private $nodes = array();
    private $path;
    private $textobjects = array();
    private $pictures = array();
    private $tenant;
    private $version;
    private $scripttimeout;
    private $password;

    //=====================PNETLAB==========================
    private $isEncrypt = false;
    private $session;
    public $node_sessions = array(); // session data of all node of this lab session, using to create node
    public $if_sessions = array(); // session data of all interface of this lab session, using to edit interface
    private $lab_session = array();
    private $logDecrypt = '';
    private $logCode = 0;
    private $labId = '';
    private $runningNodes = null;
    private $file = null;
    private $countdown = 60;
    private $darkmode = 0;
    private $mode3d = 0;
    private $nogrid = 0;

    private $joinable = null; // 0: admin only, 1: everyone, 2: specific by joinable email
    private $joinable_emails = array();

    private $openable = null; // 0: admin only, 1: everyone, 2: specific by joinable email
    private $openable_emails = array();

    private $editable = null; // 0: admin only, 1: everyone, 2: specific by joinable email
    private $editable_emails = array();



    /**
     * Constructor which load an existent lab or create an empty one.
     *
     * @param	  string  $f                  the file of the lab with full path
     * @param	  int     $tenant             Tenant ID
     * @return	  void
     */
    public function __construct($f, $tenant, $session = null, $email = null)
    {
       
        $modified = False;
        $this->session = $session;
        if ($session != null) {
            $this->node_sessions = $this->getNodeSessions($session);
            $this->if_sessions = $this->getIfSessions($session);
            $this->lab_session = getLabFromSession($session);
        }
        $this->tenant = (int) $tenant;
        $this->file = $f;

        $this->filename = basename($f);
        $this->path = dirname($f);


        if (!checkLabFilename($this->filename)) {
            // Invalid filename
            error_log(date('M d H:i:s ') . 'ERROR: ' . $f . ' ' . $GLOBALS['messages'][20001]);
            emptyLabSession($tenant);
            throw new Exception('20001');
        }

        if (!checkLabPath($this->path)) {
            // Invalid path
            error_log(date('M d H:i:s ') . 'ERROR: ' . $f . ' ' . $GLOBALS['messages'][20002]);
            emptyLabSession($tenant);
            throw new Exception('20002');
        }

        /** EVE STORE */
        $sample = '/opt/unetlab/html/store/storage/app/Sample_LAB.unl';

        if (!is_file($f) && !is_file($sample)) {
            // File does not exist, create a new empty lab
            $this->name = substr(basename($f), 0, -4);
            $this->id = genUuid();
            $modified = True;
        } else {

            libxml_use_internal_errors(true);

            //==========PNETLAB=============================
            if (is_file($f)) {
                $unlContent = file_get_contents($f);
            } else {
                $unlContent = file_get_contents($sample);
                $modified = True;
                $this->joinable = 2;
                $this->openable = 2;
                $this->editable = 2;
                $this->joinable_emails = [$email];
                $this->openable_emails = [$email];
                $this->editable_emails = [$email];
            }

            if (substr($unlContent, 0, 5) == '<?xml') {
                $this->isEncrypt = false;
                
            } else {
                
                $unlContent = $this->crypt_lab($unlContent, null, 'd');
                if (!$unlContent) {
                    emptyLabSession($tenant);
                    throw new ResponseException($this->logDecrypt, ['id' => $this->labId], $this->logCode);
                }
                $this->isEncrypt = true;
            }

            $xml = simplexml_load_string($unlContent, 'SimpleXMLElement', LIBXML_PARSEHUGE);

            //==========PNETLAB=============================

            if (!$xml) {
                // Invalid XML document
                $errorLog = '';
                foreach (libxml_get_errors() as $error) {
                    $errorLog .= $error->message;
                }
                error_log(date('M d H:i:s ') . 'ERROR: ' . $f . ' ' . $GLOBALS['messages'][20003] . $errorLog);
                emptyLabSession($tenant);
                throw new Exception('20003');
            }

            // Lab name
            $patterns[0] = '/\.unl$/';
            $replacements[0] = '';
            $this->name = preg_replace($patterns, $replacements, basename($f));


            /** ===========PNETLAB workbook ===============*/
            $result = $xml->xpath('//lab/workbooks');
            if (isset($result[0])) {
                $this->workbooks = [];
                foreach ($result[0]->workbook as $workbook) {
                    $name = (string) $workbook->attributes()->id;
                    $type = (string) $workbook->attributes()->type;
                    $weight = (string) $workbook->attributes()->weight;
                    $wb = (object) [
                        'name' => $name,
                        'type' => $type,
                        'weight' => $weight,
                    ];
                    if ($type == 'pdf') {
                        if (isset($workbook->content[0])) {
                            $content = (string) $workbook->content[0];
                        } else {
                            $content = '';
                        }
                        $wb->content = $content;
                    } else {
                        $wb->content = [];
                        if (isset($workbook->content[0])) {
                            foreach ($workbook->content[0]->page as $page) {
                                $wb->content[] = (string) $page;
                            }
                        }

                        if (isset($workbook->menu[0])) {
                            $wb->menu = json_decode((string) $workbook->menu[0]);
                        }
                    }

                    $this->workbooks[] = $wb;
                }
            }
            /** =============================================*/

            // Lab ID
            $result = $xml->xpath('//lab/@id');
            if (empty($result)) {
                // Lab ID not set, create a new one
                $this->id = genUuid();
                error_log(date('M d H:i:s ') . 'WARNING: ' . $f . ' ' . $GLOBALS['messages'][20011]);
                $modified = True;
            } else if (!checkUuid($result[0])) {
                // Attribute not valid
                $this->id = genUuid();
                error_log(date('M d H:i:s ') . 'WARNING: ' . $f . ' ' . $GLOBALS['messages'][20012]);
                $modified = True;
            } else {
                $this->id = (string) $result[0];
            }

            $result = $xml->xpath('//lab/@multi_config_active');
            if (isset($result)) {
                $this->multi_config_active = (string) array_pop($result);
            }

            // Lab description
            $result = $xml->xpath('//lab/description');
            $result = (string) array_pop($result);
            if (strlen($result) !== 0) {
                $this->description = htmlspecialchars($result, ENT_DISALLOWED, 'UTF-8', TRUE);
            } else if (strlen($result) !== 0) {
                error_log(date('M d H:i:s ') . 'WARNING: ' . $f . ' ' . $GLOBALS['messages'][20006]);
            }

            // Lab body
            $result = $xml->xpath('//lab/body');
            $result = (string) array_pop($result);
            if (strlen($result) !== 0) {
                $this->body = htmlspecialchars($result, ENT_DISALLOWED, 'UTF-8', TRUE);
            } else if (strlen($result) !== 0) {
                error_log(date('M d H:i:s ') . 'WARNING: ' . $f . ' ' . $GLOBALS['messages'][20006]);
            }

            // Lab author
            $result = $xml->xpath('//lab/@author');
            $result = (string) array_pop($result);
            if (strlen($result) !== 0) {
                $this->author = htmlspecialchars($result, ENT_DISALLOWED, 'UTF-8', TRUE);
            } else if (strlen($result) !== 0) {
                error_log(date('M d H:i:s ') . 'WARNING: ' . $f . ' ' . $GLOBALS['messages'][20007]);
            }

            // Lab version
            $result = $xml->xpath('//lab/@version');
            $result = (string) array_pop($result);
            if (strlen($result) !== 0 && (int) $result >= 0) {
                $this->version = $result;
            } else if (strlen($result) !== 0) {
                error_log(date('M d H:i:s ') . 'WARNING: ' . $f . ' ' . $GLOBALS['messages'][20008]);
            }

            // Lab networks
            foreach ($xml->xpath('//lab/topology/networks/network') as $network) {
                $w = array();
                if (isset($network->attributes()->id)) $w['id'] = (string) $network->attributes()->id;
                if (isset($network->attributes()->left)) $w['left'] = (string) $network->attributes()->left;
                if (isset($network->attributes()->name)) $w['name'] = (string) $network->attributes()->name;
                if (isset($network->attributes()->top)) $w['top'] = (string) $network->attributes()->top;
                if (isset($network->attributes()->type)) $w['type'] = (string) $network->attributes()->type;
                if (isset($network->attributes()->visibility)) $w['visibility'] = (string) $network->attributes()->visibility;
                if (isset($network->attributes()->icon)) $w['icon'] = (string) $network->attributes()->icon;
                if (isset($network->attributes()->size)) $w['size'] = (string) $network->attributes()->size;

                try {
                    $this->networks[$w['id']] = new Network($w, $w['id'], $this);
                } catch (Exception $e) {
                    // Invalid network
                    error_log(date('M d H:i:s ') . 'WARNING: ' . $f . ':net' . $w['id'] . ' ' . $GLOBALS['messages'][20009]);
                    error_log(date('M d H:i:s ') . (string) $e);
                    continue;
                }
            }

            // Lab nodes (networks must be alredy loaded)
            foreach ($xml->xpath('//lab/topology/nodes/node') as $node_id => $node) {
                $n = array();

                if (isset($node->attributes()->id)) $n['id'] = (int) $node->attributes()->id;
                if (isset($node->attributes()->template)) $n['template'] = (string) $node->attributes()->template;
                if (isset($node->attributes()->type)) $n['type'] = (string) $node->attributes()->type;

                
                $this->nodes[$n['id']] = new Node($n, $n['id'], $this->tenant, $this, $this->node_sessions);

                $params = [];
                $options = $this->nodes[$n['id']]->getOptions();
                foreach ($options as $key => $value) {
                    if (isset($node->attributes()->$key)) $params[$key] = (string) $node->attributes()->$key;
                }

                /** Get config and multi config for old .unl lab file */
                try {
                    // If config is empty, force "None"
                    $result = $xml->xpath('//lab/objects/configs/config[@id="' . $n['id'] . '"]');
                    $result = (string) array_pop($result);
                    if (strlen($result) > 0) {
                        $params['config_data'] = $result;
                    }

                    /* PNETLAB load multi config */
                    $multiConfig = $xml->xpath('//lab/multi_configs/multi_config_lab[@id="' . $n['id'] . '"]');
                    $multiConfig = (string) array_pop($multiConfig);
                    if (strlen($result) > 0) {
                        $params['multi_config'] = $multiConfig;
                    }
                } catch (Exception $th) {
                    //throw $th;
                }

                $this->nodes[$n['id']]->edit($params);

                foreach ($node->interface as $interface) {
                    // Loading configured interfaces for this node
                    $i = array();
                    $attrs = $interface->attributes();
                    
                    $i['id'] = (string) $interface->attributes()->id;
                    $i['type'] = (string) $interface->attributes()->type;
                    $i['networks'] = $this->networks;

                    foreach ($attrs as $key => $value) {
                        $i[$key] = (string) $value;
                    }
                    
                    $this->nodes[$n['id']]->linkInterface($i);
                }

            }

            // lab script timeout
            $result = $xml->xpath('//lab/@scripttimeout');
            $result = (string) array_pop($result);
            if (strlen($result) !== 0 && (int) $result >= 300) {
                $this->scripttimeout = $result;
            } else if (strlen($result) !== 0) {
                error_log(date('M d H:i:s ') . 'WARNING: ' . $f . ' ' . $GLOBALS['messages'][20045]);
                $this->scripttimeout = 300;
            }
            // lab lock
            $result = $xml->xpath('//lab/@password');
            $result = (string) array_pop($result);
            $this->password = $result;

            // Lab Pictures
            foreach ($xml->xpath('//lab/objects/pictures/picture') as $picture) {
                $p = array();
                if (isset($picture->attributes()->id)) $p['id'] = (string) $picture->attributes()->id;
                if (isset($picture->attributes()->name)) $p['name'] = (string) $picture->attributes()->name;
                if (isset($picture->attributes()->type)) $p['type'] = (string) $picture->attributes()->type;
                $result = $picture->xpath('./data');
                $result = (string) array_pop($result);
                if (strlen($result) > 0) $p['data'] = base64_decode($result);
                $result = $picture->xpath('./map');
                $result = (string) array_pop($result);
                
                if (strlen($result) > 0) $p['map'] = html_entity_decode($result);
                
                try {
                    $this->pictures[$p['id']] = new Picture($p, $p['id']);
                } catch (Exception $e) {
                    // Invalid picture
                    error_log(date('M d H:i:s ') . 'WARNING: ' . $f . ':pic' . $p['id'] . ' ' . $GLOBALS['messages'][20020]);
                    error_log(date('M d H:i:s ') . (string) $e);
                    continue;
                }
            }

            // Text Objects
            foreach ($xml->xpath('//lab/objects/textobjects/textobject') as $textobject) {
                $p = array();
                if (isset($textobject->attributes()->id)) $p['id'] = (string) $textobject->attributes()->id;
                if (isset($textobject->attributes()->name)) $p['name'] = (string) $textobject->attributes()->name;
                if (isset($textobject->attributes()->type)) $p['type'] = (string) $textobject->attributes()->type;
                $result = $textobject->xpath('./data');
                $result = (string) array_pop($result);
                if (strlen($result) > 0) $p['data'] = $result;

                try {
                    $this->textobjects[$p['id']] = new TextObject($p, $p['id']);
                } catch (Exception $e) {
                    // Invalid picture
                    error_log(date('M d H:i:s ') . 'WARNING: ' . $f . ':obj' . $p['id'] . ' ' . $GLOBALS['messages'][20041]);
                    error_log(date('M d H:i:s ') . (string) $e);
                    continue;
                }
            }

            /** PNETLAB line */
            $this->lineobjects = [];
            foreach ($xml->xpath('//lab/objects/lineobjects/lineobject') as $lineobject) {
                $p = array();
                if (isset($lineobject->attributes()->id)) $p['id'] = (string) $lineobject->attributes()->id;
                if (isset($lineobject->attributes()->width)) $p['width'] = (string) $lineobject->attributes()->width;
                if (isset($lineobject->attributes()->linestyle)) $p['linestyle'] = (string) $lineobject->attributes()->linestyle;
                if (isset($lineobject->attributes()->paintstyle)) $p['paintstyle'] = (string) $lineobject->attributes()->paintstyle;
                if (isset($lineobject->attributes()->color)) $p['color'] = (string) $lineobject->attributes()->color;
                if (isset($lineobject->attributes()->label)) $p['label'] = (string) $lineobject->attributes()->label;
                if (isset($lineobject->attributes()->endsym)) $p['endsym'] = (string) $lineobject->attributes()->endsym;
                if (isset($lineobject->attributes()->startsym)) $p['startsym'] = (string) $lineobject->attributes()->startsym;
                if (isset($lineobject->attributes()->x1)) $p['x1'] = (string) $lineobject->attributes()->x1;
                if (isset($lineobject->attributes()->x2)) $p['x2'] = (string) $lineobject->attributes()->x2;
                if (isset($lineobject->attributes()->y1)) $p['y1'] = (string) $lineobject->attributes()->y1;
                if (isset($lineobject->attributes()->y2)) $p['y2'] = (string) $lineobject->attributes()->y2;
                if (isset($lineobject->attributes()->linecfg)) $p['linecfg'] = (string) $lineobject->attributes()->linecfg;
                $this->lineobjects[$p['id']] = $p;
            }
        }

        $result = $xml->xpath('//lab/@countdown');
        $result = (string) array_pop($result);
        $this->countdown = $result;

        $result = $xml->xpath('//lab/@darkmode');
        $result = (string) array_pop($result);
        $this->darkmode = $result;

        $result = $xml->xpath('//lab/@mode3d');
        $result = (string) array_pop($result);
        $this->mode3d = $result;

        $result = $xml->xpath('//lab/@nogrid');
        $result = (string) array_pop($result);
        $this->nogrid = $result;

        if ($this->joinable === null) {
            $result = $xml->xpath('//lab/@joinable');
            $result = (string) array_pop($result);
            $this->joinable = $result;

            $result = $xml->xpath('//lab/@joinable_emails');
            $result = (string) array_pop($result);
            if ($result == '') $this->joinable_emails = [];
            $this->joinable_emails = explode(',', $result);
        }


        if ($this->openable === null) {
            $result = $xml->xpath('//lab/@openable');
            $result = (string) array_pop($result);
            $this->openable = $result;

            $result = $xml->xpath('//lab/@openable_emails');
            $result = (string) array_pop($result);
            if ($result == '') $this->openable_emails = [];
            $this->openable_emails = explode(',', $result);
        }

        if ($this->editable === null) {
            $result = $xml->xpath('//lab/@editable');
            $result = (string) array_pop($result);
            $this->editable = $result;

            $result = $xml->xpath('//lab/@editable_emails');
            $result = (string) array_pop($result);
            if ($result == '') $this->editable_emails = [];
            $this->editable_emails = explode(',', $result);
        }

        if ($modified) {
            // Need to save
            $rc = $this->save();
            if ($rc != 0) {
                emptyLabSession($tenant);
                throw new Exception($rc);
                return $rc;
            }
        }

        return 0;
    }




    private function crypt_data($string, $action = 'e')
    {
        // you may change these values to your own
        try {

            $secret_key = "gsgsgsghkjjghksgs%^465#";
            $secret_iv = "etwdgsio##kljhjgf%^465#";

            $output = false;
            $encrypt_method = "AES-256-CBC";
            $key = hash('sha256', $secret_key);
            $iv = substr(hash('sha256', $secret_iv), 0, 16);
            if ($action == 'e') {
                $output = base64_encode(openssl_encrypt(time() . '##time##' . $string, $encrypt_method, $key, 0, $iv));
            } else if ($action == 'd') {
                $output = openssl_decrypt(base64_decode($string), $encrypt_method, $key, 0, $iv);

                $outputArray = explode('##time##', $output);
                $output = [];
                $output['payload'] = $outputArray[1];
                $output['iat'] = $outputArray[0];
            }
            return $output;
        } catch (\Exception $e) {
            return false;
        }
    }


    private function crypt_lab($content, $id, $action = 'e')
    {
        $this->logDecrypt = '';
        $this->logCode = 0;
        try {
            $pattern = 'amxranNnaGdq';
            if ($action == 'e') {
                $content = base64_encode($content);
                $firstPart = $id . $pattern . substr($content, 0, 10000);
                $theRest = substr($content, 10000);
                $firstE = $this->crypt_data($firstPart, 'e');
                return $firstE . $pattern . $theRest;
            } else {

                $labArray = explode($pattern, $content);
                if (!isset($labArray[1])) $labArray[1] = '';
                $decryptData = $this->crypt_data($labArray[0], 'd');
                $decryptData = $decryptData['payload'];
                $decryptArray = explode($pattern, $decryptData);

                $id = $decryptArray[0];
                $this->labId = $id;
                $lab = $decryptArray[1] . $labArray[1];
                $lab = base64_decode($lab);

                return $lab;
            }
        } catch (\Exception $e) {
            return false;
        }
    }

    
    private function getNodeSessions($lab_session)
    {
        
        $nodeSessions = array();
        $nodeModel = loadModel('node_sessions');
        $result = $nodeModel->get([[NODE_SESSION_LAB, '=', $lab_session]]);
        array_map(function ($item) use (&$nodeSessions) {
            $nodeSessions[$item[NODE_SESSION_NID]] = $item;
        }, $result);
        return $nodeSessions;
    }

    private function getIfSessions($lab_session)
    {
        $ifSessions = array();
        $nodeModel = loadModel('if_sessions');
        $result = $nodeModel->get([[IF_SESSION_LAB, '=', $lab_session]]);
        array_map(function ($item) use (&$ifSessions) {
            $ifSessions[$item[IF_SESSION_NODE] . '_' . $item[IF_SESSION_IFID]] = $item;
        }, $result);
        return $ifSessions;
    }

    public function getSession()
    {
        return $this->session;
    }

    public function getFile()
    {
        return $this->file;
    }

    public function getCountdown()
    {
        return $this->countdown;
    }

    public function getOpenable()
    {
        return $this->openable;
    }

    public function getJoinable()
    {
        return $this->joinable;
    }

    public function getEditable()
    {
        return $this->editable;
    }

    public function getOpenableEmails()
    {
        return $this->openable_emails;
    }

    public function getJoinableEmails()
    {
        return $this->joinable_emails;
    }

    public function getEditableEmails()
    {
        return $this->editable_emails;
    }


    /**
     * Method to add a new network.
     *
     * @param   Array   $p                  Parameters
     * @return	int	                        0 if OK
     */
    public function addNetwork($p)
    {
        // $p['id'] = $this->getFreeNetworkId();

        // Adding the network
        try {
            $this->networks[$p['id']] = new Network($p, $p['id'], $this);
            $this->networks[$p['id']]->addSysNetwork();
            return $this->save();
        } catch (Exception $e) {
            // Failed to create the network
            error_log(date('M d H:i:s ') . 'ERROR: ' . $this->path . '/' . $this->filename . '?net=' . $p['id'] . ' ' . $GLOBALS['messages'][20021]);
            error_log(date('M d H:i:s ') . (string) $e);
            return 20021;
        }
        return 0;
    }

    /**
     * Method to add a new node.
     *
     * @param   Array   $p                  Parameters
     * @return	int	                        0 if OK
     */
    public function addNode($p)
    {
        $p['id'] = $this->getFreeNodeId();

        // Add the node
        try {
            $this->nodes[$p['id']] = new Node($p, $p['id'], $this->tenant, $this, $this->node_sessions);
            return $this->save();
        } catch (Exception $e) {
            // Failed to create the node
            error_log(date('M d H:i:s ') . 'ERROR: ' . $this->path . '/' . $this->filename . '?node=' . $p['id'] . ' ' . $GLOBALS['messages'][20022]);
            error_log(date('M d H:i:s ') . (string) $e);
            return 20022;
        }
    }

    /**
     * Method to add a new text object.
     *
     * @param   Array   $p                  Parameters
     * @return	int	                        0 if OK
     */
    public function addTextObject($p)
    {
        $p['id'] = 1;
        $object = new stdClass();
        $object->id = -1;
        $object->status = 0;
        // Finding a free object ID
        while (True) {
            if (!isset($this->textobjects[$p['id']])) {
                break;
            } else {
                $p['id'] = $p['id'] + 1;
            }
        }

        // Adding the object
        try {
            $this->textobjects[$p['id']] = new TextObject($p, $p['id']);
            $this->save();
            $object->id = $p['id'];
            $object->status = 0;
            return $object;
        } catch (Exception $e) {
            // Failed to create the picture
            error_log(date('M d H:i:s ') . 'ERROR: ' . $this->path . '/' . $this->filename . '?pic=' . $p['id'] . ' ' . $GLOBALS['messages'][20042]);
            error_log(date('M d H:i:s ') . (string) $e);
            $object->status = 20042;
            return $object;
        }
    }


    /**
     * Method to add a new picture.
     *
     * @param   Array   $p                  Parameters
     * @return	int	                        0 if OK
     */
    public function addPicture($p)
    {
        $p['id'] = 1;

        // Finding a free picture ID
        while (True) {
            if (!isset($this->pictures[$p['id']])) {
                break;
            } else {
                $p['id'] = $p['id'] + 1;
            }
        }

        // Adding the picture
        try {
            $this->pictures[$p['id']] = new Picture($p, $p['id']);
            return $this->save();
        } catch (Exception $e) {
            // Failed to create the picture
            error_log(date('M d H:i:s ') . 'ERROR: ' . $this->path . '/' . $this->filename . '?pic=' . $p['id'] . ' ' . $GLOBALS['messages'][20017]);
            error_log(date('M d H:i:s ') . (string) $e);
            return 20017;
        }
    }

    /**
     * Method to delete a network.
     *
     * @param   int     $i                  Network ID
     * @return  int                         0 if OK
     */
    public function deleteNetwork($i)
    {
        
        if (isset($this->networks[$i])) {
            // Unlink node interfaces
            foreach ($this->getNodes() as $node_id => $node) {
                foreach ($node->getInterfaces() as $interface_id => $interface) {
                    if ($interface->getNetworkId() == $i) {
                        $node->unlinkInterface($interface_id, true);
                    }
                }
            }
            unset($this->networks[$i]);
        } else {
            error_log(date('M d H:i:s ') . 'WARNING: ' . $this->path . '/' . $this->filename . '?net=' . $i . ' ' . $GLOBALS['messages'][20023]);
        }
        return $this->save();

    }

    /**
     * Method to delete a node.
     *
     * @param   int     $i                  Node ID
     * @return  int                         0 if OK
     */
    public function deleteNode($i)
    {
        if (isset($this->nodes[$i])) {
            $node = $this->nodes[$i];
            if (!empty($node->getSerials())) {
                // Node has configured Serial interfaces
                foreach ($node->getSerials() as $interface_id => $interface) {
                    if ($interface->getRemoteId() != 0) {
                        try {
                            // Serial interface is configured, unlink remote node
                            $rc = $this->nodes[$interface->getRemoteId()]->unlinkInterface($interface->getRemoteIf());
                            if ($rc !== 0) {
                                error_log(date('M d H:i:s ') . 'WARNING: ' . $this->path . '/' . $this->filename . '?node=' . $interface->getRemoteId() . ' ' . $GLOBALS['messages'][20035]);
                            }
                        } catch (Exception $e) {
                        }
                    }
                }
            }

            // Delete the node
            $result = $node->delNodeSession();

            if (!$result['result']) throw new Exception(get($result['data'], ''));
            unset($this->nodes[$i]);
        } else {
            error_log(date('M d H:i:s ') . 'WARNING: ' . $this->path . '/' . $this->filename . '?node=' . $i . ' ' . $GLOBALS['messages'][20024]);
        }
        return $this->save();
    }

    /**
     * Method to delete a text object.
     *
     * @param   int     $i                  Object ID
     * @return  int                         0 if OK
     */
    public function deleteTextObject($i)
    {
        if (isset($this->textobjects[$i])) {
            unset($this->textobjects[$i]);
        } else {
            error_log(date('M d H:i:s ') . 'WARNING: ' . $this->path . '/' . $this->filename . '?obj=' . $i . ' ' . $GLOBALS['messages'][20043]);
        }
        return $this->save();
    }

    /**
     * Method to delete a picture.
     *
     * @param   int     $i                  Picture ID
     * @return  int                         0 if OK
     */
    public function deletePicture($i)
    {
        if (isset($this->pictures[$i])) {
            unset($this->pictures[$i]);
        } else {
            error_log(date('M d H:i:s ') . 'WARNING: ' . $this->path . '/' . $this->filename . '?pic=' . $i . ' ' . $GLOBALS['messages'][20018]);
        }
        return $this->save();
    }

    /**
     * Method to add or replace the lab metadata.
     * Editable attributes:
     * - author
     * - description
     * - version
     * If an attribute is set and is valid, then it will be used. If an
     * attribute is not set, then the original is maintained. If in attribute
     * is set and empty '', then the current one is deleted.
     *
     * @param   Array   $p                  Parameters
     * @return  int                         0 means ok
     */
    public function edit($p)
    {
        $modified = False;

        if (isset($p['name']) && !checkLabFilename($p['name'] . '.unl')) {
            // Name is not valid, ignored
            error_log(date('M d H:i:s ') . 'WARNING: ' . $GLOBALS['messages'][20038]);
        } else if (isset($p['name'])) {
            $this->name = $p['name'];
            $modified = True;
        }

        if (isset($p['author']) && $p['author'] === '') {
            // Author is empty, unset the current one
            unset($this->author);
            $modified = True;
        } else if (isset($p['author'])) {
            $this->author = htmlspecialchars($p['author'], ENT_DISALLOWED, 'UTF-8', TRUE);
            $modified = True;
        }

        if (isset($p['body']) && $p['body'] === '') {
            // Body is empty, unset the current one
            unset($this->body);
            $modified = True;
        } else if (isset($p['body'])) {
            $this->body = htmlspecialchars($p['body'], ENT_DISALLOWED, 'UTF-8', TRUE);
            $modified = True;
        }

        if (isset($p['description']) && $p['description'] === '') {
            // Description is empty, unset the current one
            unset($this->description);
            $modified = True;
        } else if (isset($p['description'])) {
            $this->description = htmlspecialchars($p['description'], ENT_DISALLOWED, 'UTF-8', TRUE);
            $modified = True;
        }

        if (isset($p['version']) && $p['version'] === '') {
            // Version is empty, unset the current one
            unset($this->version);
            $modified = True;
        } else if (isset($p['version']) && (int) $p['version'] < 0) {
            // Version is not valid, ignored
            error_log(date('M d H:i:s ') . 'WARNING: ' . $GLOBALS['messages'][30008]);
        } else if (isset($p['version'])) {
            $this->version = (int) $p['version'];
            $modified = True;
        }
        if (isset($p['scripttimeout'])) {
            $this->scripttimeout = (int) $p['scripttimeout'];
            $modified = True;
        }
        if (isset($p['countdown'])) {
            $this->countdown = (int) $p['countdown'];
            $modified = True;
        }
        if (isset($p['openable'])) {
            $this->openable = (int) $p['openable'];
            $modified = True;
        }
        if (isset($p['joinable'])) {
            $this->joinable = (int) $p['joinable'];
            $modified = True;
        }
        if (isset($p['editable'])) {
            $this->editable = (int) $p['editable'];
            $modified = True;
        }
        if (isset($p['openable_emails'])) {
            $this->openable_emails = (array) $p['openable_emails'];
            $modified = True;
        }
        if (isset($p['joinable_emails'])) {
            $this->joinable_emails = (array) $p['joinable_emails'];
            $modified = True;
        }
        if (isset($p['editable_emails'])) {
            $this->editable_emails = (array) $p['editable_emails'];
            $modified = True;
        }

        if ($modified) {
            // At least an attribute is changed
            return $this->save();
        } else {
            // No attribute has been changed
            error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][20030]);
            return 20030;
        }
    }

    /**
     * Method to edit a network.
     *
     * @param   Array   $p                  Parameters
     * @return	int	                        0 if OK
     */
    public function editNetwork($p)
    {
        if (!isset($this->networks[$p['id']])) {
            // Network not found
            error_log(date('M d H:i:s ') . 'ERROR: ' . $this->path . '/' . $this->filename . '?net=' . $p['id'] . ' ' . $GLOBALS['messages'][20023]);
            return 20023;
        } else if ($this->networks[$p['id']]->edit($p) === 0) {
            if (isset($p['save']) && $p['save'] === 0) {
                return 0;
            } else {
                return $this->save();
            }
        } else {
            error_log(date('M d H:i:s ') . 'ERROR: ' . $this->path . '/' . $this->filename . '?net=' . $p['id'] . ' ' . $GLOBALS['messages'][20025]);
            return False;
        }
    }

    /**
     * Method to edit a node.
     *
     * @param   Array   $p                  Parameters
     * @return	int	                        0 if OK
     */
    public function editNode($p)
    {
        if (!isset($this->nodes[$p['id']])) {
            // Node not found
            error_log(date('M d H:i:s ') . 'ERROR: ' . $this->path . '/' . $this->filename . '?node=' . $p['id'] . ' ' . $GLOBALS['messages'][20024]);
            return 20024;
        } else {
            $this->nodes[$p['id']]->edit($p);

            if (isset($p['save']) && $p['save'] === 0) {
                return 0;
            } else {
                return $this->save();
            }
        }
    }

    /**
     * Method to edit a text object.
     *
     * @param   Array   $p                  Parameters
     * @return	int	                        0 if OK
     */
    public function editTextObject($p)
    {
        if (!isset($this->textobjects[$p['id']])) {
            // Picture not found
            error_log(date('M d H:i:s ') . 'ERROR: ' . $this->path . '/' . $this->filename . '?obj=' . $p['id'] . ' ' . $GLOBALS['messages'][20043]);
            return 20043;
        } else if ($this->textobjects[$p['id']]->edit($p) === 0) {
            if (isset($p['save']) && $p['save'] === 0) {
                return 0;
            } else {
                return $this->save();
            }
        } else {
            error_log(date('M d H:i:s ') . 'ERROR: ' . $this->path . '/' . $this->filename . '?obj=' . $p['id'] . ' ' . $GLOBALS['messages'][20044]);
            return False;
        }
    }

    /**
     * Method to edit a picture.
     *
     * @param   Array   $p                  Parameters
     * @return	int	                        0 if OK
     */
    public function editPicture($p)
    {
        if (!isset($this->pictures[$p['id']])) {
            // Picture not found
            error_log(date('M d H:i:s ') . 'ERROR: ' . $this->path . '/' . $this->filename . '?pic=' . $p['id'] . ' ' . $GLOBALS['messages'][20018]);
            return 20018;
        } else if ($this->pictures[$p['id']]->edit($p) == 0) {
            return $this->save();
        } else {
            error_log(date('M d H:i:s ') . 'ERROR: ' . $this->path . '/' . $this->filename . '?pic=' . $p['id'] . ' ' . $GLOBALS['messages'][20019]);
            return False;
        }
    }

    /**
     * Method to get lab author.
     *
     * @return  string                      Lab author or False if not set
     */
    public function getAuthor()
    {
        if (isset($this->author)) {
            return $this->author;
        } else {
            // By default return an empty string
            return '';
        }
    }

    /**
     * Method to get lab body.
     *
     * @return  string                      Lab body or False if not set
     */
    public function getBody()
    {
        if (isset($this->body)) {
            return $this->body;
        } else {
            // By default return an empty string
            return '';
        }
    }

    /**
     * Method to get lab description.
     *
     * @return  string                      Lab description or False if not set
     */
    public function getDescription()
    {
        if (isset($this->description)) {
            return $this->description;
        } else {
            // By default return an empty string
            return '';
        }
    }

    /**
     * Method to get lab filename.
     *
     * @return  string                      Lab filename
     */
    public function getFilename()
    {
        return $this->filename;
    }

    /**
     * Method to get free network ID.
     *
     * @return  int                         Free network ID
     */
    public function getFreeNetworkId()
    {
        $id = 1;

        // Finding a free network ID
        while (True) {
            if (!isset($this->networks[$id])) {
                return $id;
            }
            $id = $id + 1;
        }
    }

    /**
     * Method to get free node ID.
     *
     * @return  int                         Free node ID
     */
    public function getFreeNodeId()
    {
        $id = 1;

        // Finding a free node ID
        while (True) {
            if (!isset($this->nodes[$id])) {
                return $id;
            }
            $id = $id + 1;
        }
    }

    /**
     * Method to get lab ID.
     *
     * @return  string                      Lab ID
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Method to get lab name.
     *
     * @return  string                      Lab name
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Method to get all lab networks.
     *
     * @return  Array                       Lab networks
     */
    public function getNetworks()
    {
        if (!empty($this->networks)) {
            return $this->networks;
        } else {
            // By default return an empty array
            return array();
        }
    }

    /**
     * Method to get all lab nodes.
     *
     * @return  Array                       Lab nodes
     */
    public function getNodes()
    {
        if (!empty($this->nodes)) {
            return $this->nodes;
        } else {
            // By default return an empty array
            return array();
        }
    }

    public function getRunningNodes()
    {
        if ($this->runningNodes == null) {
            $runningNodes = [];
            foreach ($this->nodes as $node_id => $node) {
                $state = $node->getStatus();
                if ($state == 2 || $state == 3) {
                    $runningNodes[$node_id] = $node;
                }
            }
            $this->runningNodes = $runningNodes;
        }
        return $this->runningNodes;
    }

    public function isRunning()
    {
        $db = checkDatabase();
        $query = 'SELECT lab_session_id FROM lab_sessions WHERE lab_session_lid = :lab_session_lid';
        $statement = $db->prepare($query);
        $statement->execute(['lab_session_lid' => $this->getId()]);
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        return isset($result[0]);
    }

    /**
     * Method to get all lab objects.
     *
     * @return  Array                       Lab objects
     */
    public function getTextObjects()
    {
        if (!empty($this->textobjects)) {
            return $this->textobjects;
        } else {
            // By default return an empty array
            return array();
        }
    }

    /**
     * Method to get all lab pictures.
     *
     * @return  Array                       Lab pictures
     */
    public function getPictures()
    {
        if (!empty($this->pictures)) {
            return $this->pictures;
        } else {
            // By default return an empty array
            return array();
        }
    }

    /* Method to get all lab pictures.
         *
         * @return  Array                       Lab pictures
         */
    public function getPictureMapped($id, $html5)
    {
        error_log(date('M d H:i:s ') . $id . ' - ' . $html5);

        if (!empty($this->pictures[$id])) {
            $curpic = $this->pictures[$id];
            $curmap = $curpic->getMap();
            $curname = $curpic->getName();
            preg_match_all("|(.*href=')(.*NODE)(.*)(}}.*)|U", $curmap, $out, PREG_PATTERN_ORDER);
            $curmap = "";
            for ($i = 0; $i < count($out[0]); $i++) {
                $curnode = $this->getNodes()[$out[3][$i]];
                if ($html5 == 1) {
                    $curmap = $curmap . $out[1][$i] . $curnode->getConsoleUrl($html5) . '\' TARGET=\'' . $curnode->getName() . '\'>';
                } else {
                    $curmap = $curmap . $out[1][$i] . $curnode->getConsoleUrl($html5) . '\'>';
                }
            }
            $curpic->edit(array('name' => $curname, 'map' => $curmap));
            return $curpic;
        } else {
            // By default return an empty array
            return array();
        }
    }


    /**
     * Method to get lab path.
     *
     * @return  string                      Lab absolute path
     */
    public function getPath()
    {
        return $this->path;
    }

    /**
     * Method to get tenant ID.
     *
     * @return  int                         Tenant ID
     */
    public function getTenant()
    {
        return $this->tenant;
    }


    public function getHost()
    {
        if (isset($this->lab_session[LAB_SESSION_POD])) return $this->lab_session[LAB_SESSION_POD];
        return null;
    }

    /**
     * Method to get lab version.
     *
     * @return  string                      Lab version or False if not set
     */
    public function getVersion()
    {
        if (isset($this->version)) {
            return $this->version;
        } else {
            // By default return 0
            return 0;
        }
    }
    /**
     * Method to get lab scripttimeout
     *
     * @return  int                      Lab version or False if not set
     */
    public function getScriptTimeout()
    {
        if (isset($this->scripttimeout)) {
            return (int) $this->scripttimeout;
        } else {
            // By default return 0
            return 0;
        }
    }

    /**	
     * Method to get lab lock status
     *
     * @return  int Lab lock status 1=lock O=unlock
     */
    public function getPassword()
    {
        return $this->password;
    }

    public function isLock()
    {
        if (!isset($this->password) || $this->password == '') return 0;
        if (session_status() == PHP_SESSION_NONE) session_start();
        if (isset($_SESSION['key' . $this->id])) return 0;
        return 1;
    }

    /**
     * Method to connect a node to a network or to a remote node.
     *
     * @param   int     $n                  Node ID
     * @param   Array   $p                  Array of interfaces to link (index = interface_id, value = remote)
     * @return	int                         0 means ok
     */
    public function connectNode($n, $p)
    {
        if (!isset($this->nodes[$n])) {
            // Node not found
            error_log(date('M d H:i:s ') . 'ERROR: ' . $this->path . '/' . $this->filename . '?node=' . $n . ' ' . $GLOBALS['messages'][20032]);
            return 20032;
        }

        $result = 0;

        foreach ($p as $interface_id => $interface_link) {
            if ($interface_link !== '') {
                // Interface must be configured
                $i = array();
                $i['id'] = $interface_id;

                if (strpos($interface_link, ':') === False) {
                    // No ':' found -> simple Ethernet interface
                    if (isset($this->getNetworks()[$interface_link])) {
                        // Network exists
                        $i['network_id'] = $interface_link;
                        $i['networks'] = $this->getNetworks();
                        // Link the interface
                        if ($this->nodes[$n]->linkInterface($i, true) !== 0) {
                            error_log(date('M d H:i:s ') . 'ERROR: ' . $this->path . '/' . $this->filename . '?node=' . $n . ' ' . $GLOBALS['messages'][20034]);
                            return 20034;
                        }

                    } else {
                        error_log(date('M d H:i:s ') . 'ERROR: ' . $this->path . '/' . $this->filename . '?net=' . $interface_link . ' ' . $GLOBALS['messages'][20033]);
                        return 20033;
                    }
                } else {
                    // ':' found -> should be Serial interface
                    $remote_id = substr($interface_link, 0, strpos($interface_link, ':'));
                    $remote_if = substr($interface_link, strpos($interface_link, ':') + 1);

                    // Before connect, we need to unlink remote node of both source and destination node
                    $node = $this->nodes[$n];  // Source node
                    if (isset($node->getSerials()[$interface_id]) && $node->getSerials()[$interface_id]->getRemoteId() !== 0) {
                        // Serial interfaces was previously connected, need to unlink remote node
                        try {
                            $rc = $this->nodes[$node->getSerials()[$interface_id]->getRemoteId()]->unlinkInterface($node->getSerials()[$interface_id]->getRemoteIf());
                            if ($rc !== 0) {
                                error_log(date('M d H:i:s ') . 'WARNING: ' . $this->path . '/' . $this->filename . $GLOBALS['messages'][20035]);
                            }
                        } catch (Exception $e) {
                        }
                    }
                    $node = $this->nodes[$remote_id];  // Destination node
                    if (isset($node->getSerials()[$remote_if]) && $node->getSerials()[$remote_if]->getRemoteId() !== 0) {
                        // Serial interfaces was previously connected, need to unlink remote node
                        try {
                            $rc = $this->nodes[$node->getSerials()[$remote_if]->getRemoteId()]->unlinkInterface($node->getSerials()[$remote_if]->getRemoteIf());
                            if ($rc !== 0) {
                                error_log(date('M d H:i:s ') . 'WARNING: ' . $this->path . '/' . $this->filename . $GLOBALS['messages'][20035]);
                            }
                        } catch (Exception $e) {
                        }
                    }

                    // Connect local to remote: Local $n:$interface_id -> Remote $remote_id:$remote_if
                    $i['id'] = $interface_id;
                    $i['remote_id'] = $remote_id;
                    $i['remote_if'] = $remote_if;

                    // Link the interface
                    if ($this->nodes[$n]->linkInterface($i) !== 0) {
                        error_log(date('M d H:i:s ') . 'ERROR: ' . $this->path . '/' . $this->filename . '?node=' . $n . ' ' . $GLOBALS['messages'][20034]);
                        return 20034;
                    }

                    // Connect remote to local: Local $n:$interface_id <- Remote $remote_id:$remote_if
                    $i = array();
                    $i['id'] = $remote_if;
                    $i['remote_id'] = $n;
                    $i['remote_if'] = $interface_id;

                    // Link the interface
                    if ($this->nodes[$remote_id]->linkInterface($i) !== 0) {
                        error_log(date('M d H:i:s ') . 'ERROR: ' . $this->path . '/' . $this->filename . '?node=' . $remote_id . ' ' . $GLOBALS['messages'][20034]);
                        return 20034;
                    }

                   
                    $result = 1;
                    
                }
            } else {
                // Interface must be deconfigured
                $node = $this->nodes[$n];
                if (isset($node->getSerials()[$interface_id]) && $node->getSerials()[$interface_id]->getRemoteId() !== 0) {
                    // Serial interfaces was previously connected, need to unlink remote node
                    try {
                        $rc = $this->nodes[$node->getSerials()[$interface_id]->getRemoteId()]->unlinkInterface($node->getSerials()[$interface_id]->getRemoteIf());
                        if ($rc !== 0) {
                            error_log(date('M d H:i:s ') . 'WARNING: ' . $this->path . '/' . $this->filename . '?node=' . $node->getSerials()[$interface_id]->getRemoteId() . ' ' . $GLOBALS['messages'][20035]);
                        }
                    } catch (Exception $e) {
                    }
                }

                // Now deconfigure local interface
                $this->nodes[$n]->unlinkInterface($interface_id, true);
                $result = 1;
            }
        }
        $this->save();

        return $result;

        /** =============== */
    }


    /**
     * Method to Lock  lab 
     *
     * @return  int                         0 means ok
     */
    public function lockLab($pass = null)
    {
        if ($pass != null) {
            $this->password = md5($pass);
            $rc = $this->save();
        }
        if (session_status() == PHP_SESSION_NONE) session_start();
        unset($_SESSION['key' . $this->id]);
        return 0;
    }

    /**
     * Method to Unlock  lab
     *
     * @return  int                         0 means ok
     */
    public function unlockLab($pass, $clearpass = false)
    {
        if (!isset($this->password) || $this->password == '') return 0;
        if (md5($pass) == $this->password) {
            if ($clearpass) {
                $this->password = '';
                $rc = $this->save();
                return $rc;
            } else {
                if (session_status() == PHP_SESSION_NONE) session_start();
                $_SESSION['key' . $this->id] = true;
                return 0;
            }
        } else throw new Exception('Password is wrong');
    }

    /**
     * Method to save a lab into a file.
     *
     * @return  int                         0 means ok
     */
    public function save()
    {
        // TODO should lock file before editing it
        // XML header is splitted because of a highlight syntax bug on VIM
        $xml = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8" standalone="yes"?' . '><lab></lab>');
        $xml->addAttribute('name', $this->name);
        $xml->addAttribute('id', $this->id);

        if (isset($this->version)) $xml->addAttribute('version', $this->version);
        if (isset($this->scripttimeout)) $xml->addAttribute('scripttimeout', $this->scripttimeout);
        if (isset($this->password)) $xml->addAttribute('password', $this->password);
        if (isset($this->author)) $xml->addAttribute('author', $this->author);
        if (isset($this->description)) $xml->addChild('description', $this->description);
        if (isset($this->body)) $xml->addChild('body', $this->body);

        if (isset($this->countdown)) $xml->addAttribute('countdown', $this->countdown);
        if (isset($this->darkmode)) $xml->addAttribute('darkmode', $this->darkmode);
        if (isset($this->mode3d)) $xml->addAttribute('mode3d', $this->mode3d);
        if (isset($this->nogrid)) $xml->addAttribute('nogrid', $this->nogrid);
        if (isset($this->joinable)) $xml->addAttribute('joinable', $this->joinable);
        if (isset($this->joinable_emails)) $xml->addAttribute('joinable_emails', implode(',', $this->joinable_emails));
        if (isset($this->openable)) $xml->addAttribute('openable', $this->openable);
        if (isset($this->openable_emails)) $xml->addAttribute('openable_emails', implode(',', $this->openable_emails));
        if (isset($this->editable)) $xml->addAttribute('editable', $this->editable);
        if (isset($this->editable_emails)) $xml->addAttribute('editable_emails', implode(',', $this->editable_emails));
        if (isset($this->multi_config_active)) $xml->addAttribute('multi_config_active', $this->multi_config_active);

        // Add topology
        if (!empty($this->getNodes()) || !empty($this->getNetworks())) {
            $xml->addChild('topology');

            // Add nodes
            if (!empty($this->getNodes())) {
                $xml->topology->addChild('nodes');
                foreach ($this->getNodes() as $node_id => $node) {
                    $d = $xml->topology->nodes->addChild('node');
                    $d->addAttribute('id', $node_id);
                    $d->addAttribute('type', $node->getNType());
                    $d->addAttribute('template', $node->getTemplate());


                    $options =  $node->getOptions();
                    foreach ($options as $key => $value) {
                        $d->addAttribute($key, get($value, ''));
                    }

                    // Add Ethernet interfaces
                    foreach ($node->getEthernets() as $interface_id => $interface) {
                        if ($interface->getNetworkId() > 0 && isset($this->getNetworks()[$interface->getNetworkId()])) {

                            $e = $d->addChild('interface');
                            $e->addAttribute('id', $interface_id);
                            $e->addAttribute('name', $interface->getName());
                            $e->addAttribute('type', $interface->getNType());
                            $e->addAttribute('network_id', $interface->getNetworkId());

                            $style = $interface->getInterfaceStyle();
                            foreach ($style as $key => $value) {
                                $e->addAttribute($key, get($value, ''));
                            }
                        }
                    }

                    // Add Serial interfaces
                    foreach ($node->getSerials() as $interface_id => $interface) {
                        try {
                            if ($interface->getRemoteId() > 0 && isset($this->getNodes()[$interface->getRemoteId()])) {
                                $e = $d->addChild('interface');
                                $e->addAttribute('id', $interface_id);
                                $e->addAttribute('type', $interface->getNType());
                                $e->addAttribute('name', $interface->getName());
                                $e->addAttribute('remote_id', $interface->getRemoteId());
                                $e->addAttribute('remote_if', $interface->getRemoteIf());

                                $style = $interface->getInterfaceStyle();
                                foreach ($style as $key => $value) {
                                    $e->addAttribute($key, get($value, ''));
                                }
                            }
                        } catch (Exception $e) {
                        }
                    }
                }
            }


            // Add networks
            if (!empty($this->getNetworks())) {
                $xml->topology->addChild('networks');
                foreach ($this->getNetworks() as $network_id => $network) {
                    $n = $xml->topology->networks->addChild('network');
                    $n->addAttribute('id', $network_id);
                    $n->addAttribute('type', $network->getNType());
                    $n->addAttribute('name', $network->getName());
                    $n->addAttribute('left', $network->getLeft());
                    $n->addAttribute('top', $network->getTop());
                    $n->addAttribute('visibility', $network->getVisibility());
                    $n->addAttribute('icon', $network->getIcon());
                    $n->addAttribute('size', $network->getSize());
                }
            }
        }

        // Add text objects
        $objects = False;
        if (!empty($this->getTextObjects())) {
            if ($objects == False) {
                $xml->addChild('objects');
                $objects = True;
            }
            $xml->objects->addChild('textobjects');
        }
        foreach ($this->getTextObjects() as $textobject_id => $textobject) {
            $p = $xml->objects->textobjects->addChild('textobject');
            $p->addAttribute('id', $textobject_id);
            $p->addAttribute('name', $textobject->getName());
            $p->addAttribute('type', $textobject->getNType());
            $p->addChild('data', $textobject->getData());
        }

        $objects = False;
        if (!empty($this->getLineObjects())) {
            if ($objects == False) {
                $xml->addChild('objects');
                $objects = True;
            }
            $xml->objects->addChild('lineobjects');
        }
        foreach ($this->getLineObjects() as $lineobject_id => $lineobject) {
            $p = $xml->objects->lineobjects->addChild('lineobject');
            $p->addAttribute('id', $lineobject_id);
            if (isset($lineobject['width'])) $p->addAttribute('width', $lineobject['width']);
            if (isset($lineobject['linestyle'])) $p->addAttribute('linestyle', $lineobject['linestyle']);
            if (isset($lineobject['paintstyle'])) $p->addAttribute('paintstyle', $lineobject['paintstyle']);
            if (isset($lineobject['color'])) $p->addAttribute('color', $lineobject['color']);
            if (isset($lineobject['label'])) $p->addAttribute('label', $lineobject['label']);
            if (isset($lineobject['endsym'])) $p->addAttribute('endsym', $lineobject['endsym']);
            if (isset($lineobject['startsym'])) $p->addAttribute('startsym', $lineobject['startsym']);
            if (isset($lineobject['x1'])) $p->addAttribute('x1', $lineobject['x1']);
            if (isset($lineobject['x2'])) $p->addAttribute('x2', $lineobject['x2']);
            if (isset($lineobject['y1'])) $p->addAttribute('y1', $lineobject['y1']);
            if (isset($lineobject['y2'])) $p->addAttribute('y2', $lineobject['y2']);
            if (isset($lineobject['linecfg'])) $p->addAttribute('linecfg', $lineobject['linecfg']);
        }

        //=============================

        // Add pictures
        $objects = False;
        if (!empty($this->getPictures())) {
            if ($objects == False) {
                $xml->addChild('objects');
                $objects = True;
            }
            $xml->objects->addChild('pictures');
        }
        foreach ($this->getPictures() as $picture_id => $picture) {
            $p = $xml->objects->pictures->addChild('picture');
            $p->addAttribute('id', $picture_id);
            $p->addAttribute('name', $picture->getName());
            $p->addAttribute('type', $picture->getNType());
            $p->addAttribute('width', $picture->getWidth());
            $p->addAttribute('height', $picture->getHeight());
            $p->addChild('data', base64_encode($picture->getData()));
            $p->addChild('map', htmlspecialchars($picture->getMap()));
        }

        /** ====PNETLAB workbook===== */
        if (isset($this->workbooks)) {
            $xml->addChild('workbooks');
            foreach ($this->workbooks as $workbook) {
                $wb = $xml->workbooks->addChild('workbook');
                $wb->addAttribute('id', $workbook->name);
                $wb->addAttribute('type', $workbook->type);
                $wb->addAttribute('weight', $workbook->weight);
                if (isset($workbook->content)) {
                    if ($workbook->type == 'pdf') {
                        $wb->addChild('content', $workbook->content);
                    } else {
                        $content = $wb->addChild('content');
                        foreach ($workbook->content as $page) {
                            $content->addChild('page', $page);
                        }
                    }
                }

                if (isset($workbook->menu)) {
                    $wb->addChild('menu', json_encode($workbook->menu));
                }
            }
        }
        /** =========================== */


        // Well format the XML
        $dom = new DOMDocument('1.0');
        $dom->preserveWhiteSpace = false;
        $dom->formatOutput = true;
        $dom->loadXML($xml->asXML());
        //===================PNETLAB=====================
        $labContentXML = $dom->saveXML();

        // if ($this->isEncrypt) {
        //     $labContentXML = $this->crypt_lab($labContentXML, $this->labId, 'e');
        // }
        //========================================
        // Write to file
        // $tmp = $this -> path.'/'.$this -> name.'.swp';

        $tmp = tempnam($this->path, $this->name . '.swp');
        chown($tmp, "www-data");
        chmod($tmp, 0644);
        $old = $this->path . '/' . $this->filename;
        $dst = $this->path . '/' . $this->name . '.unl';
        $fp = fopen($tmp, 'w');
        $trylock = 60;
        while ($trylock > 0) {
            flock($fp, LOCK_EX) && $trylock = 0;
            $trylock -= 1;
            usleep(100000);
        }

        if ($trylock == 0 || !fwrite($fp, $labContentXML)) {
            // Failed to write
            fclose($fp);
            unlink($tmp);
            error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][20027]);
            return 20027;
        } else {

            // Write OK
            fflush($fp);
            fclose($fp);

            // error_log($tmp);
            // die;

            if ($old != $dst && is_file($dst)) {
                // Should rename the lab, but destination file already exists
                error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][20039]);
                return 20039;
            }
            if (is_file($old) && !unlink($old)) {
                // Cannot delete original lab
                unlink($tmp);
                error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][20028]);
                return 20028;
            }
            if (!rename($tmp, $dst)) {
                // Cannot move $tmp to $dst
                error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][20029]);
                return 20029;
            }
        }
        error_log(date('M d H:i:s ') . 'DEBUG: lab saved');
        return 0;
    }

    /**
     * Method to set a new lab_id
     *
     * @return	void
     */
    public function setId()
    {
        $this->id = genUuid();
        $this->save();
    }



    /**
     * Method to set startup-config for a specific node
     *
     * @param   int		$node_id			Node ID
     * @param   string  $config_data         Binary config
     * @return  int                         0 means ok
     */
    public function setNodeConfigData($node_id, $config_data)
    {
        if (!isset($this->nodes[$node_id])) {
            // Node not found
            error_log(date('M d H:i:s ') . 'ERROR: ' . $this->path . '/' . $this->filename . '?node=' . $node_id . ' ' . $GLOBALS['messages'][20024]);
            return 20024;
        } else if ($this->nodes[$node_id]->setConfigData($config_data) === 0) {
            return $this->save();
        } else {
            error_log(date('M d H:i:s ') . 'ERROR: ' . $this->path . '/' . $this->filename . '?node=' . $node_id . ' ' . $GLOBALS['messages'][20036]);
            return False;
        }
    }

    /**Multi config*/

    private $multi_config_active = '';

    /**
     *
     * @return the $multi_config_active
     */
    public function getMulti_config_active()
    {
        return $this->multi_config_active;
    }

    /**
     *
     * @param string $multi_config_active            
     */
    public function setMulti_config_active($multi_config_active)
    {
        $this->multi_config_active = $multi_config_active;
        // foreach($this->nodes as $node){
        //     $node->updateStartUpConfig();
        // }
    }


    /** Workbook */
    private $workbooks;
    public function getWorkbook($name = null)
    {
        if (isset($name) && $name != '') {
            if (!isset($this->workbooks)) throw new Exception('No workbook created');
            $workbook = array_find($this->workbooks, function ($item) use ($name) {
                return $item->name == $name;
            });

            if ($workbook === false) throw new Exception('Workbook not found');

            $workbook = $this->workbooks[$workbook];

            if ($workbook->type == 'pdf') {
                if (preg_match_all('/data:([^;]+);base64,(.*)/', $workbook->content, $match, PREG_SET_ORDER, 0)) {
                    $pdf_decoded = base64_decode($match[0][2]);
                    if (session_status() == PHP_SESSION_NONE) session_start();
                    $_SESSION[$workbook->name] = $pdf_decoded;
                }
            }

            $message = $workbook;
        } else {
            $message = [];
            if (isset($this->workbooks)) {
                foreach ($this->workbooks as $workbook) {
                    $message[] = [
                        'name' => $workbook->name,
                        'type' => $workbook->type,
                        'weight' => $workbook->weight,
                    ];
                }
            }
        }
        return $message;
    }

    public function addWorkbook($name, $type)
    {
        if (!isset($this->workbooks)) {
            $this->workbooks = [];
        }

        $workbook = array_find($this->workbooks, function ($item) use ($name) {
            return $item->name == $name;
        });

        if ($workbook !== false) {
            throw new Exception('This workbook is already existed. Please chose another name');
        }

        $this->workbooks[] = (object) [
            'name' => $name,
            'type' => $type,
            'weight' => time() . rand(1000, 9999),
        ];

        $result = $this->save();
        if ($result != 0) {
            throw new Exception($GLOBALS['messages'][$result]);
        }
    }

    public function delWorkbook($name)
    {
        if (!isset($this->workbooks)) {
            throw new Exception('No workbook found');
        }

        $workbook = array_find($this->workbooks, function ($item) use ($name) {
            return $item->name == $name;
        });

        if ($workbook === false) {
            throw new Exception('Workbook not found');
        } else {
            array_splice($this->workbooks, $workbook, 1);
        }
        $result = $this->save();
        if ($result != 0) {
            throw new Exception($GLOBALS['messages'][$result]);
        }
    }

    public function editWorkbook($name, $new_name)
    {
        if (!isset($this->workbooks)) {
            throw new Exception('No workbook found');
        }

        $workbook = array_find($this->workbooks, function ($item) use ($new_name) {
            return $item->name == $new_name;
        });

        if ($workbook !== false) {
            throw new Exception('This workbook is already existed. Please chose another name');
        }

        $workbook = array_find($this->workbooks, function ($item) use ($name) {
            return $item->name == $name;
        });
        if ($workbook === false) {
            throw new Exception('Workbook not found');
        } else {
            $this->workbooks[$workbook]->name = $new_name;
        }
        $result = $this->save();
        if ($result != 0) {
            throw new Exception($GLOBALS['messages'][$result]);
        }
    }

    public function changeOrder($src_name, $dest_name)
    {
        if (!isset($this->workbooks)) {
            throw new Exception('No workbook found');
        }

        $src_workbook = array_find($this->workbooks, function ($item) use ($src_name) {
            return $item->name == $src_name;
        });
        if ($src_workbook === false) {
            throw new Exception('Workbook not found');
        } else {
            $src_workbook = $this->workbooks[$src_workbook];
        }

        $dest_workbook = array_find($this->workbooks, function ($item) use ($dest_name) {
            return $item->name == $dest_name;
        });
        if ($dest_workbook === false) {
            throw new Exception('Workbook not found');
        } else {
            $dest_workbook = $this->workbooks[$dest_workbook];
        }

        $src_weight = $src_workbook->weight;
        $dest_weight = $dest_workbook->weight;

        $affects = [];
        if ($src_weight <= $dest_weight) {
            foreach ($this->workbooks as $item) {
                if ($item->weight >= $src_weight && $item->weight <= $dest_weight) $affects[] = $item;
            }
        } else {
            foreach ($this->workbooks as $item) {
                if ($item->weight <= $src_weight && $item->weight >= $dest_weight) $affects[] = $item;
            }
        }

        objSort($affects, function ($item) {
            return $item->weight;
        });

        if ($src_weight > $dest_weight) {
            foreach ($affects as $key => $item) {
                if (isset($affects[$key + 1])) {
                    $item->weight = $affects[$key + 1]->weight;
                }
            }
        } else {
            for ($key = count($affects) - 1; $key >= 0; $key--) {
                if (isset($affects[$key - 1])) {
                    $affects[$key]->weight = $affects[$key - 1]->weight;
                }
            }
        }
        $src_workbook->weight = $dest_weight;

        $result = $this->save();
        if ($result != 0) {
            throw new Exception($GLOBALS['messages'][$result]);
        }
    }

    public function updateContent($name, $content, $menu = [])
    {
        if (!isset($this->workbooks)) throw new Exception('No workbook found');

        $workbook = array_find($this->workbooks, function ($item) use ($name) {
            return $item->name == $name;
        });
        if ($workbook === false) throw new Exception('Workbook not found');
        $workbook = $this->workbooks[$workbook];

        if ((filesize($this->file) + strlen(json_encode($content))) > (50 * 1024 * 1024)) throw new Exception('
						Lab size must be less than 50M. The large Workbook size will reduce the Lab speed
					');

        if ($workbook->type == 'html') {
            $workbook->menu = $menu;
            $workbook->content = $content;
        } else {
            $workbook->content = $content;
        }

        $result = $this->save();
        if ($result != 0) {
            throw new Exception($GLOBALS['messages'][$result]);
        }
    }

    /* lineobjects*/

    private $lineobjects = array();
    public function getLineObjects()
    {
        return $this->lineobjects;
    }
    public function setLineObjects($lineobjects)
    {
        $this->lineobjects = $lineobjects;
        return $this->save();
    }

    public function setBackground($darkmode = 0, $mode3d = 0, $nogrid = 0)
    {
        $this->darkmode = $darkmode;
        $this->mode3d = $mode3d;
        $this->nogrid = $nogrid;
        return $this->save();
    }

    public function getDarkMode()
    {
        return $this->darkmode;
    }

    public function get3dMode()
    {
        return $this->mode3d;
    }

    public function getNoGrid()
    {
        return $this->nogrid;
    }


    //===================PNETLAB============================
}





class indentify
{

    private static $user;

    public function getUser($pod)
    {
        if (self::$user === null) {
            $query = 'SELECT * FROM users WHERE pod = :pod';
            $db = checkDatabase();
            $statement = $db->prepare($query);
            $statement->execute(['pod' => $pod]);
            $user = $statement->fetchAll(PDO::FETCH_ASSOC);
            if (!isset($user[0])) return null;
            self::$user = $user[0];
        }
        return self::$user;
    }

    private function crypt_data($string, $action = 'e')
    {
        // you may change these values to your own
        try {

            $secret_key = "gsgsgsghkjjghksgs%^465#";
            $secret_iv = "etwdgsio##kljhjgf%^465#";

            $output = false;
            $encrypt_method = "AES-256-CBC";
            $key = hash('sha256', $secret_key);
            $iv = substr(hash('sha256', $secret_iv), 0, 16);
            if ($action == 'e') {
                $output = base64_encode(openssl_encrypt(time() . '##time##' . $string, $encrypt_method, $key, 0, $iv));
            } else if ($action == 'd') {
                $output = openssl_decrypt(base64_decode($string), $encrypt_method, $key, 0, $iv);

                $outputArray = explode('##time##', $output);
                $output = [];
                $output['payload'] = $outputArray[1];
                $output['iat'] = $outputArray[0];
            }
            return $output;
        } catch (\Exception $e) {
            return false;
        }
    }


    private function get_uuid()
    {
        return exec("sudo dmidecode --string system-uuid");
    }

    public function getKey()
    {
        return $this->crypt_data($this->get_uuid());
    }

    
    public function isOffline($pod)
    {
        $user = $this->getUser($pod);
        return $user[USER_OFFLINE] == '1';
    }

    public function authorization($cookie)
    {

        $output = array();
        $db = checkDatabase();
        $user = $this->getUserByCookie($db, $cookie);    // This will check session/web/pod expiration too

        if (empty($user)) {
            // Used not logged in
            $output['code'] = 412;
            $output['status'] = 'unauthorized';
            $output['message'] = $GLOBALS['messages']['90001'];
            return array(False, False, $output);
        } else {
            // User logged in
            $rc = updateUserCookie($db, $user['username'], $cookie);

            if ($rc !== 0) {
                // Cannot update user cookie
                $output['code'] = 500;
                $output['status'] = 'error';
                $output['message'] = $GLOBALS['messages'][$rc];
                return array(False, False, $output);
            }
        }

        return array($user, $user['pod'], False);
    }


    private function getUserByCookie($db, $cookie)
    {
        $GLOBALS['user'] = null;
        $now = time();
        try {
            $query = 'SELECT * FROM users WHERE cookie = :cookie AND users.session >= :session';

            $statement = $db->prepare($query);
            $statement->bindParam(':cookie', $cookie, PDO::PARAM_STR);
            $statement->bindParam(':session', $now, PDO::PARAM_INT);

            $statement->execute();
            $result = $statement->fetchAll(PDO::FETCH_ASSOC);

            if (!isset($result[0])) return [];
            $result = $result[0];

            if ($result[USER_ROLE] != 0) {
                if (!isset($result[USER_STATUS]) || $result[USER_STATUS] != USER_STATUS_ACTIVE) throw new Exception('You do not have access');

                if (isset($result[USER_ACTIVE_TIME]) && $result[USER_ACTIVE_TIME] > 0) {
                    if ($result[USER_ACTIVE_TIME] > $now) throw new ResponseException('error_user_unactive', ['data' => date("Y-m-d H:i", $result[USER_ACTIVE_TIME])]);
                }
                if (isset($result[USER_EXPIRED_TIME]) && $result[USER_EXPIRED_TIME] > 0) {
                    if ($result[USER_EXPIRED_TIME] < $now) throw new ResponseException('error_user_expired', ['data' => date("Y-m-d H:i", $result[USER_EXPIRED_TIME])]);
                }
            }

            self::$user = array(
                'email' => $result['email'],
                'folder' => $result['folder'],
                'lab' => $result['lab_session'],
                'name' => $result['name'],
                'role' => $result['role'],
                'pod' => $result['pod'],
                'html5' => $result['html5'],
                'username' => $result['username'],
                USER_PASSWORD => $result[USER_PASSWORD],
                USER_OFFLINE => $result[USER_OFFLINE],
                USER_WORKSPACE => $result[USER_WORKSPACE],
                USER_MAX_NODE => $result[USER_MAX_NODE],
                USER_MAX_NODELAB => $result[USER_MAX_NODELAB],
            );

            $GLOBALS['user'] = self::$user;
            return $GLOBALS['user'];
        } catch (Exception $e) {
            error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][90026]);
            error_log(date('M d H:i:s ') . (string) $e);
            return array();;
        }
    }

}
