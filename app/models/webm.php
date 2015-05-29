<?php

class Webm extends Model 
{
	protected $id;
	protected $name;
	protected $source;

	public function __construct()
	{
		require 'webmmapper.php';
	}
}