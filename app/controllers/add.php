<?php

class Add extends Controller
{
    function Index()
    {	
        $this->view->generate('add.php', 'template.php');
    }

    function checkInputData()
    {
    	include (SITE_PATH . DS . 'app' . DS . 'models' . DS . 'webm.php');
        $this->model = new Webm;

        $webmMapper = new WebmMapper;

    	if(!empty($_POST['source'])) {
        	if(mb_strlen($_POST['source']) > 128) {
			$data = 'Длина сообщения превышает максимум (128)!';
			return $data;
			}
        }

        $source = $_POST['source'];

        if(!empty($_FILES['webmUpload'])) {
	        if($_FILES['webmUpload']['error'] === UPLOAD_ERR_INI_SIZE || $_FILES['webmUpload']['error'] === UPLOAD_ERR_FORM_SIZE) {
				$data = 'Размер файла превышает максимум!';
				return $data;
			} elseif ($_FILES['webmUpload']['error'] === UPLOAD_ERR_PARTIAL) {
				$data = 'Файл поврежден!';
				return $data;
			} elseif ($_FILES['webmUpload']['error'] === UPLOAD_ERR_NO_FILE) {
				$data = 'Файл не был загружен!';
				return $data;
			} elseif ($_FILES['webmUpload']['error'] === UPLOAD_ERR_NO_TMP_DIR) {
				$data = 'Отсутствует временная папка. Обратитесь к администратору.';
				return $data;
			} elseif ($_FILES['webmUpload']['error'] === UPLOAD_ERR_CANT_WRITE) {
				$data = 'Ошибка при записи файла. Обратитесь к администратору.';
				return $data;
			} elseif ($_FILES['webmUpload']['error'] === UPLOAD_ERR_EXTENSION) {
				$data = 'Загрузка файла была остановлена. Обратитесь к администратору.';
				return $data;
			}

			if($_FILES['webmUpload']['size'] > 8388608) {
				$data = 'Размер файла превышает максимум!';
				return $data;
			}

			if(!preg_match('/.*(.webm)$/i', $_FILES['webmUpload']['name'])) {
				$data = 'Неверное расширение файла.';
				return $data;
			}

			$name = md5_file($_FILES['webmUpload']['tmp_name']).'.webm';

			$checkResult = $webmMapper->checkWebm($name);

			if($checkResult == TRUE) {
				$data = 'Эта вебм уже есть в базе!';
				return $data;
			}

			$tmpDir = SITE_PATH . DS . 'uploads' . DS;


			if(!move_uploaded_file($_FILES['webmUpload']['tmp_name'], $tmpDir.$name)) {
			$data = 'Ошибка при перемещении загруженного файла.';
			return $data;
			}

			$result = $webmMapper->uploadWebm($name, $source);

			if($result == TRUE) {
				$data = 'Файл успешно загружен и отправлен на проверку!';
				return $data;
			} else {
				$data = 'Ошибка базы данных. Обратитесь к администратору';
				return $data;
			}
		}
	}

	public function showResponse()
	{
		$data = htmlspecialchars($this->checkInputData(), ENT_QUOTES);
		echo $data;
	}
}