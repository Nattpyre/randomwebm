<?php

class Main extends Controller
{
	public function __construct()
    {
        require (SITE_PATH . DS . 'app' . DS . 'models' . DS . 'webm.php');
        $this->model = new Webm();
        $this->view = new View();
    }

    public function Index()
    {
        $this->view->generate('main.php', 'template.php');
    }
}