<?php

class MessageMapper extends Message
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

	public function sendMessage($name, $email, $subject, $message)
	{
		if(!($stmt = $this->db->prepare("INSERT INTO messages
						   			(name, email, subject, message)
						   			VALUES
						   			(?, ?, ?, ?) 
						   			"))) {
			throw new Exception("Не удалось подготовить данные: ( . $mysqli->errno . ) . $mysqli->error");
		}
		if(!($stmt->bind_param('ssss', $name, $email, $subject, $message))) {
			throw new Excetion ("Не удалось привязать параметры: ( . $stmt->errno . ) . $stmt->error");
		}
		if($stmt->execute())
		{
			$stmt->close();
			return TRUE;
		} else {
			$stmt->close();
			throw new Exception("Не удалось запустить команду Mysql: ( . $stmt->errno . ) . $stmt->error");
		}
	}

	public function getNewMessage()
	{
		$data = $this->db->query("SELECT * FROM messages WHERE `read`=0 ORDER BY id LIMIT 1");
		$data = $data->fetch_assoc();
		return $data;
	}

	public function readMessage($id)
	{
		if(!($stmt = $this->db->prepare("UPDATE messages SET `read`=1 WHERE id=?"))) {
			throw new Exception("Не удалось подготовить данные: ( . $mysqli->errno . ) . $mysqli->error");
		}
		if(!$stmt->bind_param('i', $id)) {
			throw new Excetion ("Не удалось привязать параметры: ( . $stmt->errno . ) . $stmt->error");
		}
		if(!$stmt->execute()) {
			throw new Exception("Не удалось запустить команду Mysql: ( . $stmt->errno . ) . $stmt->error");
		}
		$stmt->close();
	}

	public function deleteMessage($id)
	{
		if(!($stmt = $this->db->prepare("DELETE FROM messages WHERE id=?"))) {
			throw new Exception("Не удалось подготовить данные: ( . $mysqli->errno . ) . $mysqli->error");
		}
		if(!$stmt->bind_param('i', $id)) {
			throw new Excetion ("Не удалось привязать параметры: ( . $stmt->errno . ) . $stmt->error");
		}
		if(!$stmt->execute()) {
			throw new Exception("Не удалось запустить команду Mysql: ( . $stmt->errno . ) . $stmt->error");
		}
		$stmt->close();
	}

	public function countMessages()
	{
		$data = $this->db->query("SELECT COUNT(`read`) FROM messages WHERE `read`=0");
		$data = $data->fetch_assoc();
		$data = $data['COUNT(`read`)'];
		return $data;
	}
}