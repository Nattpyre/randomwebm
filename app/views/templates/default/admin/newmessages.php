<div class="new-messages">

	<div class="panel"><?php echo htmlspecialchars($data['newmessage']['name'], ENT_QUOTES); ?></div>
	<div class="panel"><?php echo htmlspecialchars($data['newmessage']['email'], ENT_QUOTES); ?></div>
	<div class="panel"><?php echo htmlspecialchars($data['newmessage']['subject'], ENT_QUOTES); ?></div>
	<form class="form-horizontal" method="post" action="/admin/actionMessage" role="form">
		<div class="form-group">
			<label class="control-label"></label>
			<div class="col-md-12">
				<input type="hidden" name="messageID" value="<?php echo htmlspecialchars($data['newmessage']['id'], ENT_QUOTES); ?>">
				<input type="hidden" name="messageName" value="<?php echo htmlspecialchars($data['newmessage']['name'], ENT_QUOTES); ?>">
				<input type="hidden" name="messageEmail" value="<?php echo htmlspecialchars($data['newmessage']['email'], ENT_QUOTES); ?>">
				<input type="hidden" name="messageSubject" value="<?php echo htmlspecialchars($data['newmessage']['subject'], ENT_QUOTES); ?>">
				<textarea class="form-control message-field" name="message" rows="11" readonly><?php echo htmlspecialchars($data['newmessage']['message'], ENT_QUOTES); ?></textarea>
			</div>
		</div>
		<div class="form-group">
			<div class="col-md-12">
				<button type="submit" name="actionMessages" value="Read" class="btn btn-info read-message">Прочитано</button>
				<button type="submit" name="actionMessages" value="Delete" class="btn btn-danger delete">Удалить</button>
			</div>
		</div>
	</form>
</div>