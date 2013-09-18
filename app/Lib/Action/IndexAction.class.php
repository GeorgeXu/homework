<?php

class IndexAction extends Action
{

    const CLIENT_ID = '818f83a6e217eb7152b28ba14fd31377';
    const CLIENT_SECRET = '18d0df158975b9fa33366bcf69586fdb';
    const GK_ACCOUNT = 'xugetest3@126.com';
    const GK_PASSWORD = '111111';

    private $gkClient;
    private $xmlDom;

    function __construct() {
        parent::__construct();
        require_once APP_PATH . 'Common/GK-SDK/GokuaiClient.class.php';
        $xmlPath = APP_PATH . 'Common/nodeSource/demo.xml';
        $this->xmlDom = simplexml_load_file($xmlPath, 'SimpleXMLElement', LIBXML_NOCDATA);
        $this->gkClient = new GokuaiClient(self::CLIENT_ID, self::CLIENT_SECRET);
        if ($this->gkClient->login(self::GK_ACCOUNT, md5(self::GK_PASSWORD))) {

        } else {

        }
    }

    function __destruct() {

    }

    private function _getNodeListByXml($xmlNodes) {
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

    private function getNodeByFullpath($fullpath) {
        $nodes = json_decode(json_encode($this->xmlDom), true)['nodes'];
        $fullpath = trim($fullpath, '/');
        foreach ($nodes as $v) {
            $base_path = trim($v['@attributes']['base_path'], '/');
            if (strpos($fullpath . '/', $base_path . '/') === 0) {
                foreach ($v['node'] as $node) {
                    $node_path = $node['@attributes']['path'];
                    if (strpos($fullpath . '/', $base_path . '/' . $node_path . '/') === 0) {
                        return $node;
                    }
                }
            }
        }
        return null;
    }

    public static function checkAuth($auth, $access) {
        return in_array($auth, explode('|', $access));
    }

    public static function checkPath(&$path) {
        $path = trim($path, '/');
        if (!strlen($path)) {
            return;
        }
    }

    public function index() {
        $xmlData = json_encode($this->xmlDom);
        $publishPage = $this->xmlDom;
        $page_name = $publishPage['name']?$publishPage['name']:'未命名';
        $this->assign('page_name', $publishPage['name']);
        $this->assign('background_color', $publishPage['background_color']);
        $this->assign('logo_url', $publishPage['logo_url']);
        $this->assign('xml_data', $xmlData);
        $this->display();
    }

    public function file_list() {
        $path = $_GET['path'];
        self::checkPath($path);
        $list = [];
        $node = $this->getNodeByFullpath($path);
        $access = $node['@attributes']['access'];
        if (self::checkAuth('view', $access)) {
            $list = $this->gkClient->getFileList($path, 0, 'team');
        }
        echo json_encode($list);
    }

    public function download_file() {
        $path = $_GET['path'];
        self::checkPath($path);
        $node = $this->getNodeByFullpath($path);
        if (!self::checkAuth('download', $node['@attributes']['access'])) {
            return;
        }
        $fileinfo = $this->gkClient->getFileInfo($path);
        if ($fileinfo['uri']) {
            header('Location:' . $fileinfo['uri']);
        }
    }

    public function view_file() {
        $path = $_GET['path'];
        self::checkPath($path);
        $node = $this->getNodeByFullpath($path);
        if (!self::checkAuth('view', $node['@attributes']['access'])) {
            return;
        }
        $fileinfo = $this->gkClient->getFileInfo($path);
        if ($fileinfo['uri']) {
            header('Location:' . $fileinfo['uri']);
        }
    }

    public function upload() {
        $this->assign('fileSizeLimit', $_GET['fileSizeLimit'] + 0);
        $this->display();
    }

    public function upload_file() {
        try {
            $filefield = $_POST['filefield'] ? $_POST['filefield'] : 'file';
            $file = $_FILES[$filefield];
            if (!isset($file)) {
                throw new Exception('文件上传失败', 400);
            }
            if ($file['error'] > 0) {
                switch ($file['error']) {
                    case '1':
                        $error = '文件太大'; //php.ini
                        break;
                    case '2':
                        $error = '文件太大'; //html form
                        break;
                    case '3':
                        $error = '部分数据未上传'; //部分上传
                        break;
                    case '4':
                        $error = '请选择要上传的文件';
                        break;
                    case '6':
                        $error = '缓存不存在'; //缓存文件夹不存在
                        break;
                    case '7':
                        $error = '无法写入服务器磁盘'; //无法写入磁盘
                        break;
                    case '8':
                        $error = '上传被中断'; //上传中断
                        break;
                    default:
                        $error = '发生未知错误';
                }

                throw new Exception($error, 400);
            }
            $path = $_POST['path'];
            self::checkPath($path);
            $node = $this->getNodeByFullpath($path);
            $access = $node['@attributes']['access'];
            if(!self::checkAuth('upload', $access)){
                throw new Exception('你没有权限在该文件夹下上传文件', 400);
            }

            $filename = trim($_POST['name']);
            if (!strlen($filename)) {
                $filename = $file['name'];
            }

            $file_tmpl = $file['tmp_name'];
            $fullpath = $path ? $path . '/' . $filename : $filename;
            $server = $this->gkClient->getUploadServer($fullpath, 'team');
            if (!$server) {
                throw new Exception('获取上传服务器地址失败', 400);
            }
            $result = $this->gkClient->uploadByFilename($file_tmpl, $server, $fullpath, 'team');
            if (!$result) {
                throw new Exception('文件上传到够快失败', 400);
            }
            echo json_encode($result);
        } catch (Exception $e) {
            ErrorAction::show_ajax($e->getMessage(), $e->getCode());
        }
    }

    public function create_folder() {
        try {
            $path = $_POST['path'];
            self::checkPath($path);
            self::checkPath($path);
            $node = $this->getNodeByFullpath($path);
            $access = $node['@attributes']['access'];
            self::checkAuth('upload', $access);
            if(!self::checkAuth('upload', $access)){
                throw new Exception('你没有权限在该文件夹新建文件夹', 400);
            }
            $re = $this->gkClient->createFolder($path, 'team');
            if(!$re){
                throw new Exception('创建文件夹失败', 502);
            }
            echo json_encode($re);
        } catch (Exception $e) {
            ErrorAction::show_ajax($e->getMessage(), $e->getCode());
        }
    }

}

?>