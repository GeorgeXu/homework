function FileProgress(file, target) {
    var _self = this;
    this.target = target;
    this.fileProgressID = file.id;
    this.fileProgressWrapper = $('#' + this.fileProgressID);
    if (!this.fileProgressWrapper.size()) {
        file = this.fetchFile(file);
        this.fileProgressWrapper = this.buildUploadItem(file);
        target.find('.no_content').remove();
        if (!target.find('.upload_item').size()) {
            target.prepend(this.fileProgressWrapper);
        } else {
            target.find('.upload_item').last().after(this.fileProgressWrapper);
        }
        this.fileProgressElement = this.fileProgressWrapper.find('.upload_progress');
        this.uploadMsgElement = this.fileProgressWrapper.find('.upload_msg');
        this.toggleCancel(true);
    } else {
        this.fileProgressElement = this.fileProgressWrapper.find('.upload_progress');
        this.uploadMsgElement = this.fileProgressWrapper.find('.upload_msg');
    }
}
;
FileProgress.prototype.fetchFile = function(file) {
    if ($.isNumeric(file.size)) {
        file.bitedLeaveSize = file.bitedTotalSize = Util.Number.bitSize(file.size);
    }
    return file;
};
FileProgress.prototype.getUploadItemTmpl = function() {
    var tmpl = '';
    tmpl += '<div class="item file_item upload_item" id="${id}">';
    tmpl += '<div class="progress_bg_bar upload_progress"></div>';
    tmpl += '<div class="item_content c_f_after">';
    tmpl += '<i class="f_l file_icon icon_other"></i>';
    tmpl += '<div class="f_l filename">${name}</div>';
    tmpl += '<div class="f_l stat">';
    tmpl += '{{if typeof size!=="undefined"&&$.isNumeric(size)}}';
    tmpl += '<span class="leave_size">'+'剩余'+'<strong>${bitedLeaveSize}，</strong></span><span class="total_size">'+'总共'+'<strong>${bitedTotalSize}</strong></span>';
    tmpl += '{{else}}';
    tmpl += '<span class="upload_loader"><img style="vertical-align:middle;margin-right:5px;" src="/Common/images/icon/loading16x16.gif" alt="" />' +'正在上传...' + '</span>';
    tmpl += '{{/if}}';
    tmpl += '</div>';
    tmpl += '<div class="f_r btn_wrapper">';
    //tmpl += '<button class="btn cancel">取消</button>';
    tmpl += '</div>';
    tmpl += '<div class="f_r upload_msg"></div>';
    tmpl += '</div>';

    tmpl += '</div>';
    return tmpl;
};
FileProgress.prototype.buildUploadItem = function(file) {
    return $.tmpl(this.getUploadItemTmpl(), file);
};
FileProgress.prototype.setTimer = function(timer) {
    this.fileProgressElement["FP_TIMER"] = timer;
};
FileProgress.prototype.getTimer = function(timer) {
    return this.fileProgressElement["FP_TIMER"] || null;
};

FileProgress.prototype.setProgress = function(percentage, bitUpload) {
    var per = percentage + '%';
    this.fileProgressElement.css('width', per);
    //this.fileProgressWrapper.find('.upload_msg').css('color', '#000').text(per).attr('title', per).show();
    this.appear();
};
FileProgress.prototype.setLeaveSize = function(bitUploaded, bitTotal) {
    var leave = bitTotal - bitUploaded;
    var bitedLeave = Util.Number.bitSize(leave);
    if (leave > 0) {
        this.fileProgressWrapper.find('.leave_size strong').text(bitedLeave + '，');
    } else {
        this.fileProgressWrapper.find('.leave_size').hide();
    }

};
FileProgress.prototype.setSaveing = function() {
    this.disappear();
    this.toggleCancel(false);
    this.uploadMsgElement.text('正在存储...').show();
};
FileProgress.prototype.setUploading = function() {
    this.disappear();
    this.uploadMsgElement.text('正在上传...').show();
};
FileProgress.prototype.setComplete = function() {
    this.fileProgressWrapper.css('width', '100%');
};
FileProgress.prototype.setSuccess = function(meta) {
    this.disappear();
    this.toggleCancel(false);
    this.fileProgressWrapper.find('.stat').hide();
    this.uploadMsgElement.text('上传成功').css('color', '#6185bc').show();
//    var win = window.opener.top;
//    if (!win) {
//        return;
//    }
//    if (win.PAGE_CONFIG.fullpath !== PAGE_CONFIG.fullpath) {
//        return;
//    }
//    var fileItem = win.gkStorage.buildFileItem(meta);
//    var list = $(win.document).find('.list');
//    if (!list.size()) {
//        return;
//    }
//    var existItem = list.find('.file_item[data-hash="' + meta.hash + '"]');
//    var add = true;
//    if (existItem.size()) {
//        existItem.remove();
//        add = false;
//    }
//
//    list.prepend(fileItem);
//    win.gkStorage.initFileItem(fileItem);
//    if (add && win.PAGE_CONFIG && $.isNumeric(win.PAGE_CONFIG.amount)){
//         win.PAGE_CONFIG.amount += 1;
//    }

};
FileProgress.prototype.setFail = function(errorMsg) {
    this.disappear();
    this.setErrorMsg(errorMsg);
};

FileProgress.prototype.setStatus = function(status, error) {
    if (!error) {
        this.fileProgressWrapper.find('.upload_progress').hide();
        this.uploadMsgElement.css('color', '#505050').html(status).show();
        //this.fileProgressWrapper.find('.file_extra').hide();
    } else {
        this.setErrorMsg(status);
    }
};

FileProgress.prototype.setErrorMsg = function(error) {
    this.fileProgressElement.find('.progress').hide();
    this.uploadMsgElement.css('color', '#f00').html(error).attr('title', error).show();
    this.fileProgressWrapper.find('.stat').hide();
//this.fileProgressWrapper.find('.file_extra').hide();
//this.fileProgressWrapper.find('.upload_msg').css('color','#f00').text(error).attr('title',error).show();
};
FileProgress.prototype.toggleCancel = function(show, jqXHR) {
    var context = this;
    var cancel_btn = this.fileProgressWrapper.find('.cancel');
    show ? cancel_btn.show() : cancel_btn.hide();
    cancel_btn.click(function() {
        context.fileProgressWrapper.fadeOut(function() {
            context.fileProgressWrapper.remove();
            if (jqXHR) {
                jqXHR.abort();
            }
        });

        return;
    });

};

FileProgress.prototype.appear = function() {
    this.fileProgressElement.show();
};
FileProgress.prototype.disappear = function() {
    this.fileProgressElement.hide();
    this.fileProgressWrapper.find('.upload_loader').remove();
};
FileProgress.prototype.setRemove = function() {
    this.fileProgressWrapper.remove();
};

