<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="shortcut icon" type="image/vnd.microsoft.icon" href="../images/favicon.ico" />

    <title>Админ панель - Random Webm</title>

    <link rel="stylesheet" type="text/css" href="../css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="../css/fonts.css" />
    <link rel="stylesheet" type="text/css" href="../css/style.css" />

    <script src="../js/jquery-2.1.4.min.js"></script>
    <script src="../js/bootstrap.min.js"></script>
  </head>
  <body>
	<nav class="navbar navbar-default">
  <div class="container-fluid">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
        <span class="sr-only">Toggle</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="../">Random Webm</a>
    </div>

    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
        <li class="active"><a href="/admin">Главная<span class="sr-only">(current)</span></a></li>
      </ul>
      <?php
        if(isset($_SESSION['admin'])) {
          echo '<p class="navbar-text navbar-right"><a class="navbar-link" href="/admin/logout">Выход</a></p>';
        }
       ?>
	<p class="navbar-text navbar-right">Всего webm в базе: <?php echo htmlspecialchars($data['webmscount']['COUNT(id)'], ENT_QUOTES); ?></p>
    </div>
  </div>
</nav>