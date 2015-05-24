<?php 
	if(isset($data['logincheck'])) {
		echo '<div class="alert alert-danger login-error">Логин и/или пароль введены неверно!</div>';
	}
?>
<div class="container">
		<div class="login-field">
			<form action="/admin/login" method="post">
			  <div class="form-group">
			    <label for="login">Логин:</label>
			    <input type="text" name="login" class="form-control" id="login">
			  </div>
			  <div class="form-group">
			    <label for="password">Пароль</label>
			    <input type="password" name="password" class="form-control" id="password">
			    <input type="hidden" name="token" value="<?php echo htmlspecialchars($data['token'], ENT_QUOTES); ?>" />
			  </div>
			  <button type="submit" name="auth" class="btn btn-default">Отправить</button>
			</form>
		</div>
	</div>
  </body>
</html>