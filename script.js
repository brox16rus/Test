/**
 * Created by User on 28.01.2018.
 */
"use strict";
//==================================================основные функции и объекты==========================================

var Validation = {

    //главная функция проверки
    'check': function(element ,pattern, message, important , infoDivName)
    {
        /*element = id input в форме ,
         infoDivName = в какой див будет выводится сообщаение message,
         pattern = патерн по которому проверяем ,
         message = сообщаение которое выводится при неправильном вводе. (вводится с кавычками)
         important = важное для заполнения поля или нет , значения 1(да важно) и 0 (нет не важно)
         */
        var objElement = $(element);
        var objInfoDivName = $(infoDivName);
        //Добавляем div c информацией о проверки валидации
        var position = objElement.offset();
        //Расположение div'а с информацие о прохождениее валидации  (верно заполнена информация или нет)
        objInfoDivName.css
        ({
            "top": position.top - 3,
            "left": position.left + objElement.width() + 15
        });

        //Проверяем на соответсвтие с паттерном
        if (!pattern.test(objElement.val()))
        {
            if (important > 0)
            {
                Validation.errors = 1;
            }
            objInfoDivName.removeClass('correct').addClass('error').html('&larr; ' + message).show();
            objElement.removeClass('normal').addClass('wrong');
        }
        else
        {
            if (important > 0)
            {
                Validation.errors = 0;
            }
            objInfoDivName.removeClass('error').addClass('correct').html('&radic;').show();
            objElement.removeClass('wrong').addClass('normal');
        }
        //освобождаем память
        objElement=null;
        objInfoDivName=null;
        position=null;
    },

    //С объектом проще будет работать , поэтому запишем все основные переменные нашей валидации в объект.
    'create': function (element,pattern,message,important ,postfix)
    {
        //postfix - постфикс для содания дива(element.name+postfix)=infoDivName в который будет передаваться информация message. (вводится с кавычками)
        var objVal = {};
        //postfix что будет добавляться после имени дива с информацией по валидации
        objVal.element = element;
        objVal.pattern = pattern;
        objVal.message = message;
        objVal.important = important;
        $('body').append('<div id="'+element.name+postfix+'"></div>');
        objVal.div = $('#'+element.name+postfix);
        objVal.objdom = $('#'+element.name);
        objVal.checkValidation = function()
        {
            Validation.check(objVal.element, objVal.pattern, objVal.message, objVal.important , objVal.div);
        };
        return objVal;
    },

    // если нам надо по буквенно проверять ввод.
    'inspectionKeyUp' : function (objVal)
    {
        function inspect()
        {
            Validation.check(objVal.element, objVal.pattern, objVal.message, objVal.important , objVal.div);
        }
        var inspectedElement = objVal.element;
        inspectedElement.onkeyup = inspectedElement.oninput = inspect;
        inspectedElement.oncut = function() {
            setTimeout(inspect, 0); // на момент oncut значение еще старое
        };
        //освобождаем память
        inspectedElement=null;
    },



    'inspectionChange' : function(objVal)
    {
        objVal.objdom.change(objVal.checkValidation);
    }

};


var sortTable =
{
    //colNum - номер столбца (начинается с 0)
    //type - тип сортировки (пока есть string и number)
    //SortObj - Объект сортировки (в данном случае таблица)
    // Сама функция сортировки
    sort : function(colNum, type, SortObj)
    {
        var tbody = SortObj.getElementsByTagName('tbody')[0];

        // Составить массив из TR
        var rowsArray = [].slice.call(tbody.rows);

        // определить функцию сравнения, в зависимости от типа
        var compare;

        switch (type) {
            case 'number':
                compare = function(rowA, rowB) {
                    return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML;
                };
                break;
            case 'string':
                compare = function(rowA, rowB) {
                    return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML;
                };
                break;
        }

        // сортировать
        rowsArray.sort(compare);

        // Убрать tbody из большого DOM документа для лучшей производительности (надо бы везде заняться)
        SortObj.removeChild(tbody);

        // добавить результат в нужном порядке в TBODY
        // они автоматически будут убраны со старых мест и вставлены в правильном порядке
        for (var i = 0; i < rowsArray.length; i++) {
            tbody.appendChild(rowsArray[i]);
        }

        SortObj.appendChild(tbody);
    },

    // сортировка таблицы по нажатию на TH.
    sortTh : function(tableID)
    {
        var sortObj = tableID;

        sortObj.onclick = function(e) {
            if (e.target.tagName != 'TH') return;

            // Если TH -- сортируем
            sortTable.sort(e.target.cellIndex, e.target.getAttribute('data-type'),sortObj);
        };

    },

    sortButton : function(tableID,buttonId,colNum,type)
    {
        buttonId.onclick = function(){
            sortTable.sort(colNum,type,tableID);
        };
    },

    tableTH: function(tableID)
    {
        //мб пригодиться в будущем , делает массив из шапки таблицы
        var TH = tableID.tHead.innerHTML;
        var arr = TH.split('<th data-type="string">');
        for (var i = 0; i < arr.length; i++)
        {
        if(arr[i].indexOf('<tr>')) arr[i]=arr[i].replace('<tr>','');
        if(arr[i].indexOf('</th>')) arr[i]=arr[i].replace('</th>','');
        if(arr[i].indexOf('</tr>')) arr[i]=arr[i].replace('</tr>','');
        }
        arr.splice(0, 1);
        return arr;
    }

};


function AjaxFormPOST(resultId,formId,url)
{
    /*resultId = div где будут писаться ошибки или что все сработало (без кавычек),
     formId = ID формы откуда будем посылать данные (без кавычек),
     url = куда посылаем данные (с кавычками , "." в расширение сбивает с толку JS а писать редактор мне лень ?\_(?)_/?
     errorDiv = див куда будут писаться ошибки(без кавычек).
     */
            jQuery.ajax({
                url:     url,
                type:     "POST",
                dataType: "html",
                data: jQuery(formId).serialize(),
                success: resultId.innerHTML = "Отослано",
                error : function (jqXHR, exception)
                {
                    var msg = '';
                    if (jqXHR.status === 0)
                    {
                        msg = 'Not connect.\n Verify Network.';
                    } else if (jqXHR.status == 404)
                    {
                        msg = 'Requested page not found. [404]';
                    } else if (jqXHR.status == 500)
                    {
                        msg = 'Internal Server Error [500].';
                    } else if (exception === 'parsererror')
                    {
                        msg = 'Requested JSON parse failed.';
                    } else if (exception === 'timeout')
                    {
                        msg = 'Time out error.';
                    } else if (exception === 'abort')
                    {
                        msg = 'Ajax request aborted.';
                    } else {
                        msg = 'Uncaught Error.\n' + jqXHR.responseText;
                    }
                    $(resultId).html(msg);
                }
            });
}
function buttonPOST(resultId,formId,buttonId,url)
{
    //buttonId = ID кнопки (без кавычек),
    buttonId.onclick = function()
    {
        if(Validation.errors == 0)
        {
            AjaxFormPOST(resultId,formId,url)
        }
        else
        {
            $(resultId).html('Заполните поля по стандарту')
        }
    }

}
function pagination()
{

}

//==================================================Функции под проект==================================================
$( document ).ready(function()
{
    var surnameValidation = Validation.create(surname,/^[A-ZА-Я_-]{1}[a-zа-я_-]+$/i,"Фамилия заполнена не по стандарту",0 ,'Info');
    var birthdayValidation = Validation.create(birthday,/^[0-9]{2}\-[0-9]{2}\-[0-9]{4}$/i,"Дата рождения заполнена не по стандарту",1,'Info');
    var phoneValidation = Validation.create(phone,/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/i,"Телефон заполнен не по стандарту",1,'Info');
    var emailValidation = Validation.create(email,/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/,"Email заполнен не по стандарту",0,'Info');
    Validation.inspectionKeyUp(surnameValidation);
    Validation.inspectionChange(birthdayValidation);
    Validation.inspectionChange(phoneValidation);
    Validation.inspectionChange(emailValidation);
   // buttonPOST(resultPost,form_main,sendAjax,"action.php");
    sortTable.sortButton(Clients,sendAjax,0,'string');
    sortTable.sortTh(Clients);
});



