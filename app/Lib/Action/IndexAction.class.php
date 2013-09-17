<?php

class IndexAction extends Action
{

    const CLIENT_ID = '818f83a6e217eb7152b28ba14fd31377';
    const CLIENT_SECRET = '18d0df158975b9fa33366bcf69586fdb';
    const GK_ACCOUNT = 'xugetest3@126.com';
    const GK_PASSWORD = '111111';

    private $gkClient;
    private $xmlDom;

    function __construct()
    {
        parent::__construct();
        require_once APP_PATH . 'Common/GK-SDK/GokuaiClient.class.php';
        $xmlPath = APP_PATH . 'Common/nodeSource/demo.xml';
        $this->xmlDom = simplexml_load_file($xmlPath, 'SimpleXMLElement', LIBXML_NOCDATA);
        $this->gkClient = new GokuaiClient(self::CLIENT_ID, self::CLIENT_SECRET);
        if ($this->gkClient->login(self::GK_ACCOUNT, md5(self::GK_PASSWORD))) {

        } else {

        }
    }

    function __destruct()
    {

    }

    private function _getNodeListByXml($xmlNodes)
    {
        $nodes = [];
        foreach ($xmlNodes as $v) {
            foreach ($v as $i => $j) {
                $node[$i] = $j;
            }
            if ($v->nodes) {
                $node['nodes'] = $this->_getNodeListByXml($v->nodes);
            }
            $nodes[] = $node;
        }
        return $nodes;
    }

    private function getNodeByFullpath($fullpath)
    {
        $nodes = json_decode(json_encode($this->xmlDom),true)['nodes'];
        $fullpath = trim($fullpath, '/');
        foreach ($nodes as $v) {
            $base_path = trim($v['@attributes']['base_path'],'/');
            if (strpos($fullpath . '/',$base_path . '/')===0) {
                foreach ($v['node'] as $node) {
                    $node_path = $node['@attributes']['path'];
                    if ($base_path . '/' . $node_path === $fullpath) {
                        return $node;
                    }
                }
            }
        }
        return null;
    }

    public static function checkAuth($auth,$access){
        return in_array($auth,explode('|',$access));
    }

    public static  function checkPath(&$path){
        $path = trim($path, '/');
        if(!strlen($path)){
            return;
        }
    }

    public function index()
    {
        $xmlData = json_encode($this->xmlDom);
        $publishPage = $this->xmlDom;
        $this->assign('page_name', $publishPage['name']);
        $this->assign('background_color', $publishPage['background_color']);
        $this->assign('logo_url', $publishPage['logo_url']);
        $this->assign('xml_data', $xmlData);
        $this->display();
    }

    public function file_list()
    {
        $path = $_GET['path'];
        self::checkPath($path);
        $list = [];
        $node = $this->getNodeByFullpath($path);
        $access = $node['@attributes']['access'];
        if(self::checkAuth('view',$access)){
            $list = $this->gkClient->getFileList($path, 0, 'team');
        }
        echo json_encode($list);
    }

    public function download_file()
    {
        $path = $_GET['path'];
        self::checkPath($path);
        $node = $this->getNodeByFullpath($path);
        if(!self::checkAuth('download',$node['@attributes']['access'])){
           return;
        }
        $fileinfo = $this->gkClient->getFileInfo($path);
        if ($fileinfo['uri']) {
            header('Location:' . $fileinfo['uri']);
        }
    }


}

?>