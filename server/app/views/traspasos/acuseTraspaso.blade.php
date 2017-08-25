<!doctype html>
<html lang="es">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<style>
		@import url(//fonts.googleapis.com/css?family=Lato:700);
		body{
			padding:0 5px;
			font-size: 18px;
		}
		table{
			font-size: 10px;
			font-family:'Lato', sans-serif;
		    border-collapse: collapse;
		    border: 1px solid black;
		}
		.fecha{
			font-size: 12px;
		}
		.titulo1{
			font-size: 20px;
			font-family:'Lato', sans-serif;
		}

		.linea{
			border-bottom:2px solid rgba(0, 130, 203,1);
		}
		
		.text-center{
		    text-align: center;	
		}

		.text-left{
		    text-align: left;	
		}

		.center{
			margin: 0 auto;
		}
		
		.more{
			font-size: 12px;
		}

		.header,
		.footer {
		    width: 100%;
		    position: fixed;
		}
		.header {
		    top: 0px;
		}
		.footer {
		    bottom: 0px;
		    height: auto;
		}
		.pagenum:before {
		    content: counter(page);
		}
		.headerTbl{
			background-color: #00bfa5;
			/*background-color: #0082C9;*/
			color: #fff;
			font-variant: small-caps;
			text-align: center;
			font-size: 14px;
			height: 20px;
		}
		.filasTbl{
			background-color: #eceff1;
		}
		.espacio{
			margin-top: 2em;
		}
		.firma{
			font-size: 12px;
			font-family:'Lato', sans-serif;
		}

	</style>
</head>
<body>
<div align="left">
	<table width="100%" border="0">
	<tr>
		<td width="33%">
			<img src="img/logomv.png" width="140" alt="logo"/>
		</td>
		<td width="33%" align="center">

		</td>
		<td width="33%">
			<div align="right" class="fecha">
				Generado: <?php echo $data[0]['created_at'] ?>
			</div>
			<div align="right" class="fecha">
			</div>
		</td>
	</tr>
	</table>
	<table width="100%" border="0" align="center" bordercolor="#000000" id="principal">
		<tr>
			<td width="100%">
				<p align="right" class="titulo1">
					Acuse de traspaso # <?php echo $data[0]['TRA_id'] ?>
				</p>
			</td>
		</tr>
	</table>
 
<div class="linea"></div>
</div>

<div class="espacio"></div>

<table width="100%" border="0">
	<tr class="headerTbl">
		<th width="5%">#</th>
		<th width="20%">Item</th>
		<th width="15%">Lote</th>
		<th width="10%">Cantidad</th>
		<th width="50%">Origen - Destino</th>
	</tr>

	<?php 
		$i=0;
		foreach ($data as $traspaso) {
			$i++;
	 ?>
	<tr class="filasTbl">
		<td align="center"><?php echo $i ?></td>
		<td><?php echo $traspaso['ITE_nombre'] ?></td>
		<td align="right"><?php echo $traspaso['LOT_numero'] ?></td>
		<td align="center"><?php echo $traspaso['MOV_cantidad'] ?></td>
		<td><?php echo substr( $traspaso['MOV_observaciones'] , 24 ) ?></td>
	</tr>
	<?php   
		}
	?>
</table>

<br><br><br><br><br>

<div align="center" class="firma">
	<hr align="center" width="30%">
	<?php echo $data[0]['USU_nombrecompleto'] ?>
</div>

<div class="footer">

	<div align="center" class="more"> Pagina <span class="pagenum"></span> </div>
</div>


</body>
</html>