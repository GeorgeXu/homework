/*
 * Jquery Alert插件 需要jQuery.tmpl插件
 * 使用例子 :
 * $.alert("提示内容",{
 *      title : "标题",
 *      position : ['left', [-0.1,0]]
 * })
 * 也可以这样使用
 * $.alert("提示内容","标题");
 * 位置请使用
 * top-left,top-right,bottom-left,bottom-right,center 大小写都可以哦
 */

(function($) {
    $.alert_ext = {
        // 默认配置
        defaults : {
            autoClose : true,  // 自动关闭
            closeTime : 5000,   // 自动关闭时间，不少于1000
            withTime : false, // 添加计时  会在文字后面添加  ...10
            type : 'error',  // 提示类型
            position : ['center',[-0.42, 0]], // 位置,第一个写位置，英文哦，后面是偏移，如果是1跟-1之间为百分比
            title : false, // 标题
            close : '',   // 需绑定关闭事件滴按钮
            speed : 'normal',   // 速度
            isOnly: true, //是否只出现一个
            onShow : function(){},  // 打开后回调
            onClose : function(){}  // 关闭后回调
        },

        // 提示框模版
        tmpl : '<div class="alert ${State}"><a class="close">&times;</a><h4>${Title}</h4><p>${Content}</p></div>',

        // 初始化函数
        init : function(msg, options){
            this.options = $.extend({}, this.defaults, options);

            this.create(msg);
            this.set_css();
           
            this.bind_event();
            

        },

        // 创建提示框
        create : function(msg){
            this.alertDiv = $.tmpl(this.tmpl, {
                State : 'alert_' + this.options.type,
                Title : this.options.title,
                Content : msg
            }).hide();
            if(!this.options.title){
                $('h4', this.alertDiv).remove();
                $('p', this.alertDiv).css('margin-right','15px');
            }
            if(this.options.isOnly){
                $('body > .alert').remove();
            }
            this.alertDiv.appendTo($('body'));
        },

        // 设置样式
        set_css : function(){
            var alertDiv = this.alertDiv,
            c_left = ($(window).width()-alertDiv.outerWidth())/2,
            c_top = ($(window).height()-alertDiv.outerHeight())/2;

            // 初始化样式
            alertDiv.css({
                'position' : 'fixed',
                'z-index' : 10001 + $(".alert").length,
                'left' : c_left,
                'top' : c_top
            });

            // IE6兼容
            var ie6 = 0;
            if ( $.browser.msie && $.browser.version == '6.0' ){
                alertDiv.css('position' , 'absolute');
                ie6 = $(window).scrollTop();
            }

            // 位置设置提取
            var position = this.options.position,
           
            pos_str = position[0].split('-'),
           
            pos = [0, 0];
            if(position.length > 1){
                pos = position[1];
            }

            // 偏移百分比检测
            if(pos[0] > -1 && pos[0] < 1 ){
                pos[0] = pos[0]* $(window).height();
            }
            if(pos[1] > -1 && pos[1] < 1 ){
                pos[1] = pos[1]* $(window).width();
            }
         
           
            // 位置设置
            for(var i in pos_str){
            	if($.type(pos_str[i]) !== 'string'){
            		continue;
            	}
        		var str = pos_str[i].toLowerCase();
            	
                if($.inArray(str, ['left','right']) > -1){
                    alertDiv.css(str , pos[1]);
                } else if($.inArray(str, ['top','bottom']) > -1){
                    alertDiv.css(str , pos[0] + ie6);
                } else {
                    alertDiv.css({
                        'top' : c_top + pos[0] + ie6,
                        'left': c_left + pos[1]
                    });
                }
            }
            
        },

        // 绑定事件
        bind_event : function(){
            this.bind_show();
            this.bind_close();

            if ( $.browser.msie && $.browser.version == '6.0' ){
                this.bind_scroll();
            }
        },

        // 显示事件
        bind_show : function(){
            var ops = this.options;
            this.alertDiv.fadeIn(ops.speed, function(){
                ops.onShow($(this));
            });
        },

        // 关闭事件
        bind_close : function(){
            var alertDiv = this.alertDiv,
            ops = this.options,
            closeBtn = $('.close',alertDiv).add($(this.options.close,alertDiv));

            closeBtn.bind('click', function(){
                alertDiv.fadeOut(ops.speed, function(){
                    $(this).remove();
                    ops.onClose($(this));
                });
            });
            
            // 自动关闭绑定
            if(this.options.autoClose){
                var time = parseInt(this.options.closeTime/1000);
                if(this.options.withTime){
                    $('p',alertDiv).append('<span>...<em>'+time+'</em></span>');
                }
                var timer = setInterval(function(){
                    $('em',alertDiv).text(--time);
                    if(!time) {
                        clearInterval(timer);
                        closeBtn.trigger('click');
                    }
                }, 1000);
            }
        },

        // IE6滚动跟踪
        bind_scroll : function(){
            var alertDiv = this.alertDiv,
                top = alertDiv.offset().top - $(window).scrollTop();
            $(window).scroll(function(){
                alertDiv.css("top",top + $(window).scrollTop());
            })
        }
    };

    $.alert = function(msg, arg){
        if(!$.trim(msg).length){
            return false;
        }
        if($.type(arg)==="string" ){
            arg = {
                title : arg
            }
        }
        $.alert_ext.init(msg, arg);
    }
})(jQuery);