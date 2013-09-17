var gkHomeWorkDemo = {
    FILE_SORTS: {
        'SORT_SPEC': ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'],
        'SORT_MOVIE': ['mp4', 'mkv', 'rm', 'rmvb', 'avi', '3gp', 'flv', 'wmv', 'asf', 'mpeg', 'mpg', 'mov', 'ts', 'm4v'],
        'SORT_MUSIC': ['mp3', 'wma', 'wav', 'flac', 'ape', 'ogg', 'aac', 'm4a'],
        'SORT_IMAGE': ['jpg', 'png', 'jpeg', 'gif', 'psd'],
        'SORT_DOCUMENT': ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'odt', 'rtf', 'ods', 'csv', 'odp', 'txt'],
        'SORT_CODE': ['js', 'c', 'cpp', 'h', 'cs', 'vb', 'vbs', 'java', 'sql', 'ruby', 'php', 'asp', 'aspx', 'html', 'htm', 'py', 'jsp', 'pl', 'rb', 'm', 'css', 'go', 'xml', 'erl', 'lua', 'md'],
        'SORT_ZIP': ['rar', 'zip', '7z', 'cab', 'tar', 'gz', 'iso'],
        'SORT_EXE': ['exe', 'bat', 'com']
    },
    zTreeObj: null,
    init: function () {
        var _context = this;
        var setting = {
            treeId: 'node_list',
            view: {
                //nameIsHTML: true
            },
            callback: {
                beforeClick: function (treeId, treeNode) {
                    if (typeof treeNode['data-base_path'] !== 'undefined') {
                        return false;
                    }
                    return true;
                },
                onClick: function (event, treeId, treeNode, clickFlag) {
                    var file = {
                        path: treeNode['data-path'],
                        name: treeNode['name']
                    };
                    _context.fetchFileList(file);
                }
            }
        };
        var nodes = _context.renderTreeList(PAGE_CONFIG.xmlData['nodes']);
        _context.zTreeObj = $.fn.zTree.init($('.node_list'), setting, nodes);
    },
    getBaseNode: function (node) {
        return  node['data-base_path'] ? node : node.getParentNode();
    },
    fetchFileList: function (node) {
        var _context = this;
        var path = node.path;
        var selectNode = _context.zTreeObj.getSelectedNodes()[0];
        var baseNode = _context.getBaseNode(selectNode);
        var fullpath = baseNode['data-base_path'] + '/' + path;
        $('.main').loader();
        _context.getFileList(fullpath, function (data) {
            $.loader.close();
            var files = [];
            if (data && data.list) {
                files = data.list;
                $.each(files, function (i, file) {
                    file.icon = '/Common/images/icon/128_' + _context.getFileIconSuffix(file.filename, file.dir) + '.png';
                });
            }
            PAGE_CONFIG.path = path;
            var meta = {
                breads: _context.getBreads(PAGE_CONFIG.path),
                files: files,
                current_node: node,
                access:selectNode['data-access']
            };

            var jqContent = $('#contentTmpl').tmpl(meta);
            $('.content').empty().append(jqContent);
            _context.initFileItem($('.file_list .file_item'));
        }, function () {
            $.loader.close();
        });
    },
    getBreads: function (path) {
        path = Util.String.rtrim(Util.String.ltrim(path, '/'), '/');
        var paths = path.split('/'), breads = [], bread;
        for (var i = 0; i < paths.length; i++) {
            bread = {
                name: paths[i]
            };
            var fullpath = '';
            for (var j = 0; j <= i; j++) {
                fullpath += paths[j] + '/'
            }
            fullpath = Util.String.rtrim(fullpath, '/');
            bread.path = fullpath;
            bread.href = 'javascript:void(gkHomeWorkDemo.fetchFileList({path:"' + fullpath + '"}))';
            breads.push(bread);
        }
        return breads;
    },
    initFileItem: function (items) {
        var _context = this;
        items.filter('[data-dir="1"]').click(function () {
            var metaData = $(this).data();
            metaData.path = PAGE_CONFIG.path + '/' + metaData.filename;
            _context.fetchFileList(metaData);
        });
    },
    getFileList: function (path, success, error) {
        $.ajax({
            type: 'GET',
            url: '/index/file_list',
            data: {
                path: path
            },
            dataType: 'json',
            success: function (data) {
                $.isFunction(success) && success(data);
            },
            error: function (data) {
                $.isFunction(error) && success(error);
            }
        })
    },
    renderTreeList: function (nodes) {
        var _context = this;
        var renderList = [];
        if (nodes && nodes.length) {
            $.each(nodes, function (i, n) {
                var node = _context.renderTreeItem(n);
                renderList.push(node);
            });
        }
        return renderList;
    },
    renderTreeItem: function (n) {
        var _context = this;
        var name = n['@attributes']['name'];
        var item = {
            'tId': '',
            'name': name,
            'open': true,
            'children': []
        };
        if (typeof n['@attributes']['base_path'] !== 'undefined') {
            item['data-base_path'] = n['@attributes']['base_path'];
        }
        if (typeof n['@attributes']['path'] !== 'undefined') {
            item['data-path'] = n['@attributes']['path'];
            item['data-access'] = n['@attributes']['access'];
        }
        if (n['node']) {
            for (var i = 0; i < n['node'].length; i++) {
                item['children'].push(_context.renderTreeItem(n['node'][i]));
            }
        }
        return item;
    },
    getFileIconSuffix: function (filename, dir) {
        var suffix = '';
        var sorts = this.FILE_SORTS;
        if (dir) {
            suffix = 'folder';
        } else {
            var ext = Util.String.getExt(filename);
            if ($.inArray(ext, sorts['SORT_MOVIE']) > -1) {
                suffix = 'movie';
            } else if ($.inArray(ext, sorts['SORT_MUSIC']) > -1) {
                suffix = 'music';
            } else if ($.inArray(ext, sorts['SORT_IMAGE']) > -1) {
                suffix = 'image';
            } else if ($.inArray(ext, sorts['SORT_DOCUMENT']) > -1) {
                suffix = 'document';
            } else if ($.inArray(ext, sorts['SORT_ZIP']) > -1) {
                suffix = 'compress';
            } else if ($.inArray(ext, sorts['SORT_EXE']) > -1) {
                suffix = 'execute';
            } else {
                suffix = 'other';
            }
        }
        return suffix;
    },
    checkAuth:function(auth,access){
        return $.inArray(auth,access.split('|'))>=0;
    }
};