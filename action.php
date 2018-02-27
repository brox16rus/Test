
<?php
/**
 * Created by PhpStorm.
 * User: Brox
 * Date: 31.01.2018
 * Time: 15:09
 */
require 'lib.php';

//дополнительная проверка на наличие необходимых полей.
if ( $_POST["phone"]!='' && $_POST["birthday"]!='' && $_POST["auto"]!='' ) {
    //немного преобразуем телефон если нужно
    if (strlen($_POST["phone"]) == 7) {
        $_POST["phone"] = "88430000000" + $_POST["phone"];
    } elseif (strlen($result[2]) == 10) {
        $_POST["phone"] = "80000000000" + $_POST["phone"];
    }
    // сделаем первую букву фамилии заглавной , если она не заглавная
    if ($_POST["name"] != '')
    {
        $_POST["name"]= ucfirst($_POST["name"]);
    }

    //ну и сама операция
    //подключаем бд
    $db = new db('localhost','root','','Test');
    //создаем объект-клиент
    $client = new client($_POST);
    //создаем объект-запрос
    $newRequest = new userRequest();
    //записываем в бд
    $newRequest->insertClientInDB($client,$db,'phone','Clients');
}
else
{
    echo 'Значение телефона , даты рождения или марки автомобиля не передались';
}