<?php

class Main extends Controller
{
	function __construct()
    {
        include (SITE_PATH . DS . 'app' . DS . 'models' . DS . 'webm.php');
        $this->model = new Webm();
        $this->view = new View();
    }

    function Index()
    {
        $this->view->generate('main.php', 'template.php');
    }
}