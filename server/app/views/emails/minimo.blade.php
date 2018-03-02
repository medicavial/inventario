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
			<tr style="background-color: #FF8000; color: white;">

				<th colspan="5">
					<h2>&nbsp;&nbsp;ITEM EN MINIMO&nbsp;&nbsp;</h2>
				</th>
				<th style="background-color: white;" width="150">
					&nbsp;&nbsp;
					<img src="{{ $message->embed('http://medicavial.net/mvnuevo/imgs/logos/mv.jpg') }}" width="100" />
					&nbsp;&nbsp;
				</th>
			</tr>

          <tr style="background-color: #FBF8EF;">
            <td colspan="6" style="padding-left: 15px; padding-right: 15px;">
              <br>
              	<h2>{{ $saludo }}</h2>
              	<br><br>
              	El item <b>{{ $ITE_nombre }}</b> ha llegado al nivel minimo de existencias en la unidad <b>{{ $unidad }}</b>.
              	<br>
								El nivel mínimo es: {{ $minimo }}.
								<br>
              	La existencia actual del item es: {{ $existencias }}.
              	<br><br><br>
              	<div class="notas">
              		* Correo automático enviado por Sistema de Inventarios de Médica Vial.
              	</div>
              	<br>
            </td>
          </tr>
        </table>
	</body>
</html>
