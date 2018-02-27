<html xmlns="http://www.w3.org/1999/html">
<head>
    <meta charset="utf-8">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="script.js"></script>
    <link rel="stylesheet" type="text/css" href="style.css">

</head>
<body>
        <form id="form_main" action="" method="post">
            <fieldset>
                <legend>Форма</legend>
            <p> <label id="surnameLabel" for="surname" class="block">Фамилия</label>
                <input type="text" name="surname" id="surname">
            <p> <label id="birthdayLabel" for="birthday" class="block">Дата рождения</label>
                <input type="text" name="birthday" id="birthday">
            <p> <label id="phoneLabel" for="phone" class="block">Номер телефона</label>
                <input type="text" name="phone" id="phone">
            <p> <label id="emailLabel" for="email" class="block">Email</label>
                <input type="text" name="email" id="email">
            <p> <label for="auto" class="block">Авто:</label>
                <select  name="auto" id="auto">
                    <option value="Audi">Audi</option>
                    <option value="BMW">BMW</option>
                    <option value="Ford">Ford</option>
                </select>
                <input type="hidden" name="referer" value="<?= isset($_SERVER['HTTP_REFERER']) ? htmlspecialchars($_SERVER['HTTP_REFERER']) : '' ?>">
            </fieldset>
            <p> <input type="button" id="sendAjax" value="Послать в БД" onclick="">
            <p> <div id="resultPost">Статус</div>
        </form>
        <?
        require 'lib.php';
        $db = new db('localhost','root','','Test');
        $table= new tableHTML('Clients',null,array('Surname','Birthday','Phone','Email','Auto'),'Surname',$db);
        ?>

</body>
</html>
