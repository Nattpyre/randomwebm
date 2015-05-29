<div class="row">
	<div id="add_webm">
		<h1>Добавить Webm</h1>
		<div class="row">
			<div class="col-md-6">
				<p>
					Вы можете добавить webm и если она пройдет проверку, то попадет в общую базу.
				</p>
				<p>Запрещено добавлять:</p>
				<ul>
					<li>Порно</li>
					<li>Скримеры</li>
					<li>Шок-контент</li>
					<li>Аниме</li>
					<li>Бурятских шлюх</li>
					<li>Политику</li>
				</ul>
				<form id="webm-upload">
					<div class="form-group new-button">
						<div class="input-group">
							<span class="input-group-btn">
								<span class="btn btn-success btn-file"> <i class="glyphicon glyphicon-folder-open"></i>
									<input type="hidden" name="MAX_FILE_SIZE" value="8388608">
									Обзор...
									<input type="file" name="webmUpload" accept="video/webm" required>
								</span>
							</span>
							<input type="text" class="form-control" readonly>
						</div>
						<span class="help-block">Максимальный размер файла: 8 МБ.</span>
					</div>
					<div class="form-group">
						<label class="control-label"></label>
						<textarea class="form-control" name="source" rows="3" placeholder="Укажите источник видео..." data-fv-stringlength data-fv-stringlength-max="128" data-fv-stringlength-message="Количество символов превышает максимум (128)."></textarea>
					</div>
					<div class="form-group">
						<button type="submit" class="btn btn-success"> <i class="glyphicon glyphicon-floppy-open"></i>
							Загрузить
						</button>
					</div>
					<div class="form-group">
						<progress class="upload-progress" value="0" max="100"></progress>
					</div>
					<div class="webm-result alert"></div>
				</form>
			</div>
			<div class="col-md-6">
				<img class="img-responsive center-block" src="images/forbidden.jpg">
			</div>
		</div>
	</div>
</div>