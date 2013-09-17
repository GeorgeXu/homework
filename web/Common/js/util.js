/**
 *项目/框架无关的工具方法
 */
var Util = {
    //检测某个方法是不是原生的本地方法
    // http://peter.michaux.ca/articles/feature-detection-state-of-the-art-browser-scripting
    isHostMethod: function(object, property) {
        var t = typeof object[property];
        return t == 'function' ||
                (!!(t == 'object' && object[property])) ||
                t == 'unknown';
    },
    getUuid: function() {
        var uuid = "";
        for (var i = 0; i < 32; i++) {
            uuid += Math.floor(Math.random() * 16).toString(16);
        }
        return uuid;
    }
};

Util.String = {
    getExt: function(filename) {
        var ext = filename.slice(filename.lastIndexOf('.') + 1).toLowerCase();
        return ext;
    },
    baseName: function(path) {
        path = path.toString();
        return path.replace(/\\/g, '/').replace(/.*\//, '');
    },
    dirName: function(path) {
        path = path.toString();
        return path.indexOf('/') < 0 ? '' : path.replace(/\\/g, '/').replace(/\/[^\/]*$/, '');
    },
    ltrim: function(str, charlist) {
        charlist = !charlist ? ' \\s\u00A0' : (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
        var re = new RegExp('^[' + charlist + ']+', 'g');
        return (str + '').replace(re, '');
    },
    rtrim: function(str, charlist) {
        charlist = !charlist ? ' \\s\u00A0' : (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\\$1');
        var re = new RegExp('[' + charlist + ']+$', 'g');
        return (str + '').replace(re, '');
    },
    //返回字符串的最后一个字符
    lastChar: function(str) {
        str = String(str);
        return str.charAt(str.length - 1);
    },
    //根据某个分隔符获取分隔符后面的字符
    getNextStr: function(str, separate) {
        return str.slice(str.lastIndexOf(separate) + 1);
    },
    //根据某个分隔符获取分隔符前面面的字符
    getPrevStr: function(str, separate) {
        if (str.indexOf(separate) < 0) {
            return '';
        }
        else {
            return str.slice(0, str.lastIndexOf(separate));
        }
    },
    strLen: function(str) {
        return str.replace(/[^\x00-\xff]/g, "rr").length;
    },
    subStr: function(str, n) {
        var r = /[^\x00-\xff]/g;
        if (str.replace(r, "mm").length <= n)
            return str;
        // n = n - 3;
        var m = Math.floor(n / 2);
        for (var i = m; i < str.length; i++) {
            if (str.substr(0, i).replace(r, "mm").length >= n) {
                return str.substr(0, i);
            }
        }
        return this;
    },
    //获取参数对象/值
    getQuery: function (paras) {
        var url = location.href;
        if(url.indexOf("?") < 0){
            url += '?';
        }
        var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
        var paraObj = {}, i, j;
        for (i = 0; j = paraString[i]; i++) {
            paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = decodeURIComponent(j.substring(j.indexOf("=") + 1, j.length).replace('+','%20'));
        }
        if (paras) {
            var returnValue = paraObj[paras.toLowerCase()];
            if (typeof(returnValue) == "undefined") {
                return "";
            } else {
                return returnValue;
            }
        } else {
            return paraObj;
        }
    },
    /**
     * uri编码
     * @param request_uri
     */
    encodeRequestUri:function(request_uri) {
    if (request_uri == '/') {
        return request_uri;
    }
    var arr_uri = request_uri.split("/");
    var uri = '';
    for (var i=0;i<arr_uri.length;i++) {
        var v = arr_uri[i];
        if (v) {
            uri += '/' + encodeURIComponent(v);
        } else {
            uri += '/';
        }
    }
    return uri;
}
};
Util.RegExp = {
    Name: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
    HTTPALL: /http(s?):\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\’:+!]*([^<>\"\"])*/g,
    HTTP: /^http(s?):\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\’:+!]*([^<>\"\"])*$/,
    Email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
    NumberandLetter: /^([A-Z]|[a-z]|[\d])*$/,
    PositiveNumber: /^[1-9]\d*$/, //正整数
    NonNegativeNum: /^(0|[1-9]\d*)$/, //非负整数，即0和正整数
    IP: /^((1?\d?\d|(2([0-4]\d|5[0-5])))\.){3}(1?\d?\d|(2([0-4]\d|5[0-5])))$/,
    URL: /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/,
    PhoneNumber: /^((0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$|^(13|15|18)[0-9]{9}$/,
    QQ: /^\d{1,10}$/,
    Date: /^((?!0000)[0-9]{4}-((0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-8])|(0[13-9]|1[0-2])-(29|30)|(0[13578]|1[02])-31)|([0-9]{2}(0[48]|[2468][048]|[13579][26])|(0[48]|[2468][048]|[13579][26])00)-02-29)$/
};

Util.Validation = {
    isRegName: function(name) {
        return Util.RegExp.Name.test(name);
    },
    isHttp: function(str) {
        return Util.RegExp.HTTP.test(str);
    },
    isEmail: function(str) {
        return Util.RegExp.Email.test(str);
    },
    //是否为非负整数
    isNonNegativeNum: function(str) {
        return Util.RegExp.NonNegativeNum.test(str);
    },
    //是否为正整数
    isPositiveNumber: function(str) {
        return Util.RegExp.PositiveNumber.test(str);
    },
    isPhoneNum: function(str) {
        return Util.RegExp.PhoneNumber.test(str);
    },
    isQQNum: function(str) {
        return Util.RegExp.QQ.test(str);
    },
    isDate: function(str) {
        return Util.RegExp.Date.test(str);
    }
};

Util.Date = {
    format: function(date, format) {
        var o = {
            "M+": date.getMonth() + 1, //month
            "d+": date.getDate(), //day
            "h+": date.getHours(), //hour
            "m+": date.getMinutes(), //minute
            "s+": date.getSeconds(), //second

            "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
            "S": date.getMilliseconds() //millisecond
        };
        if (/(y+)/.test(format))
        {
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o)
        {
            if (new RegExp("(" + k + ")").test(format))
            {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    },
    day_diff: function(timestamp1, timestamp2) {
        var diff_time = timestamp2 - timestamp1,
                suffix = '',
                abs_diff = Math.abs(diff_time);
        if (diff_time > 0) {
            suffix = L('later');
        }
        else if (diff_time < 0) {
            suffix = L('timeago');
        }
        var day_minseconds = 86400000;
        var v = Math.floor(abs_diff / day_minseconds);
        if (v == 0) {
            return L('today');
        } else {
            return v+(v>1?L('days'):L('day')) + suffix;
        }
    },
    timeTohhmmss: function(seconds) {
        var hh;
        var mm;
        var ss;
        //传入的时间为空或小于0
        if (seconds == null || seconds < 0) {
            return '';
        }
        //得到小时
        hh = seconds / 3600 | 0;
        seconds = parseInt(seconds) - hh * 3600;
        if (parseInt(hh) < 10) {
            hh = "0" + hh;
        }
        //得到分
        mm = seconds / 60 | 0;
        //得到秒
        ss = parseInt(seconds) - mm * 60;
        if (parseInt(mm) < 10) {
            mm = "0" + mm;
        }
        if (ss < 10) {
            ss = "0" + ss;
        }
        return hh + hh>1?L('hours'):L('hour') + mm + (mm>1?L('minutes'):L('minute')) + ss + (ss>1?L('seconds'):L('second'));
    },
    parseISO8601: function(dateStringInRange) {
        var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/,
                date = new Date(NaN), month,
                parts = isoExp.exec(dateStringInRange);

        if (parts) {
            month = +parts[2];
            date.setFullYear(parts[1], month - 1, parts[3]);
            if (month != date.getMonth() + 1) {
                date.setTime(NaN);
            }
        }
        return date;
    }
};

Util.Browser = {
    /*
     *检测浏览器是否安装了flash
     **/
    isInstallFlash: function() {

        var name = "Shockwave Flash", mimeType = "application/x-shockwave-flash";
        var flashVersion = 0;
        if (typeof navigator.plugins !== 'undefined' && typeof navigator.plugins[name] == "object") {
            // adapted from the swfobject code
            var description = navigator.plugins[name].description;
            if (description && typeof navigator.mimeTypes !== 'undefined' && navigator.mimeTypes[mimeType] && navigator.mimeTypes[mimeType].enabledPlugin) {
                flashVersion = description.match(/\d+/g);
            }
        }
        if (!flashVersion) {
            var flash;
            try {
                flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                flashVersion = Array.prototype.slice.call(flash.GetVariable("$version").match(/(\d+),(\d+),(\d+),(\d+)/), 1);
                flash = null;
            }
            catch (notSupportedException) {
            }
        }
        if (!flashVersion) {
            return false;
        }
        var major = parseInt(flashVersion[0], 10), minor = parseInt(flashVersion[1], 10);
        HAS_FLASH_THROTTLED_BUG = major > 9 && minor > 0;
        return true;
    },
    isMobile: function() {
        var moblie = false;
        var userAgent = navigator.userAgent.toLowerCase();
        var keywords = ["android", "iphone", "ipod", "ipad", "windows phone", "mqqbrowser"];
        if (userAgent.indexOf('windows nt') < 0 || (userAgent.indexOf('windows nt') >= 0 && userAgent.indexOf('compatible; msie 9.0;') >= 0)) {
            if (userAgent.indexOf('windows nt') < 0 && userAgent.indexOf('mMacintosh') < 0) {
                for (var i = 0; i < keywords.length; i++) {
                    var v = keywords[i];
                    if (userAgent.indexOf(v) >= 0) {
                        moblie = v;
                        break;
                    }
                }

            }
        }
        return moblie;
    },
    /**
     *比较软件版本号的大小
     *如果nowVersion>outVersion,返回1,nowVersion<outVersion 返回-1，nowVersion=outVersion 返回0
     * */
    compareVersion:function(nowVersion, outVersion){
        if (outVersion !== nowVersion) {
            var nowArray = nowVersion.split('.');
            var outArray =  outVersion.split('.');
            for (var i = 0; i < nowArray.length; i++) {
                var result = parseInt(nowArray[i]) - parseInt(outArray[i]);
                if (result) {
                    return result > 0?1:-1;
                }
            }
        }
        return 0;
    }
};


Util.Input = {
    getInputPositon: function(elem) {
        if (document.selection) {   //IE Support
            elem.focus();
            var Sel = document.selection.createRange();
            return {
                left: Sel.boundingLeft + $(document).scrollLeft() + 5,
                top: Sel.boundingTop + $(document).scrollTop() + 4
            };
        } else {
            var that = this;
            var cloneDiv = '{$clone_div}', cloneLeft = '{$cloneLeft}', cloneFocus = '{$cloneFocus}', cloneRight = '{$cloneRight}';
            var none = '<span style="white-space:pre-wrap;"> </span>';
            var div = elem[cloneDiv] || document.createElement('div'), focus = elem[cloneFocus] || document.createElement('span');
            var text = elem[cloneLeft] || document.createElement('span');
            var offset = that._offset(elem), index = this._getFocus(elem), focusOffset = {
                left: 0,
                top: 0
            };

            if (!elem[cloneDiv]) {
                elem[cloneDiv] = div, elem[cloneFocus] = focus;
                elem[cloneLeft] = text;
                div.appendChild(text);
                div.appendChild(focus);
                document.body.appendChild(div);
                focus.innerHTML = '|';
                focus.style.cssText = 'display:inline-block;width:0px;overflow:hidden;z-index:-100;word-wrap:break-word;word-break:break-all;';
                div.className = this._cloneStyle(elem);
                div.style.cssText = 'visibility:hidden;display:inline-block;position:absolute;z-index:-100;word-wrap:break-word;word-break:break-all;overflow:hidden;';
            }
            ;
            div.style.left = this._offset(elem).left + "px";
            div.style.top = this._offset(elem).top + "px";
            var strTmp = elem.value.substring(0, index).replace(/</g, '<').replace(/>/g, '>').replace(/\n/g, '<br/>').replace(/\s/g, none);
            text.innerHTML = strTmp;

            focus.style.display = 'inline-block';
            try {
                focusOffset = this._offset(focus);
            } catch (e) {
            }
            ;
            focus.style.display = 'none';
            return {
                left: focusOffset.left,
                top: focusOffset.top,
                bottom: focusOffset.bottom
            };
        }
    },
    // 克隆元素样式并返回类
    _cloneStyle: function(elem, cache) {
        if (!cache && elem['${cloneName}'])
            return elem['${cloneName}'];
        var className, name, rstyle = /^(number|string)$/;
        var rname = /^(content|outline|outlineWidth)$/; //Opera: content; IE8:outline && outlineWidth
        var cssText = [], sStyle = elem.style;

        for (name in sStyle) {
            if (!rname.test(name)) {
                val = this._getStyle(elem, name);
                if (val !== '' && rstyle.test(typeof val)) { // Firefox 4
                    name = name.replace(/([A-Z])/g, "-$1").toLowerCase();
                    cssText.push(name);
                    cssText.push(':');
                    cssText.push(val);
                    cssText.push(';');
                }
                ;
            }
            ;
        }
        ;
        cssText = cssText.join('');
        elem['${cloneName}'] = className = 'clone' + (new Date).getTime();
        this._addHeadStyle('.' + className + '{' + cssText + '}');
        return className;
    },
    // 向页头插入样式
    _addHeadStyle: function(content) {
        var style = this._style[document];
        if (!style) {
            style = this._style[document] = document.createElement('style');
            document.getElementsByTagName('head')[0].appendChild(style);
        }
        ;
        style.styleSheet && (style.styleSheet.cssText += content) || style.appendChild(document.createTextNode(content));
    },
    _style: {},
    // 获取最终样式
    _getStyle: 'getComputedStyle' in window ? function(elem, name) {
        return getComputedStyle(elem, null)[name];
    } : function(elem, name) {
        return elem.currentStyle[name];
    },
    // 获取光标在文本框的位置
    _getFocus: function(elem) {
        var index = 0;
        if (document.selection) {// IE Support
            elem.focus();
            var Sel = document.selection.createRange();
            if (elem.nodeName === 'TEXTAREA') {//textarea
                var Sel2 = Sel.duplicate();
                Sel2.moveToElementText(elem);
                var index = -1;
                while (Sel2.inRange(Sel)) {
                    Sel2.moveStart('character');
                    index++;
                }
                ;
            }
            else if (elem.nodeName === 'INPUT') {// input
                Sel.moveStart('character', -elem.value.length);
                index = Sel.text.length;
            }
        }
        else if (elem.selectionStart || elem.selectionStart == '0') { // Firefox support
            index = elem.selectionStart;
        }
        return (index);
    },
    // 获取元素在页面中位置
    _offset: function(elem) {
        var box = elem.getBoundingClientRect(), doc = elem.ownerDocument, body = doc.body, docElem = doc.documentElement;
        var clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0;
        var top = box.top + (self.pageYOffset || docElem.scrollTop) - clientTop, left = box.left + (self.pageXOffset || docElem.scrollLeft) - clientLeft;
        return {
            left: left,
            top: top,
            right: left + box.width,
            bottom: top + box.height
        };
    },
    getCurSor: function(obj) {
        var val = obj.value != undefined ? obj.value : obj.innerHTML;
        var result = 0;
        if (obj.selectionStart != undefined) {
            result = obj.selectionStart + "|" + obj.selectionEnd;
        } else {
            var rng;
            if (obj.tagName == "TEXTAREA") {
                var range = obj.ownerDocument.selection.createRange();
                var range_all = obj.ownerDocument.body.createTextRange();
                range_all.moveToElementText(obj);
                for (var start = 0; range_all.compareEndPoints("StartToStart", range) < 0; start++) {
                    range_all.moveStart('character', 1);
                }
                for (var i = 0; i <= start; i++) {
                    if (val.charAt(i) == '\n')
                        start++;
                }
                //var range_all=obj.ownerDocument.body.createTextRange();
                range_all.moveToElementText(obj);
                for (var end = 0; range_all.compareEndPoints('StartToEnd', range) < 0; end++) {
                    range_all.moveStart('character', 1);
                }
                for (var i = 0; i <= end; i++) {
                    if (val.charAt(i) == '\n')
                        end++;
                }
                return start + "|" + end;
            } else {
                rng = document.selection.createRange();
            }
            rng.moveStart("character", -val.length);
            result = rng.text.length;
            result = result + "|" + result;
        }
        return result;
    },
    moveCur: function(obj, n) {
        if (obj.selectionStart != undefined) {
            obj.selectionStart = n;
            obj.selectionEnd = n;
        } else {
            var pn = parseInt(n);
            if (isNaN(pn))
                return;
            var rng = obj.createTextRange();
            var note = 0;
            for (var i = 0; i <= pn; i++) {
                if (rng.text.charAt(i) == '\n')
                    note++;
            }
            pn -= note;
            rng.moveStart("character", pn);
            rng.collapse(true);
            rng.select();
        }
    }
};

Util.Email = {
    getSMTPByEmail: function(email) {
        var temp = email.split('@');
        var host = temp[1].toLowerCase();
        if (host == 'gmail.com') {
            return 'gmail.google.com';
        }
        if (host == 'vip.sina.com') {
            return 'vip.sina.com.cn';
        }
        var allow_hosts = ['126', '163', 'sina', 'qq', '139', 'hotmail', 'live', 'yahoo', '21cn', 'sohu'];
        var temp = host.split('.');
        if ($.inArray(temp[0], allow_hosts) > -1) {
            return 'mail.' + host;
        }
        return false;
    }
};


Util.Number = {
    bitSize: function(num) {
        if (typeof(num) != 'number') {
            num = Number(num);
        }
        if (num < 0) {
            return '';
        }
        var type = new Array('B', 'KB', 'MB', 'GB', 'TB', 'PB');
        var j = 0;
        while (num >= 1024) {
            if (j >= 5)
                return num + type[j];
            num = num / 1024;
            j++;
        }
        if (num == 0) {
            return num;
        } else {
            return Math.round(num * 100) / 100 + type[j];
        }
    }
};

//够快客户端（pc，mac客户端及企业套件）函数通用js函数
var gkClientCommon = {
    disableDefaultEvent: function() {
        $('body').on({
            dragstart: function(e) {
                e.preventDefault();
            },
            drop: function(e) {
                e.preventDefault();
            }
        });

        //处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外  
        var banBackSpace = function(e) {
            //console.log(1);
            var ev = e || window.event;//获取event对象     
            var obj = ev.target || ev.srcElement;//获取事件源     

            var t = obj.type || obj.getAttribute('type');//获取事件源类型    
            //console.log(t);
            //获取作为判断条件的事件类型  
            var vReadOnly = obj.getAttribute('readonly');
            var vEnabled = obj.getAttribute('enabled');
            //处理null值情况  
            vReadOnly = (vReadOnly == null) ? false : vReadOnly;
            vEnabled = (vEnabled == null) ? true : vEnabled;
            //console.log(vReadOnly);
            //console.log(ev.keyCode);
            //当敲Backspace键时，事件源类型为密码或单行、多行文本的，  
            //并且readonly属性为true或enabled属性为false的，则退格键失效  
            var flag1 = (ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea")
                    && (vReadOnly == "readonly" || vEnabled != true)) ? true : false;
            //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效  
            var flag2 = (ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea")
                    ? true : false;

            //判断  
            if (flag2) {
                return false;
            }
            if (flag1) {
                return false;
            }
        };

        //禁止后退键 作用于Firefox、Opera  
        document.onkeypress = banBackSpace;
        //禁止后退键  作用于IE、Chrome  
        document.onkeydown = banBackSpace;
    }
};
/** js数据 **/
Util.Data = {
    cities: {
        "上海市": ["上海市"],
        "北京市": ["北京市"],
        "天津市": ["天津市"],
        "重庆市": ["重庆市"],
        "广东省": ["广州市", "深圳市", "珠海市", "汕头市", "韶关市", "佛山市", "江门市", "湛江市", "茂名市", "肇庆市", "惠州市", "梅州市", "汕尾市", "河源市", "阳江市", "清远市", "东莞市", "中山市", "潮州市", "揭阳市", "云浮市"],
        "江苏省": ["南京市", "无锡市", "徐州市", "常州市", "苏州市", "南通市", "连云港市", "淮安市", "盐城市", "扬州市", "镇江市", "泰州市", "宿迁市"],
        "浙江省": ["杭州市", "宁波市", "温州市", "嘉兴市", "湖州市", "绍兴市", "金华市", "衢州市", "舟山市", "台州市", "丽水市"],
        "河北省": ["石家庄市", "唐山市", "秦皇岛市", "邯郸市", "邢台市", "保定市", "张家口市", "承德市", "沧州市", "廊坊市", "衡水市"],
        "山西省": ["太原市", "大同市", "阳泉市", "长治市", "晋城市", "朔州市", "晋中市", "运城市", "忻州市", "临汾市", "吕梁市"],
        "台湾省": ["台北市", "高雄市", "基隆市", "台中市", "台南市", "新竹市", "嘉义市", "台北县", "宜兰县", "桃园县", "新竹县", "苗栗县", "台中县", "彰化县", "南投县", "云林县", "嘉义县", "台南县", "高雄县", "屏东县", "澎湖县", "台东县", "花莲县"],
        "辽宁省": ["沈阳市", "大连市", "鞍山市", "抚顺市", "本溪市", "丹东市", "锦州市", "营口市", "阜新市", "辽阳市", "盘锦市", "铁岭市", "朝阳市", "葫芦岛市"],
        "吉林省": ["长春市", "吉林市", "四平市", "辽源市", "通化市", "白山市", "松原市", "白城市", "延边朝鲜族自治州"],
        "黑龙江省": ["哈尔滨市", "齐齐哈尔市", "鹤岗市", "双鸭山市", "鸡西市", "大庆市", "伊春市", "牡丹江市", "佳木斯市", "七台河市", "黑河市", "绥化市", "大兴安岭地区"],
        "安徽省": ["合肥市", "芜湖市", "蚌埠市", "淮南市", "马鞍山市", "淮北市", "铜陵市", "安庆市", "黄山市", "滁州市", "阜阳市", "宿州市", "巢湖市", "六安市", "亳州市", "池州市", "宣城市"],
        "福建省": ["福州市", "厦门市", "莆田市", "三明市", "泉州市", "漳州市", "南平市", "龙岩市", "宁德市"],
        "江西省": ["南昌市", "景德镇市", "萍乡市", "九江市", "新余市", "鹰潭市", "赣州市", "吉安市", "宜春市", "抚州市", "上饶市"],
        "山东省": ["济南市", "青岛市", "淄博市", "枣庄市", "东营市", "烟台市", "潍坊市", "济宁市", "泰安市", "威海市", "日照市", "莱芜市", "临沂市", "德州市", "聊城市", "滨州市", "荷泽市"],
        "河南省": ["郑州市", "开封市", "洛阳市", "平顶山市", "安阳市", "鹤壁市", "新乡市", "焦作市", "濮阳市", "许昌市", "漯河市", "三门峡市", "南阳市", "商丘市", "信阳市", "周口市", "驻马店市"],
        "湖北省": ["武汉市", "黄石市", "十堰市", "宜昌市", "襄樊市", "鄂州市", "荆门市", "孝感市", "荆州市", "黄冈市", "咸宁市", "随州市", "恩施土家族苗族自治州", "仙桃市", "潜江市", "天门市", "神农架林区"],
        "湖南省": ["长沙市", "株洲市", "湘潭市", "衡阳市", "邵阳市", "岳阳市", "常德市", "张家界市", "益阳市", "郴州市", "永州市", "怀化市", "娄底市", "湘西土家族苗族自治州"],
        "甘肃省": ["兰州市", "金昌市", "白银市", "天水市", "嘉峪关市", "武威市", "张掖市", "平凉市", "酒泉市", "庆阳市", "定西市", "陇南市", "临夏回族自治州", "甘南藏族自治州"],
        "四川省": ["成都市", "自贡市", "攀枝花市", "泸州市", "德阳市", "绵阳市", "广元市", "遂宁市", "内江市", "乐山市", "南充市", "眉山市", "宜宾市", "广安市", "达州市", "雅安市", "巴中市", "资阳市", "阿坝藏族羌族自治州", "甘孜藏族自治州", "凉山彝族自治州"],
        "贵州省": ["贵阳市", "六盘水市", "遵义市", "安顺市", "铜仁地区", "毕节地区", "黔西南布依族苗族自治州", "黔东南苗族侗族自治州", "黔南布依族苗族自治州"],
        "海南省": ["海口市", "三亚市", "五指山市", "琼海市", "儋州市", "文昌市", "万宁市", "东方市", "澄迈县", "定安县", "屯昌县", "临高县", "白沙黎族自治县", "昌江黎族自治县", "乐东黎族自治县", "陵水黎族自治县", "保亭黎族苗族自治县", "琼中黎族苗族自治县"],
        "云南省": ["昆明市", "曲靖市", "玉溪市", "保山市", "昭通市", "丽江市", "思茅市", "临沧市", "楚雄彝族自治州", "红河哈尼族彝族自治州", "文山壮族苗族自治州", "西双版纳傣族自治州", "大理白族自治州", "德宏傣族景颇族自治州", "怒江傈僳族自治州", "迪庆藏族自治州"],
        "青海省": ["西宁市", "海东地区", "海北藏族自治州", "黄南藏族自治州", "海南藏族自治州", "果洛藏族自治州", "玉树藏族自治州", "海西蒙古族藏族自治州"],
        "陕西省": ["西安市", "铜川市", "宝鸡市", "咸阳市", "渭南市", "延安市", "汉中市", "榆林市", "安康市", "商洛市"],
        "广西壮族自治区": ["南宁市", "柳州市", "桂林市", "梧州市", "北海市", "防城港市", "钦州市", "贵港市", "玉林市", "百色市", "贺州市", "河池市", "来宾市", "崇左市"],
        "新疆维吾尔自治区": ['乌鲁木齐市', '克拉玛依市', '吐鲁番地区', '哈密地区', '昌吉回族自治州 ', '博尔塔拉蒙古自治州 ', '巴音郭楞蒙古自治州 ', '阿克苏地区', '克孜勒苏柯尔克孜自治州 ', '喀什地区', '和田地区', '伊犁哈萨克自治州', '塔城地区', '阿勒泰地区', '石河子市', '阿拉尔市', '图木舒克市', '五家渠市'],
        "西藏自治区": ["拉萨市", "昌都地区", "山南地区", "日喀则地区", "那曲地区", "阿里地区", "林芝地区"],
        "宁夏回族自治区": ["银川市", "石嘴山市", "吴忠市", "固原市", "中卫市"],
        "内蒙古自治区": ['呼和浩特市', '包头市', '乌海市', '赤峰市', '通辽市', '鄂尔多斯市', '呼伦贝尔市', '巴彦淖尔市', '乌兰察布市', '兴安盟', '锡林郭勒盟', '阿拉善盟'],
        "香港特别行政区": ["香港"],
        "澳门特别行政区": ["澳门"]
    },
    scale: ['1-10', '11-50', '51-100', '101-500', '501-1000', '1001-5000', '5000+'],
    industry: ['计算机/互联网/通信/电子', '会计/金融/银行/保险', '贸易/消费/制造/营运', '制药/医疗', '广告/媒体', '房地产/建筑', '专业服务/教育/培训', '服务业', '物流/运输', '能源/原材料', '政府/非赢利机构/其他']
};