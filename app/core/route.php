<?php

class Route
{
    static function start()
    {
        $controller_name = 'Main';
        $action_name = 'index';
        
        $routes = explode('/', $_SERVER['REQUEST_URI']);

        if ( !empty($routes[1]) )
        {	
            $controller_name = $routes[1];
        }
        
        if ( !empty($routes[2]) )
        {
            $action_name = $routes[2];
        }

        $controller_file = strtolower($controller_name).'.php';
        $controller_path = "app/controllers/".$controller_file;
        if(file_exists($controller_path))
        {
            include "app/controllers/".$controller_file;
        }
        else
        {
            /*
            правильно было бы кинуть здесь исключение,
            но для упрощения сразу сделаем редирект на страницу 404
            */
            Route::ErrorPage404();
        }
        
        $controller_class = ucfirst($controller_name);
        $controller = new $controller_class;
        $action = $action_name;
        
        if(method_exists($controller, $action))
        {
            $controller->$action();
        }
        else
        {
            Route::ErrorPage404();
        }
    
    }
    
    function ErrorPage404()
    {
        $host = 'http://'.$_SERVER['HTTP_HOST'].'/';
        header('HTTP/1.1 404 Not Found');
        header("Status: 404 Not Found");
        header('Location:'.$host.'404');
    }
}