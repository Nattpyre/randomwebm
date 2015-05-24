<div class="container">
	<div class="row">
		<div class="col-md-6">
			<h1>Новые webm</h1>
			<?php 
				if($data['uploadscount']['COUNT(id)'] > 0) {
					require_once('newwebms.php');
				} else {
					echo '<div class="alert alert-warning">Новых webm нет!</div>';
				}
			 ?>
		</div>
		<div class="col-md-6">
			<h1>Новые сообщения</h1>
			<?php 
				if($data['messagescount']['COUNT(`read`)'] > 0) {
					require_once('newmessages.php');
				} else {
					echo '<div class="alert alert-warning">Новых сообщений нет!</div>';
				}
			 ?>
		</div>
	</div>
</div>
  </body>
</html>