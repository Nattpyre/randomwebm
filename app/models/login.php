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
		if(!$this->db) {
			die('Ошибка подключения к базе данных.');
		}
	}

	public function logIn($hash)
	{
		$stmt = $this->db->prepare("SELECT hash FROM admin WHERE hash='$hash'");
		$stmt->execute();
		$data = $stmt->get_result();
		$stmt->close();
		return $data;
	}
}