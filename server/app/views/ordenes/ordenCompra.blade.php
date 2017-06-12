<?php
	$date = date("Y-m-d H:i:s"); 
	$codigo= date_format(date_create($data['OCM_fechaReg']),'YmdHis')
?>
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
			font-size: 12px;
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

			<div>
				<?php echo DNS1D::getBarcodeHTML($codigo, "C39",1,40); ?>
			</div>
		</td>
		<td width="33%">
			<div align="right" class="fecha">
				Generada: <?php echo $data['OCM_fechaReg'] ?>
			</div>
			<div align="right" class="fecha">
				Impresión: <?php echo $date ?>
			</div>
		</td>
	</tr>
	</table>
	<table width="100%" border="0" align="center" bordercolor="#000000" id="principal">
		<tr>
			<td width="100%">
				<p align="right" class="titulo1">
					Orden de Compra No. {{ $data['OCM_clave'] }}
				</p>
			</td>
		</tr>
	</table>
 
<div class="linea"></div>
</div>

<br />
<table width="100%" border="0">
  <tr>
    <td width="10%">Proveedor:</td>
    <td width="90%">{{ $data['PRO_razonSocial'] }}</td>
  </tr>
  <tr>
    <td>Facturar a: </td>
    <!-- <td>MEDICAVIAL, SA DE CV, RFC: MED011012TD4 - Av. Álvaro Obreg&oacute;n, 151, Piso 9 Roma, Del. Cuauht&eacute;moc, M&eacute;xico,  M&eacute;xico DF Distrito Federal, 06700.</td> -->
    <td>MEDICAVIAL, SA DE CV, RFC: MED011012TD4 - Av. Álvaro Obreg&oacute;n 151, Piso 9 Roma, C.P.06700, Del. Cuauht&eacute;moc, M&eacute;xico,  CDMX.</td>
  </tr>
  <tr>
    <td>Entregar en: </td>
    <td>{{ $data['UNI_direccion'] }}.<br>Horarios de entrega: {{ $data['UNI_horaentrega'] }} </td>
  </tr>
</table>
<br />
<div class="linea"></div>
<br />
<!-- <table width="100%" border="0">
	<tr style="background: lightgray;">
		<th width="10%" bordercolor="#000000" scope="col">Clave</th>
		<th width="10%" scope="col">Cant.</th>
		<th width="50%" scope="col">Nombre</th>
		<th width="10%" scope="col">Costo</th>
		<th width="10%" scope="col">Desc.</th>
		<th width="10%" scope="col">Total</th>
	</tr>
	
	@foreach ($data['items'] as $key => $item)

		@if( $data['OCM_cerrada'] &&  $item['OIT_cantidadSurtida'] > 0 )
			<tr>
				
				<td><div align="center"> {{ $item['ITE_codigo'] }} </div></td>
				@if( $item['ITE_segmentable'] )
					<td><div align="center"> {{ round( $item['OIT_cantidadSurtida'] / $item['ITE_cantidadCaja'], 2 ) }} </div></td>
				@else
					<td><div align="center"> {{ $item['OIT_cantidadSurtida'] }} </div></td>
				@endif


				<td><div align="left"> {{ $item['ITE_nombre'] }} </div></td>

				@if( $item['ITE_segmentable'] )
					<td><div align="center"> {{ $item['OIT_precioEsperado'] * $item['ITE_cantidadCaja']  }} </div></td>
				@else
					<td><div align="center">$ {{ $item['OIT_precioEsperado'] }} </div></td>
				@endif
				
				<td><div align="center">  </div></td>

				<td><div align="center">$ {{ $item['OIT_cantidadPedida'] * $item['OIT_precioFinal']   }} </div></td>


			</tr>
		@elseif( $data['OCM_cerrada'] == 0)
			<tr>
				
				<td><div align="center"> {{ $item['ITE_codigo'] }} </div></td>
				@if( $item['ITE_segmentable'] )
					<td><div align="center"> {{ round( $item['OIT_cantidadPedida'] / $item['ITE_cantidadCaja'] , 2 ) }} </div></td>
				@else
					<td><div align="center"> {{ $item['OIT_cantidadPedida'] }} </div></td>
				@endif
				
				<td><div align="left"> {{ $item['ITE_nombre'] }} </div></td>
				@if( $item['ITE_segmentable'] )
					<td><div align="center"> {{ $item['OIT_precioEsperado'] * $item['ITE_cantidadCaja']  }} </div></td>
				@else
					<td><div align="center">$ {{ $item['OIT_precioEsperado'] }} </div></td>
				@endif
				<td><div align="center">  </div></td>

				<td><div align="center">$ {{  $item['OIT_cantidadPedida'] * $item['OIT_precioEsperado']  }} </div></td>
			</tr>
		@endif
    @endforeach


</table> -->

<table width="100%" border="0">
	<tr style="background: lightgray;">
		<th width="10%" bordercolor="#000000" scope="col">Clave</th>
		<th width="10%" scope="col">Cant.</th>
		<th width="50%" scope="col">Nombre</th>
		<th width="10%" scope="col">Costo</th>
		<th width="10%" scope="col">Desc.</th>
		<th width="10%" scope="col">Total</th>
	</tr>
	
	@foreach ($data['items'] as $key => $item)

		@if( $data['OCM_cerrada'] &&  $item['OIT_cantidadSurtida'] > 0 )
			<tr>
				
				<td><div align="center"> {{ $item['ITE_codigo'] }} </div></td>
				@if( $item['ITE_segmentable'] )
					<td><div align="center"> {{ round( $item['OIT_cantidadSurtida'] / $item['ITE_cantidadCaja'], 2 ) }} </div></td>
				@else
					<td><div align="center"> {{ $item['OIT_cantidadSurtida'] }} </div></td>
				@endif


				<td><div align="left"> {{ $item['ITE_nombre'] }} </div></td>

				@if( $item['ITE_segmentable'] )
					<td><div align="center">$ {{ $item['OIT_precioEsperado'] * $item['ITE_cantidadCaja']  }} </div></td>
				@else
					<td><div align="center">$ {{ $item['OIT_precioEsperado'] }} </div></td>
				@endif
				
				<td><div align="center">  </div></td>

				<td><div align="center">$ {{ $item['OIT_cantidadPedida'] * $item['OIT_precioFinal']   }} </div></td>


			</tr>
		@elseif( $data['OCM_cerrada'] == 0)
			<tr>
				
				<td><div align="center"> {{ $item['ITE_codigo'] }} </div></td>
				@if( $item['ITE_segmentable'] )
					<td><div align="center"> {{ round( $item['OIT_cantidadPedida'] / $item['ITE_cantidadCaja'] , 2 ) }} </div></td>
				@else
					<td><div align="center"> {{ $item['OIT_cantidadPedida'] }} </div></td>
				@endif
				
				<td><div align="left"> {{ $item['ITE_nombre'] }} </div></td>
				@if( $item['ITE_segmentable'] )
					<td><div align="center">$ {{ $item['OIT_precioEsperado'] * $item['ITE_cantidadCaja']  }} </div></td>
				@else
					<td><div align="center">$ {{ $item['OIT_precioEsperado'] }} </div></td>
				@endif
				<td><div align="center">  </div></td>

				<td><div align="center">$ {{  $item['OIT_cantidadPedida'] * $item['OIT_precioEsperado']  }} </div></td>
			</tr>
		@endif
    @endforeach


</table>
<br />
<div class="linea"></div>

<br>
@if( $data['OCM_importeFinal'] > 0 )
	<div align="right" class="Estilo1">Total: ${{ $data['OCM_importeFinal'] }} </div>
@else
	<div align="right" class="Estilo1">Total: ${{ $data['OCM_importeEsperado'] }} </div>
@endif


<div class="footer">
	<div class="linea"></div>
	<!-- <div class="text-left more">{{ $data['OCM_fechaReg'] }} - Tel. 55-14-47-00 - Responsable: {{ $data['UNI_responsable'] }}</div> -->
	<div class="text-left more">Tel. 55-14-47-00 - Responsable: {{ $data['UNI_responsable'] }}</div>
	<div align="right" class="more"> Pagina <span class="pagenum"></span> </div>
</div>


</body>
</html>