<!DOCTYPE html>

<?php 
	$datetime = new DateTime();
	$hora = $datetime->format('H');
	if ($hora<3) {
	  $saludo="¡Muy buenas noches!";
	} elseif ($hora>=3 && $hora<12) {
	  $saludo="¡Muy buenos días!";
	} elseif ($hora>=12 && $hora<20) {
	  $saludo="¡Muy buenas tardes!";
	} elseif ($hora>=20) {
	  $saludo="¡Muy buenas noches!";
	};
 ?>

<html lang="es-MX">
	<head>
		<meta charset="utf-8">

		<style>
			.notas{
				font-size: 11px;
				color: #555;
				font-style: italic;
				text-align: right;
			}
		</style>
	</head>
	<body>
        <table align="center" style="font-family: arial" width="90%">
			<tr style="background-color: #0082ca; color: white;">
				<th style="background-color: white;" width="150">
					&nbsp;&nbsp;
					<img src="{{ $message->embed('http://medicavial.net/mvnuevo/imgs/logos/mv.jpg') }}" width="100" />
					&nbsp;&nbsp;
				</th>
				<th colspan="4">
					<h2>&nbsp;&nbsp;ORDEN DE COMPRA {{ $numOrden }}&nbsp;&nbsp;</h2>
				</th>
				<th>&nbsp;&nbsp;{{ $unidad }}&nbsp;&nbsp;</th>
			</tr>

          <tr style="background-color: #DFF4F7;">
            <td colspan="6" style="padding-left: 15px; padding-right: 15px;">
              <br>
              	<h2>{{ $saludo }}</h2>
              	<br><br>
              	<h4>{{ $datosProv->PRO_nombrecorto }}:</h4>
              	<br>
              	Se anexa orden de compra en formato PDF con los detalles de la solicitud correspondiente al numero {{ $numOrden }} por la cantidad de ${{ number_format( $datosOrden->OCM_importeEsperado, 2, '.', ',' ) }}.
              	<br>
              	Por favor confirme la recepción de éste correo.
              	<br><br><br>
              	<div class="notas">
              		* Correo automático enviado por Sistema de Inventarios de Médica Vial el {{ $datosOrden->OCM_fechaReg }}
              	</div>
              	<br>
            </td>
          </tr>
        </table>
	</body>
</html>
