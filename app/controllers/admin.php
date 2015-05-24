<?php

class Admin extends Controller
{
	public $webmMapper;
	public $messageMapper;

	public function __construct()
	{
		include (SITE_PATH . DS . 'app' . DS . 'models' . DS . 'webm.php');
        include (SITE_PATH . DS . 'app' . DS . 'models' . DS . 'message.php');
        include (SITE_PATH . DS . 'app' . DS . 'models' . DS . 'webmmapper.php');
        include (SITE_PATH . DS . 'app' . DS . 'models' . DS . 'messagemapper.php');

        $this->webmMapper = new WebmMapper;
		$this->messageMapper = new MessageMapper;
		$this->view = new View;
	}

    function Index()
    {	
    	session_start();

        if(!isset($_SESSION['admin'])) {
			header("Location: /admin/login");
			die();
		} 

		$data['webmscount'] = $this->webmMapper->countWebms();
		$data['uploadscount'] = $this->webmMapper->countUploads();
		$data['newwebm'] = $this->webmMapper->getNewWebm();
		$data['messagescount'] = $this->messageMapper->countMessages();
		$data['newmessage'] = $this->messageMapper->getNewMessage();

		$this->view->generate('admin/main.php', 'admin/template.php', $data);
    }

    public function Login()
    {
    	include (SITE_PATH . DS . 'app' . DS . 'models' . DS . 'login.php');

    	if(!isset($_COOKIE['token'])) {
    		$token = mt_rand(0, 999999999);
    		setcookie("token", $token, time()+60*60*24, "", "", false, true);
    		$data['token'] = $token;
    	} else {
    		$token = $_COOKIE['token'];
    		setcookie("token", $token, time()+60*60*24, "", "", false, true);
    		$data['token'] = $token;
    	}

    	$loginCheck = new Login;

    	if(isset($_POST['login']) && isset($_POST['password']) && isset($_POST['token'])) {
    		if(!empty($_COOKIE['token']) && !empty($_POST['token']) && $_POST['token'] == $_COOKIE['token']) {
    			$hash = md5($_POST['login'].';'.($_POST['password']));
				$exist_user = $loginCheck->logIn($hash);
				if($exist_user->num_rows > 0) {
					session_start();
					$_SESSION['admin'] = $_POST['login'];
					header("Location: /admin");
					die();
				} else {
					$data['logincheck'] = FALSE;
				}
    		}
		}

    	$data['webmscount'] = $this->webmMapper->countWebms();
    	$this->view->generate('admin/login.php', 'admin/template.php', $data);
    }

    public function Logout()
    {
    	session_start();
    	session_destroy();
		header("Location: /admin/login");
		die();
    }

    public function actionWebm () 
    {
    	if($_POST['actionWebms'] == 'Add') {
			if(rename(SITE_PATH . 'uploads' . DS . $_POST['webmName'],  SITE_PATH . 'webms' . DS . $_POST['webmName'])) {
				$id = $_POST['webmID'];
				$name = $_POST['webmName'];
				$source = $_POST['webmSource'];
				$this->webmMapper->moveToMainBase($name, $source);
				$this->webmMapper->deleteWebm($id);
				header("Location: /admin");
			}
		} elseif($_POST['actionWebms'] == 'Delete') {
			if(unlink(SITE_PATH . 'uploads' . DS . $_POST['webmName'])) {
				$this->webmMapper->deleteWebm($id);
				header("Location: /admin");
			}
		}
    }

    public function actionMessage ()
    {
    	if($_POST['actionMessages'] == 'Read') {
				$id = $_POST['messageID'];
				$this->messageMapper->readMessage($id);
				header("Location: /admin");
			} elseif($_POST['actionMessages'] == 'Delete') {
				$id = $_POST['messageID'];
				$this->messageMapper->deleteMessage($id);
				header("Location: /admin");
			}
    }  	
}