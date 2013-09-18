<?php

class ErrorAction extends Action {

    static public function show_page($msg = '', $code = 0, $title = '') {

        exit(0);
    }

    static public function show_ajax($msg = '', $code = 0, $title = '') {
        $http_status = $code;
        if ($code && is_numeric($code)) {
            if ($code > 999) {
                $http_status = substr($code, 0, 3);
            }
        } else {
            $code = 404;
            $http_status = 404;
        }
        send_http_status($http_status);
        echo json_encode(array('error_code' => $code, 'error_msg' => $msg, 'error_title' => $title));
        exit(0);
    }

}

?>
