/**
 * Created by User on 06.02.2018.
 */
$( document ).ready(function() {
        $('body').append('<div id="surnameInfo" class="info"></div>');
        $('body').append('<div id="emailInfo" class="info"></div>');
        $('body').append('<div id="birthdayInfo" class="info"></div>');
        $('body').append('<div id="phoneInfo" class="info"></div>');

        var jVal = {
            'fullName' : function() {

                var nameInfo = $('#surnameInfo');
                var ele = $('#fullname');
                var pos = ele.offset();

                nameInfo.css({
                    top: pos.top-3,
                    left: pos.left+ele.width()+15
                });
                var patt = /^[A-ZА-Я_-]{1}[a-zа-я_-]+$/i;
                var textname = ele.val();
                textname = textname.charAt(0).toUpperCase()+textname.substring(1);
                document.getElementById('fullname').value = textname
                if(!patt.test(ele.val())) {
                    nameInfo.removeClass('correct').addClass('error').html('&larr; Неверно введена Фамилия').show();
                    ele.removeClass('normal').addClass('wrong');
                } else {
                    nameInfo.removeClass('error').addClass('correct').html('&radic;').show();
                    ele.removeClass('wrong').addClass('normal');
                }
            },
            'birthday' : function() {

                var nameInfo = $('#birthdayInfo');
                var ele = $('#birthday');
                var pos = ele.offset();

                nameInfo.css({
                    top: pos.top-3,
                    left: pos.left+ele.width()+15
                });
                var patt = /^[0-9]{2}\-[0-9]{2}\-[0-9]{4}$/i;
                if(!patt.test(ele.val())) {
                    jVal.errors = true;
                    nameInfo.removeClass('correct').addClass('error').html('&larr; Неверна введена Дата').show();
                    ele.removeClass('normal').addClass('wrong');
                } else {
                    nameInfo.removeClass('error').addClass('correct').html('&radic;').show();
                    ele.removeClass('wrong').addClass('normal');
                }
            },
            'email' : function() {

                var nameInfo = $('#emailInfo');
                var ele = $('#email');
                var pos = ele.offset();

                nameInfo.css({
                    top: pos.top-3,
                    left: pos.left+ele.width()+15
                });
                var patt = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/;
                if(!patt.test(ele.val())) {
                    nameInfo.removeClass('correct').addClass('error').html('&larr; Неверно введен email').show();
                    ele.removeClass('normal').addClass('wrong');
                } else {
                    nameInfo.removeClass('error').addClass('correct').html('&radic;').show();
                    ele.removeClass('wrong').addClass('normal');
                }
            },
            'phone' : function() {


                var nameInfo = $('#phoneInfo');
                var ele = $('#phone');
                var pos = ele.offset();

                nameInfo.css({
                    top: pos.top-3,
                    left: pos.left+ele.width()+15
                });
                var patt = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/i;
                if(!patt.test(ele.val())) {
                    jVal.errors = true;
                    nameInfo.removeClass('correct').addClass('error').html('&larr; Неверно введена телефон').show();
                    ele.removeClass('normal').addClass('wrong');
                } else {
                    nameInfo.removeClass('error').addClass('correct').html('&radic;').show();
                    ele.removeClass('wrong').addClass('normal');
                }
            },
        };

        $('#send').click(
            function (){
                jVal.errors = false
                jVal.birthday();
                jVal.phone();

                if(jVal.errors === false){
                    sendAjaxForm('form_test', 'action_ajax_form.php');
                }

            });

        $('#fullname').change(jVal.fullName);
        $('#birthday').change(jVal.birthday);
        $('#phone').change(jVal.phone);
        $('#email').change(jVal.email);
        $('#auto').change(jVal.auto);
    }


);

function sendAjaxForm(ajax_form, url) {
    jQuery.ajax({
        url:     url,
        type:     "POST",
        dataType: "html",
        data: jQuery("#"+ajax_form).serialize(),
        success: function(data) {
            $('.results').html(data);
        },
        error:function (jqXHR, exception) {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            $('#post').html(msg);
        },
    });
}