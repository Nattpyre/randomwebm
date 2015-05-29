<?php

class WebmMapper extends Webm
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
	public function getRandomWebm()
	{
		$data = $this->db->query("SELECT name, source 
								  FROM webms AS r1
								  JOIN ( SELECT (RAND() * (SELECT MAX(id) FROM webms)) AS id ) AS r2
								  WHERE r1.id >= r2.id
								  ORDER BY r1.id ASC 
								  LIMIT 1;");
        $data = $data->fetch_assoc();
        return $data;
	}

	public function getNewWebm() 
	{
		$data = $this->db->query("SELECT * FROM uploaded_webms ORDER BY id LIMIT 1");
		$data = $data->fetch_assoc();
		return $data;
	}

	public function checkWebmHash($name) {
		$checkWebms = $this->db->query("SELECT name FROM webms WHERE name='$name'");
		$checkUploads = $this->db->query("SELECT name FROM uploaded_webms WHERE name='$name'");
		if($checkWebms->num_rows > 0 || $checkUploads->num_rows > 0) {
			return TRUE;
		}
	} 

	public function uploadWebm($name, $source)
	{
		if(!($stmt = $this->db->prepare("INSERT INTO uploaded_webms
						   			(name, source)
						   			VALUES
						   			(?, ?) 
						   			"))) {
			throw new Exception("Не удалось подготовить данные: ( . $stmt->errno . ) . $stmt->error");
		}
		if(!$stmt->bind_param('ss', $name, $source)) {
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

	public function moveWebm($name, $source)
	{
		if(!($stmt = $this->db->prepare("INSERT INTO webms
								    (name, source)
								    VALUES
								    (?, ?)
								    "))){
			throw new Exception("Не удалось подготовить данные: ( . $stmt->errno . ) . $stmt->error");
		}
		if(!$stmt->bind_param('ss', $name, $source)) {
			throw new Excetion ("Не удалось привязать параметры: ( . $stmt->errno . ) . $stmt->error");
		}
		if(!$stmt->execute()) {
			throw new Exception("Не удалось запустить команду Mysql: ( . $stmt->errno . ) . $stmt->error");
		}
		$stmt->close();
	}

	public function deleteWebm($id)
	{
		if(!($stmt = $this->db->prepare("DELETE FROM uploaded_webms WHERE id=?"))) {
			throw new Exception("Не удалось подготовить данные: ( . $stmt->errno . ) . $stmt->error");
		}
		if(!$stmt->bind_param('i', $id)) {
			throw new Excetion ("Не удалось привязать параметры: ( . $stmt->errno . ) . $stmt->error");
		}
		if(!$stmt->execute()) {
			throw new Exception("Не удалось запустить команду Mysql: ( . $stmt->errno . ) . $stmt->error");
		}
		$stmt->close();
	}

	public function countWebms()
	{
		$data = $this->db->query("SELECT COUNT(id) FROM webms");
		$data = $data->fetch_assoc();
		$data = $data['COUNT(id)'];
		return $data;
	}

	public function countUploads ()
	{
		$data = $this->db->query("SELECT COUNT(id) FROM uploaded_webms");
		$data = $data->fetch_assoc();
		$data = $data['COUNT(id)'];
		return $data;
	}
}