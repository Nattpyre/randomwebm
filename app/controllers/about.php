<?php

class About extends Controller
{
    function Index()
    {	
        $this->view->generate('about.php', 'template.php');
    }
}