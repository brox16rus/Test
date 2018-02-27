<?php
/**
 * Created by PhpStorm.
 * User: Brox
 * Date: 31.01.2018
 * Time: 17:12
 */
//====================================== Основные функции и объекты ====================================================
class client
{
// Создаем клиента
    public function __construct($dataArray)
    {
        // т.к. сюда в основном $_POST прилетать будет , сделаем разделение массива на ключи и значения
        //$dataArray - имеет вид  [name] => Дмитрий , т.е. [имя свойства] => значение свойства
        //$arrayProperties == $arrayColumns в БД ( просто некоректно называть их тоже столбцами)
        $arrayValues = array_values($dataArray) ;
        $arrayProperties = array_keys($dataArray);
        $count = count($arrayProperties);
        for($i = 0; $i < $count; $i++)
        {
            $this->$arrayProperties[$i] = $arrayValues[$i];
        }
            $this->arrayProperties = $arrayProperties;
            $this->arrayValues = $arrayValues;

    }

    public function getValue($name)
    {
        return $this->$name;
    }

    public function  getArrayProperties()
    {
        return $this->arrayProperties;
    }

    public function  getArrayValues()
    {
        return $this->arrayValues;
    }


}



class db
{
    /*Работа с БД
    $tableName - имя Таблицы в БД
    $arrayColumns - Интересующие нас cтолбцы в нашей БД в виде массива с ключом = порядковый номер , значением = имя столбца.
    $arrayValues - Массив значений ,ключ $arrayColumns должен совпадать с каким то
    ключом $arrayValues чтобы сопоставить столбцы со значениями.
    $checkColumn - Столбец по которому будет проверяться  есть ли такое в БД.
    $checkValue - Значение столбца по которому будет проверяться  есть ли такое в БД.*/
    public function __construct($db_host,$db_user,$db_password,$dbName)
    {
        // $db_host,$db_user,$db_password,$dbName  Данные для соединения (хост,имя пользователя,пароль,имя БД)
        $dbConnection = mysql_connect($db_host,$db_user,$db_password) OR DIE("cant connect to BD");
        mysql_select_db($dbName,$dbConnection);
    }

    public function insert($arrayColumns,$arrayValues,$checkColumn,$tableName,$checkValue)
        //обавление в БД записи если такой записи нет в БД.
    {
        $count = $this->check($checkColumn,$tableName,$checkValue);
        print_r($count);
        if( $count > 0 )
        {
            echo "Такой пользователь уже существует";
        }
        else
        {
            $this->forceInsert($tableName,$arrayColumns,$arrayValues);
        }
    }

    public function forceInsert($tableName,$arrayColumns,$arrayValues)
    {
        //Добавление в БД записи без проверки о наличии
        $columns = implode(",", $arrayColumns);
        //приводим values к нормальному виду чтобы sql  не ругался
        $values = implode("','", $arrayValues);
        $values="'".$values."'";
        $sql = "INSERT INTO $tableName ($columns) VALUES ($values)";
        print_r($sql);
        $dbsave = mysql_query($sql);
        if (!mysql_error()){
            echo "Сохранено";
        }
        else{
            echo mysql_error();
        }
    }

    public function check($checkColumn,$tableName,$checkValue)
    {
        //Проверяет есть ли такая запись в БД.
        $res = mysql_query("SELECT $checkColumn FROM $tableName WHERE $checkColumn = $checkValue");
        $result = mysql_num_rows($res);
        return $result;
    }

    public function showColumns($tableName)
    {
        //Возвращает список столбцов в таблице
        $result = mysql_query("SHOW COLUMNS FROM $tableName");
        if (!$result)
        {
            echo 'Ошибка при выполнении запроса: ' . mysql_error();
            exit;
        }
        return $result;
    }

    public function structure($tableName,$start,$arrayColumns)
    {
        //$start - с какого столбца начать собирать массив с структурой (можнл указать null тогда начнеться с первого столбца)
        //$arrayColumns -( можно указать null тогда вернет все столбцы)
        $i = 0;
        if(isset($start))
        {
            $startPoint = $start; //
        }
        else
        {
            $startPoint = 0;
        }

        if (isset($arrayColumns))
        {
            $sqlResult = $this->showColumns($tableName);
            if (mysql_num_rows($sqlResult) > 0)
            {
                while ($row = mysql_fetch_assoc($sqlResult))
                {
                    if($startPoint > $i)
                    {
                        $i++;
                    }
                    else
                    {
                        $columns[$i]=$row['Field'];
                        $i++;
                    }
                }
                $result = array_intersect($columns,$arrayColumns);
                /* <== это убрать если буду использовать код в комментах ниже.
                Может понадобится чтобы ключи в массиве начинались с 0 и шли по порядку т.е 0,1,2,3...
                $intersect = array_intersect($columns,$arrayColumns);
                $columns = array(); переопределим массив чтобы ключи шли 0,1,2 и т.д.
                foreach ($intersect as $v)
                $columns []= $v;*/
            }
            else
            {
                echo "Error in function structure";
            }
            return $result;
        }
        else
        {
            //можно было оставить только это , сделать другой сборщик таблиц...но я решил оставить так
            $sqlResult = $this->showColumns($tableName);
            if (mysql_num_rows($sqlResult) > 0)
            {
                while ($row = mysql_fetch_assoc($sqlResult))
                {
                    if($startPoint > $i)
                    {
                        $i++;
                    }
                   else
                   {
                       $columns[$i-$startPoint]=$row['Field'];//$i-$startPoint это чтобы масив всегда начинался с ключа 0
                       $i++;
                   }
                }
            }
            else
            {
                echo "Error in function structure";
            }
            $result = $columns;
            return $result;
        }
    }

    public function select($tableName,$orderColumn,$arrayColumns)
    {
        //$orderColumn - Имя столбца по которому будет проводиться сортировка (можно указать null , тогда будет без сортировки)
        //$arrayColumns - можно указать * либо null тогда выберуться все столбцы.
        $i = 0;
        if ($arrayColumns == "*" or !isset($arrayColumns))
        {
            $columns = "*" ;
        }
        else
        {
            $columns = implode(",", $arrayColumns);
        }
        if (isset($orderColumn)){
            $sql = "SELECT $columns FROM $tableName ORDER BY $orderColumn";
        }
        else
        {
            $sql = "SELECT $columns FROM $tableName";
        }
        $sqlResult = mysql_query($sql);
        while( $row = mysql_fetch_assoc( $sqlResult ) )
        {
            $result[] = $row;

        }
        return $result;
    }


}
class tableHTML
{
    //генерация таблиц
    public function __construct($tableName,$start,$arrayColumns,$orderColumn,$db)
    {
        $this->dbColumns($tableName,$start,$arrayColumns,$db);
        $this->dbRows($tableName,$orderColumn,$arrayColumns,$db);
    }

    public function usersTable($tableName,$usersArrayColumns,$arrayColumns,$orderColumn,$db)
    {
        $this->usersColumns($tableName,$usersArrayColumns);
        $this->dbRows($tableName,$orderColumn,$arrayColumns,$db);
    }

    public function dbColumns($tableName,$start,$arrayColumns,$db)
    {
        //Создает шапку таблицы со столбцами из БД
        echo "<table id=".$tableName."><thead><tr>";
        $columns = $db->structure($tableName,$start,$arrayColumns);
        foreach($columns as $value){
            echo "<th data-type='string'>".$value."</th>";
        }
        echo "</tr></thead>";

    }

    public function usersColumns($tableName,$usersArrayColumns)
    {
        //Создает шапку таблицы с столбцами $usersArrayColumns
        //$usersArrayColumns - ключи должны совпадать с $arrayColumns для сопоставления массивов.
        echo "<table id=".$tableName."><thead><tr>";
        foreach($usersArrayColumns as $value){
            echo "<th data-type='string'>".$value."</th>";
        }
        echo "</tr></thead>";
    }

    public function dbRows($tableName,$orderColumn,$arrayColumns,$db)
    {
        //Вставляет из БД значения в таблицу
        echo "<tbody>";
        $sqlResult = $db->select($tableName,$orderColumn,$arrayColumns);
        $n=count($sqlResult);
        for($i=0;$i<$n;$i++){
            echo "<tr>";
            foreach ($arrayColumns as $column)
            {
                echo
                "<td>".$sqlResult[$i][$column]."</td>";
            }
        }
        echo "</tr></tbody></table>";
    }
}

//====================================== Функции для определенных проектов =====================================
class userRequest
{
    //Сюда вводятся объекты $client класса client и $db класса db
    public function insertClientInDB($client,$db,$checkColumn,$tableName)
    {
        $db->insert($client->getArrayProperties(),$client->getArrayValues(),$checkColumn,$tableName,$client->getValue($checkColumn));
    }
}

?>