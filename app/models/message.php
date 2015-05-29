<?php

class Message extends Model 
{
	protected $id;
	protected $name;
	protected $email;
	protected $subject;
	protected $message;

	public function __construct()
	{
		require 'messagemapper.php';
	}
}