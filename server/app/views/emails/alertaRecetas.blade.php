<!DOCTYPE html>

<?php
	$datetime = new DateTime();
	$hora = $datetime->format('H');
	if ($hora<3) $saludo="¡Buenas noches!";
    elseif ($hora>=3 && $hora<12) $saludo="¡Buenos días!";
    elseif ($hora>=12 && $hora<20) $saludo="¡Buenas tardes!";
	elseif ($hora>=20) $saludo="¡Buenas noches!";

	$fila = 0;
	$coloresTabla = ['#eceff1', '#cfd8dc'];
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
				padding: 0 15px 0 15px;
			}
			.tbl-principal{
				width: 90% !important;
			}
		</style>
	</head>
	<body>
        <table align="center" style="font-family: arial" class="tbl-principal">
			<tr style="background-color: #263238; color: white;">

				<th colspan="6">
					@if( sizeof( $datos ) == 1 )
						<h3>ALERTA DE RECETAS SIN SURTIR</h3>
						<h5>{{ $datos[0]['UNI_nombreCorto'] }} del 01/01/2019 al {{ date('d/m/Y') }}.</h5>
					@endif

					@if( sizeof( $datos ) > 1 && !$resumen )
						<h3>LISTADO DE RECETAS SIN SURTIR</h3>
						<h5>Todas las clínicas del 01/01/2019 al {{ date('d/m/Y') }}.</h5>
					@endif

					@if( sizeof( $datos ) > 1 && $resumen )
						<h3>RESUMEN DE RECETAS SIN SURTIR</h3>
						<h5>Todas las clínicas del 01/01/2019 al {{ date('d/m/Y') }}.</h5>
					@endif
				</th>
			</tr>

            <tr style="background-color: #eceff1;">
                <td colspan="6" style="padding-left: 15px; padding-right: 15px;">
                    <br>
                    <h3>{{ $saludo }}</h3>
					@if( sizeof( $datos ) == 1 )
                    	Han sido detectadas <strong>{{ $datos[0]['cantidadRecetas'] }}</strong> recetas sin surtir o surtidas parcialmente.
					@endif

					@if( sizeof( $datos ) > 1 && !$resumen )
						A continuación se muestra el listado de las recetas sin surtir o parcialmente surtidas en todas las clínicas.
					@endif

					@if( sizeof( $datos ) > 1 && $resumen )
						A continuación se muestra el resumen del acumulado de recetas sin surtir y el acumulado de items no surtidos por clínica.
					@endif
                    <br><br>
                </td>
            </tr>

			@if( sizeof( $datos ) > 1 )
				<tr style="background-color: #37474f; color: #fff">
					<td colspan="6" style="padding-left: 15px; padding-right: 15px; width: 40%; text-align: center">
						RESUMEN GENERAL
					</td>
				</tr>

				<tr style="background-color: #37474f; color: #fff">
					<td colspan="2" style="padding-left: 15px; padding-right: 15px; width: 40%; text-align: center">
						UNIDAD
					</td>

					<td colspan="2" style="padding-left: 15px; padding-right: 15px; width: 40%; text-align: center">
						RECETAS
					</td>

					<td colspan="2" style="padding-left: 15px; padding-right: 15px; width: 40%; text-align: center">
						ITEMS
					</td>
				</tr>

				@foreach( $datos as $dato )
					@if( sizeof( $dato['recetas'] ) > 0 )
					<?php 
						$itemsClinica = 0;
						for ($i=0; $i < sizeof( $dato['recetas'] ) ; $i++) { 
							$itemsClinica += $dato['recetas'][$i]['ITEMS_FALTANTES'];
						}
					?>

					<tr style="background-color: {{ $coloresTabla[1] }}">
						<td colspan="2" style="padding-left: 15px; padding-right: 15px;">
							{{ strtoupper( $dato['UNI_nombreCorto'] ) }}
						</td>

						<td colspan="2" style="padding-left: 15px; padding-right: 15px; text-align: right">
							{{ sizeof( $dato['recetas'] ) }} recetas
						</td>

						<td colspan="2" style="padding-left: 15px; padding-right: 15px; text-align: right">
							{{ $itemsClinica }} items
						</td>

					</tr>
					@endif
				@endforeach

				@if( !$resumen )
				<tr style="background-color: #eceff1;">
					<td colspan="6" style="padding-left: 15px; padding-right: 15px; width: 40%; text-align: center">
						<br><br>
					</td>
				</tr>
				@endif
			@endif


			@if( !$resumen )
			
			@foreach( $datos as $dato )
			<?php
				if ( sizeof( $dato['recetas'] ) > 0 ) {
				$colorNombre='#37474f';
				$modulo = $fila%2;
				$fila++;
				} elseif( sizeof( $dato['recetas'] ) == 0 ){
				$colorNombre='#01579b';
				}
			?>
			@if( sizeof( $datos ) > 1 )
				@if( sizeof( $dato['recetas'] ) > 0 )
				<tr style="background-color: {{ $colorNombre }}; color: #fff">
					<td colspan="6" style="padding-left: 15px; padding-right: 15px; width: 40%; text-align: center">
						{{ strtoupper( $dato['UNI_nombreCorto'] ) }} ({{ sizeof( $dato['recetas'] ) }} recetas)
					</td>
				</tr>

				<tr style="background-color: #37474f; color: #fff">
					<td colspan="2" style="padding-left: 15px; padding-right: 15px; width: 40%; text-align: center">
						DATOS RECETA
					</td>
					<td colspan="4" style="padding-left: 15px; padding-right: 15px; text-align: center">
						ITEMS SIN SURTIR
					</td>
				</tr>
				@endif <!-- if de cantidad de recetas -->
			@endif <!-- if para resumen general -->


				@foreach($dato['recetas'] as $receta)
				<tr style="background-color: {{ $coloresTabla[$modulo] }};">
					<td colspan="2" style="padding-left: 15px; padding-right: 15px; width: 40%">
						<strong>Receta #{{ $receta['RECETA'] }} <small>({{ $receta['TIPO_RECETA'] }})</small> </strong>
						<br>
						<small>Folio: {{ $receta['FOLIO'] }}</small>
						<br>
						<small>Fecha: {{ date( 'd/m/Y H:i', strtotime($receta['FECHA_RECETA']) ) }}</small>
					</td>
					<td colspan="4" style="padding-left: 15px; padding-right: 15px;">
						@foreach( $receta['ITEMS'] as $item )
						<small>
							<ul>
								<li>{{ $item['NS_cantidad'] }} {{ utf8_decode( $item['NS_descripcion'] ) }}</li>
							</ul>
						</small>
						@endforeach <!-- foreach de items -->
					</td>
				</tr>
				@endforeach <!-- foreach de recetas -->

				@if( sizeof( $dato['recetas'] ) > 0 && sizeof( $datos ) > 1 )
				<tr style="background-color: {{ $coloresTabla[0] }};">
					<td colspan="6"><br><br></td>
				</tr>
				@endif

			@endforeach <!-- foreach de clinicas -->
			@endif

			<tr style="background-color: #eceff1;">
				<td colspan="6">
					<div class="notas">
						* Correo automático enviado por Sistema de Inventarios de Médica Vial.
					</div>
				</td>
			</tr>
    	</table>

	</body>
</html>
