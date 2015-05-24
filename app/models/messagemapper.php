<?php

class MessageMapper extends Message
{
	public $db;

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

	public function sendMessage($name, $email, $subject, $message)
	{
		$stmt = $this->db->prepare("INSERT INTO messages
						   			(name, email, subject, message)
						   			VALUES
						   			(?, ?, ?, ?) 
						   			");
		$stmt->bind_param('ssss', $name, $email, $subject, $message);
		if($stmt->execute())
		{
			$stmt->close();
			return TRUE;
		} else {
			$stmt->close();
			return FALSE;
		}
	}

	public function getNewMessage()
	{
		$stmt = $this->db->prepare("SELECT * FROM messages WHERE `read`=0 ORDER BY id LIMIT 1");
		$stmt->execute();
		$data = $stmt->get_result();
		$data = $data->fetch_assoc();
		$stmt->close();
		return $data;
	}

	public function readMessage($id)
	{
		$stmt = $this->db->prepare("UPDATE messages SET `read`=1 WHERE id=?");
		$stmt->bind_param('i', $id);
		$stmt->execute();
		$stmt->close();
	}

	public function deleteMessage($id)
	{
		$stmt = $this->db->prepare("DELETE FROM messages WHERE id=?");
		$stmt->bind_param('i', $id);
		$stmt->execute();
		$stmt->close();
	}

	public function countMessages()
	{
		$stmt = $this->db->prepare("SELECT COUNT(`read`) FROM messages WHERE `read`=0");
		$stmt->execute();
		$data = $stmt->get_result();
		$data = $data->fetch_assoc();
		$stmt->close();
		return $data;
	}
}