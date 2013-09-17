<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
<head>
    <title></title>
    <link type="text/css" rel="stylesheet" href="/Common/css/base.css" />
    <link type="text/css" rel="stylesheet" href="/Common/js/lib/zTree/css/zTreeStyle/zTreeStyle.css" />
    <link type="text/css" rel="stylesheet" href="/Common/css/style.css" />
    <script type="text/javascript" src="/Common/js/util.js"></script>
    <script type="text/javascript" src="/Common/js/lib/jquery.js"></script>
    <script type="text/javascript" src="/Common/js/lib/bootstrap/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="/Common/js/lib/zTree/js/jquery.ztree.core-3.5.min.js"></script>
    <script type="text/javascript" src="/Common/js/component/loader.js"></script>
    <script type="text/javascript" src="/Common/js/lib/jquery.tmpl.min.js"></script>
    <script type="text/javascript" src="/Common/js/script.js"></script>
    <script type="text/javascript">
        var PAGE_CONFIG = {
            xmlData: $.parseJSON('<?php echo ($xml_data); ?>')
        }
        $(function(){
            gkHomeWorkDemo.init();
        })
    </script>
</head>
<body style="background-color:<?php echo ($background_color); ?>">
    <div class="wrapper">
        <div class="header">
            <div class="c_f header_left">
                <?php if($logo_url): ?>
                <img src="<?php echo ($logo_url); ?>" class="f_l" alt="" />
                <?php endif; ?>
                <h1 class="f_l"><?php echo ($page_name); ?></h1>
            </div>
        </div>
        <div class="main c_f">
            <div class="sidebar">
                <div class="ztree node_list"></div>
            </div>
            <div class='content'>

            </div>
        </div>

    </div>
    <script id="contentTmpl" type="text/x-jquery-tmpl">
        <div class="c_f_after content_header">
            <div class="f_l bread">
                {{each(i,bread) breads}}
                {{if i!=0}}
                <span>&gt;</span>
                {{/if}}
                {{if bread.href}}
                <a href="${bread.href}">${bread.name}</a>
                {{else}}
                <span>${bread.name}</span>
                {{/if}}
                {{/each}}
            </div>
            <div class="f_r toolbar">
                {{if gkHomeWorkDemo.checkAuth('upload',access)}}
                <button class="btn">上传</button>
                {{/if}}
            </div>
        </div>
        <div class="view_as_thumb file_list">
            {{if files&&files.length}}
            {{each(i,file) files}}
            <div class="file_item"{{each(key,value) file}} data-${key}="${value}"{{/each}}>
                <div class="thumb_wrapper">
                    <img src="${file.icon}" />
                </div>
                <div class="filename">
                    {{if file.dir==1}}
                    <a class="name" href="javascript:void(0)">${file.filename}</a>
                    {{else}}
                    {{if gkHomeWorkDemo.checkAuth('download',access)}}
                    <a class="name" href="/index/download_file?path=${encodeURIComponent(file.fullpath)}">${file.filename}</a>
                    {{else}}
                    <span class="name">${file.filename}</span>
                    {{/if}}

                    {{/if}}

                </div>
            </div>
            {{/each}}
            {{else}}
            <div class="empty">该文件夹为空</div>
            {{/if}}
        </div>
    </script>
</body>
</html>