<!DOCTYPE html>

<?php
	// $orden = Input::get('orden');
	// $comentario = Input::get('comentarios');  
	$orden = 1234;
	$comentario = 'qwerty';  
?>

<html lang="en-US">
	<head>
		<meta charset="utf-8">
	</head>
	<body>
		<h2>Orden de compra <?php echo ($orden); ?></h2>

		<div>
			<?php echo ($comentario); ?>
		</div>
	</body>
</html>
