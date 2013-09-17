<?php
/**
 * Gokuai enterprise SDK for PHP
 * User: wink
 * Date: 13-9-17
 * Time: 上午10:38
 */

class GokuaiClient {

    const API_URL = 'http://api.gokuai.com';

    private $client_id;
    private $client_secret;
    private $token;
    public $http_code; //http请求的返回状态
    public $response; //http请求的返回结果
    public $error; //http请求错误信息

    public function __construct($client_id, $client_secret) {
        $this->client_id = $client_id;
        $this->client_secret = $client_secret;
        $this->token = '';
        $this->http_code = 0;
        $this->response = '';
        $this->error = '';
    }

    /**
     * 根据用户名和密码登录帐号
     * @param string $username 用户名, 通常是邮箱
     * @param string $password 密码, 需要做md5
     * @return bool 是否登录成功
     */
    public function login($username, $password) {
        $url = self::API_URL . '/oauth2/token';
        $parameters = array('client_id' => $this->client_id,
                            'client_secret' => $this->client_secret,
                            'grant_type' => 'password',
                            'username' => $username,
                            'password' => $password);
        $this->response = self::http($url, 'POST', $parameters, array(), $this->http_code, $this->error);
        $json = $this->handleResponse();
        if ($json['access_token']) {
            $this->token = $json['access_token'];
            return true;
        } else {
            return false;
        }
    }

    /**
     * 获取文件列表
     * @param string $fullpath 获取哪个路径下的文件列表
     * @param int $start 第几条记录开始获取, 默认0
     * @param string $mount
     * @return bool|mixed
     */
    public function getFileList($fullpath, $start = 0, $mount = 'gokuai') {
        $url = self::API_URL . '/1/file/ls';
        $parameters = array('token' => $this->token,
                            'fullpath' => $fullpath,
                            'start' => $start,
                            'mount' => $mount);
        $parameters['sign'] = $this->getSign($parameters);
        $this->response = self::http($url, 'GET', $parameters, array(), $this->http_code, $this->error);
        return $this->handleResponse();
    }

    /**
     * 获取文件信息
     * @param string $fullpath 文件的完整路径
     * @param string $mount
     * @return bool|mixed
     */
    public function getFileInfo($fullpath, $mount = 'gokuai') {
        $url = self::API_URL . '/1/file/info';
        $parameters = array('token' => $this->token,
                            'fullpath' => $fullpath,
                            'mount' => $mount);
        $parameters['sign'] = $this->getSign($parameters);
        $this->response = self::http($url, 'GET', $parameters, array(), $this->http_code, $this->error);
        return $this->handleResponse();
    }

    /**
     * 创建文件夹
     * @param string $fullpath 待创建的文件夹的完整路径
     * @param string $mount
     * @return bool|mixed
     */
    public function createFolder($fullpath, $mount = 'gokuai') {
        $url = self::API_URL . '/1/file/create_folder';
        $parameters = array('token' => $this->token,
                            'fullpath' => $fullpath,
                            'mount' => $mount);
        $parameters['sign'] = $this->getSign($parameters);
        $this->response = self::http($url, 'POST', $parameters, array(), $this->http_code, $this->error);
        return $this->handleResponse();
    }

    /**
     * 获取文件上传地址
     * @param string $fullpath 待上传的文件完整路径
     * @param string $mount
     * @return bool|array
     */
    public function getUploadServer($fullpath, $mount = 'gokuai') {
        $url = self::API_URL . '/1/file/upload_server';
        $parameters = array('token' => $this->token,
                            'fullpath' => $fullpath,
                            'mount' => $mount);
        $parameters['sign'] = $this->getSign($parameters);
        $this->response = self::http($url, 'POST', $parameters, array(), $this->http_code, $this->error);
        $json = $this->handleResponse();
        return $json['server'];
    }

    /**
     * 上传本地文件
     * @param string $filepath 本地文件完整路径
     * @param string $upload_server 上传服务器地址
     * @param string $fullpath 待上传的文件路径
     * @param string $mount
     * @return array
     */
    public function uploadByFilename($filepath, $upload_server, $fullpath, $mount = 'gokuai') {
        if (!is_readable($filepath)) {
            $this->error = 'fail to read %s' . $filepath;
            return false;
        }
        $url = $upload_server . '/1/file/upload';
        $parameters = array('token' => $this->token,
                            'fullpath' => $fullpath,
                            'mount' => $mount);
        $parameters['sign'] = $this->getSign($parameters);
        $parameters['filefield'] = 'file';
        $parameters['file'] = '@' . $filepath;
        $this->response = self::http($url, 'POST', $parameters, array(), $this->http_code, $this->error, true);
        return $this->handleResponse();
    }

    /**
     * 获取最后一次http请求返回状态
     * @return int
     */
    public function getLastHttpCode() {
        return $this->http_code;
    }

    /**
     * 获取最后一次http请求返回结果
     * @return string
     */
    public function getLastResponse() {
        return $this->response;
    }

    /**
     * 获取最后一次发生的错误消息
     * @return string
     */
    public function getLastError() {
        return $this->error;
    }

    private function getSign(array $parameters) {
        ksort($parameters);
        $before_sign = implode("\n", $parameters);
        return base64_encode(hash_hmac('sha1', $before_sign, $this->client_secret, true));
    }

    private function handleResponse() {
        $json = json_decode($this->response, true);
        if ($this->http_code == 200 && $json) {
            return $json;
        } else {
            return false;
        }
    }

    private static function http($url, $method, $data = '', array $headers = array(), &$http_code = 0, &$error = '', $postfields = false) {
        try {
            $ch = curl_init($url);
            if (stripos($url, "https://") !== false) {
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
            }
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 60);
            curl_setopt($ch, CURLOPT_TIMEOUT, 120);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            $fields_string = '';
            if ($data && !$postfields) {
                if (is_array($data)) {
                    foreach ($data as $k => $v) {
                        $fields_string .= sprintf('%s=%s&', $k, rawurlencode($v));
                    }
                    $fields_string = trim($fields_string, '&');
                } else {
                    $fields_string = $data;
                }
            }
            switch ($method) {
                case 'GET':
                    if ($fields_string) {
                        if (strpos($url, '?')) {
                            curl_setopt($ch, CURLOPT_URL, $url . '&' . $fields_string);
                        } else {
                            curl_setopt($ch, CURLOPT_URL, $url . '?' . $fields_string);
                        }
                    }
                    break;
                case 'POST':
                    curl_setopt($ch, CURLOPT_POST, true);
                    if ($postfields) {
                        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
                    } else {
                        curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
                    }
                    break;
                default:
                    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
                    curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
                    break;
            }
            if ($headers) {
                $http_headers = array();
                foreach ($headers as $key => $value) {
                    array_push($http_headers, $key . ': ' . $value);
                }
                curl_setopt($ch, CURLOPT_HTTPHEADER, $http_headers);
            }
            $response = curl_exec($ch);
            $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $error = curl_error($ch);
            curl_close($ch);
            return $response;
        } catch (Exception $e) {
            $error = $e->getMessage();
            return false;
        }
    }

}