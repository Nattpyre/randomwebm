<?php

class Login extends Model
{
	private $db;

	public function __construct()
	{
		$this->db = new mysqli(DB_HOST,
					 		   DB_USER,
					           DB_PASS,
					  	       DB_NAME
					  		   );
		if ($this->db->connect_errno) {
    		throw new Exception("Не удалось подключиться к базе данных: ( . $this->db->connect_errno . ) . $this->db->connect_error");
		}
	}

	public function logIn($hash)
	{
		$data = $this->db->query("SELECT hash FROM admin WHERE hash='$hash'");
		return $data;
	}
}