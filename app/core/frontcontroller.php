<?php

class FrontController
{
    static function start()
    {
        try {
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
            require "app/controllers/".$controller_file;
        }
        else
        {
           throw new Exception('Ошибка 404. Запрашиваемая страница не найдена!');
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
            throw new Exception('Ошибка 404. Запрашиваемая страница не найдена!');
        }

        } catch (Exception $e) {
            header('HTTP/1.1 404 Not Found');
            require (SITE_PATH . '404.html');
        }
    
    }
}