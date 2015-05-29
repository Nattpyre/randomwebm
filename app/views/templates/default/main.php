<div class="row">
<?php print_r($data); ?>
	<div id="main_page">
		<div id="webm">
		<?php
		$data = new WebmMapper;
		$data = $data->getRandomWebm(); 
		?>
			<div class="embed-responsive embed-responsive-16by9">
				<video class="video" autoplay="autoplay" loop="loop" controls="controls" tabindex="0">
					<source src="../webms/<?php echo htmlspecialchars($data['name'], ENT_QUOTES); ?>" type='video/webm; codecs="vp8, vorbis"' /></video>
				<video class="static" src="../webms/static.webm"></video>
			</div>
			<div class="col-sm-8 hidden-xs panel panel-success source">
				<div class="panel-heading">
					<h1 class="panel-title">Source</h1>
				</div>
				<div class="panel-body">
					<?php 
						if(mb_strlen($data['source']) > 0) {
							$data['source']	= htmlspecialchars($data['source'], ENT_QUOTES);
							$data['source'] = preg_replace("/(^|[\n ])([\w]*?)((ht|f)tp(s)?:\/\/[\w]+[^ \,\"\n\r\t<]*)/is", "$1$2<a href=\"$3\" target=\"_blank\">$3</a>", $data['source']);
							echo $data['source'];
						} else {
							echo 'Источник не указан.';
						}
					?>
				</div>
			</div>
		</div>
		<div class="col-sm-3 col-sm-offset-1 col-xs-12 col-xs-offset-0">
			<button class="play" onclick="RandomWebm()">
				<img src="../images/play.png">
				<span class="hidden-sm">Play</span>
			</button>
		</div>
	</div>
</div>