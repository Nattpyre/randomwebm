<?php

class WebmMapper extends Webm
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
	public function getRandomWebm()
	{
		$data = $this->db->query("SELECT * 
                                  FROM webms AS r1
                                  JOIN ( SELECT (RAND() * (SELECT MAX(id) FROM webms)) AS id ) AS r2
                                  WHERE r1.id >= r2.id
                                  ORDER BY r1.id ASC 
                                  LIMIT 1
                                  ;");
        
        $data = $data->fetch_assoc();

        return $data;
	}

	public function getNewWebm() 
	{
		$stmt = $this->db->prepare("SELECT * FROM uploaded_webms ORDER BY id LIMIT 1");
		$stmt->execute();
		$data = $stmt->get_result();
		$data = $data->fetch_assoc();
		$stmt->close();
		return $data;
	}

	public function checkWebm($name) {
		$stmt = $this->db->prepare("SELECT * FROM webms WHERE name='$name'");
		$stmt->execute();
		$checkWebms = $stmt->get_result();
		$stmt = $this->db->prepare("SELECT * FROM uploaded_webms WHERE name='$name'");
		$stmt->execute();
		$checkUploads = $stmt->get_result();

		if($checkWebms->num_rows > 0 || $checkUploads->num_rows > 0) {
			return TRUE;
		}
	} 

	public function uploadWebm($name, $source)
	{
		$stmt = $this->db->prepare("INSERT INTO uploaded_webms
						   			(name, source)
						   			VALUES
						   			(?, ?) 
						   			");
		$stmt->bind_param('ss', $name, $source);
		if($stmt->execute())
		{
			$stmt->close();
			return TRUE;
		} else {
			$stmt->close();
			return FALSE;
		}
	}

	public function moveToMainBase ($name, $source)
	{
		$stmt = $this->db->prepare("INSERT INTO webms
								    (name, source)
								    VALUES
								    (?, ?)
								    ");
		$stmt->bind_param('ss', $name, $source);
		$stmt->execute();
		$stmt->close();
	}

	public function deleteWebm($id)
	{
		$stmt = $this->db->prepare("DELETE FROM uploaded_webms WHERE id=?");
		$stmt->bind_param('i', $id);
		$stmt->execute();
		$stmt->close();
	}

	public function countWebms()
	{
		$stmt = $this->db->prepare("SELECT COUNT(id) FROM webms");
		$stmt->execute();
		$data = $stmt->get_result();
		$data = $data->fetch_assoc();
		$stmt->close();
		return $data;
	}

	public function countUploads ()
	{
		$stmt = $this->db->prepare("SELECT COUNT(id) FROM uploaded_webms");
		$stmt->execute();
		$data = $stmt->get_result();
		$data = $data->fetch_assoc();
		$stmt->close();
		return $data;
	}
}