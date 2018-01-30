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
			<tr style="background-color: #9c27b0; color: white;">

				<th colspan="5">
					<h2>&nbsp;&nbsp;Lote Actualizado&nbsp;&nbsp;</h2>
				</th>
				<th style="background-color: white;" width="150">
					&nbsp;&nbsp;
					<img src="{{ $message->embed('http://medicavial.net/mvnuevo/imgs/logos/mv.jpg') }}" width="100" />
					&nbsp;&nbsp;
				</th>
			</tr>

      <tr style="background-color: #f3e5f5;">
        <td colspan="6" style="padding-left: 15px; padding-right: 15px;">
          <br>
          	<h2>{{ $saludo }}</h2>
          	<br><br>
          	Ha sido actualizado el lote # <b>{{ $lote }}</b> con identificador {{ $loteId }} correspondiente al item {{ $item }} en el almacén {{ $almacen }}.
          	<br>
          	Los datos de la actualización son:
          	<br>
        </td>
      </tr>
			<tr style="background-color: #f3e5f5;">
				<td colspan="2" style="padding-left: 15px; padding-right: 15px;" align="center">
					&nbsp;
				</td>
				<td colspan="2" style="padding-left: 15px; padding-right: 15px;" align="center">
					<b>Origen</b>
				</td>
				<td colspan="2" style="padding-left: 15px; padding-right: 15px;" align="center">
					<b>Actualización</b>
				</td>
			</tr>
			<tr style="background-color: #f3e5f5;">
				<td colspan="2" style="padding-left: 15px; padding-right: 15px;" align="center">
					<b>Caducidad:</b>
				</td>
				<td colspan="2" style="padding-left: 15px; padding-right: 15px;" align="center">
					{{ $caducidad0 }}
				</td>
				<td colspan="2" style="padding-left: 15px; padding-right: 15px;" align="center">
					{{ $caducidad1 }}
				</td>
			</tr>
			<tr style="background-color: #f3e5f5;">
				<td colspan="2" style="padding-left: 15px; padding-right: 15px;" align="center">
					<b>Cantidad:</b>
				</td>
				<td colspan="2" style="padding-left: 15px; padding-right: 15px;" align="center">
					{{ $cantidad0 }}
				</td>
				<td colspan="2" style="padding-left: 15px; padding-right: 15px;" align="center">
					{{ $cantidad1 }}
				</td>
			</tr>
			<tr style="background-color: #f3e5f5;">
				<td colspan="6">
					<b>Observaciones:</b> {{ $observaciones }}
				</td>
			</tr>
			<tr style="background-color: #f3e5f5;">
				<td colspan="6">
					<div class="notas">
						Actualización realizada por el usuario: {{ $usuario }} el {{ $fecha }}.
					</div>
				</td>
			</tr>
			<tr style="background-color: #f3e5f5;">
				<td colspan="6">
					<div class="notas">
						* Correo automático enviado por Sistema de Inventarios de Médica Vial.
					</div>
				</td>
			</tr>
    </table>
	</body>
</html>
