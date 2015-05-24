<div class="new-webms">
	<div class="embed-responsive embed-responsive-16by9">
		<video controls="controls" tabindex="0">
			<source src="../uploads/<?php echo htmlspecialchars($data['newwebm']['name'], ENT_QUOTES); ?>" type='video/webm; codecs="vp8, vorbis"' />
		</video>
	</div>
	<div class="source-field">
		<form class="form-horizontal" method="post" action="/admin/actionWebm" role="form">
			<div class="form-group">
				<label class="control-label"></label>
				<div class="col-md-12">
					<input type="hidden" name="webmID" value="<?php echo htmlspecialchars($data['newwebm']['id'], ENT_QUOTES); ?>">
					<input type="hidden" name="webmName" value="<?php echo htmlspecialchars($data['newwebm']['name'], ENT_QUOTES); ?>">
					<textarea class="form-control" name="webmSource" rows="3"><?php echo htmlspecialchars($data['newwebm']['source'], ENT_QUOTES); ?></textarea>
				</div>
			</div>
			<div class="form-group">
				<div class="col-md-12">
					<button type="submit" name="actionWebms" value="Add" class="btn btn-success add-webm">Добавить</button>
					<button type="submit" name="actionWebms" value="Delete" class="btn btn-danger delete">Удалить</button>
				</div>
			</div>
		</form>
	</div>
</div>