<?php

class Contacts extends Controller
{
    function Index()
    {	
        $this->view->generate('contacts.php', 'template.php');
    }

    public function checkMessage()
	{
		require (SITE_PATH . DS . 'app' . DS . 'models' . DS . 'message.php');
        $this->model = new Message;

        $messageMapper = new MessageMapper;

        if(empty($_POST['name']) || empty($_POST['email']) || empty($_POST['subject']) || empty($_POST['message'])) {
        	$data = 'Заполнены не все поля!';
        	return $data;
        }

        if(mb_strlen($_POST['name']) > 64) {
        	$data = 'Длина поля "Имя" превышает максимум (64)!';
        	return $data;
        }

        if(!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
        	$data = 'Email введен некорректно!';
        	return $data;
        } 

        if(mb_strlen($_POST['subject'] > 64)) {
        	$data = 'Длина поля "Тема" превышает максимум (64)!';
        	return $data;
        }

        if(mb_strlen($_POST['message'] > 512)) {
        	$data = 'Длина сообщения превышает максимум (512)!';
        	return $data;
        }

        $name = $_POST['name'];
        $email = $_POST['email'];
        $subject = $_POST['subject'];
        $message = $_POST['message'];

        $result = $messageMapper->sendMessage($name, $email, $subject, $message);

        if($result == TRUE) {
				$data = 'Сообщение успешно отправлено!';
				return $data;
			} else {
				$data = 'Ошибка базы данных. Обратитесь к администратору';
				return $data;
			}
	}

	public function showResponse()
	{
		$data = htmlspecialchars($this->checkMessage(), ENT_QUOTES);
		echo $data;
	}
}