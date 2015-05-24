<?php

class View
{
    public $template_view;
    
    function generate($content_view, $template_view, $data = null)
    {
        if(is_array($data)) {
            extract($data);
        }
        
        include '/app/views/templates/default/'.$template_view;
    }
}