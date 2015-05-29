<?php

class View
{
    protected $template_view;
    
    function generate($content_view, $template_view, array $data = null)
    {
        if(is_array($data)) {
            extract($data);
        }
        
        require '/app/views/templates/default/'.$template_view;
    }
}