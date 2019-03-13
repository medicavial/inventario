<!DOCTYPE html>

<?php
	$datetime = new DateTime();
	$hora = $datetime->format('H');
	if ($hora<3) $saludo="¡Buenas noches!";
    elseif ($hora>=3 && $hora<12) $saludo="¡Buenos días!";
    elseif ($hora>=12 && $hora<20) $saludo="¡Buenas tardes!";
	elseif ($hora>=20) $saludo="¡Buenas noches!";

	$fila = 0;
    $colores = ['encabezado' => '#b71c1c',
                'subtitulo'  => '#e53935',
                'contenido'  => '#ffebee',
                'tabla'      => '#ffcdd2'];
 ?>

<html lang="es-MX">
	<head>
		<meta charset="utf-8">

		<style>
        	.tbl-principal{
				width: 90% !important;
                font-family: Arial;
                margin: auto;
			}
            .encabezado{
                text-align: center;
                color: white;
                background-color: {{ $colores['encabezado'] }};
            }
            .subtitulo{
                text-align: center;
                color: white;
                background-color: {{ $colores['subtitulo'] }};
            }
            .contenido{
                background-color: {{ $colores['contenido'] }};
            }
            .tabla{
                background-color: {{ $colores['tabla'] }};
            }
			.notas{
				font-size: 11px;
				color: #555;
				font-style: italic;
				text-align: right;
                background-color: {{ $colores['contenido'] }};
			}
            td{
                padding: 0 5px 0 5px;
            }
		</style>
	</head>
	<body>
        <table class="tbl-principal">
			<tr class="encabezado">

				<th colspan="12">
                    <h3>LOTES PRÓXIMOS A CADUCAR</h3>
				</th>
			</tr>

            <tr class="contenido">
                <td colspan="12">
                    <br>
                    <h3>{{ $saludo }}</h3>
                    Se muestran los lotes que caducarán en los próximos {{ $dias }} días a partir del {{ date('d/m/Y') }}.
                    <br><br>
                </td>
            </tr>


            @foreach( $datos as $unidad )
            <tr class="subtitulo">
                <td colspan="12">{{ $unidad['unidad'] }}</td>
            </tr>
            <tr class="subtitulo">
                <td colspan="2">#</td>
                <td colspan="2">CÓDIGO</td>
                <td colspan="2">ITEM</td>
                <td colspan="2">LOTE</td>
                <td colspan="2">CADUCIDAD</td>
                <td colspan="2">ALMACÉN</td>
            </tr>

                @foreach( $unidad['datos'] as $lote )
                @if( $fila%2 == 0 )
                    <tr class="contenido">
                @else
                    <tr class="tabla">
                @endif
                        <td colspan="2" align="right">
                            <small>{{ $fila += 1 }}</small>
                        </td>

                        <td colspan="2">
                            <small>{{ $lote->ITE_codigo }}</small>
                        </td>

                        <td colspan="2">
                            <small>{{ $lote->ITE_nombre }}</small>
                        </td>

                        <td colspan="2" align="right">
                            <small>{{ $lote->LOT_numero }}</small>
                        </td>

                        <td colspan="2" align="right">
                            <small>{{ date( 'd/m/Y', strtotime( $lote->LOT_caducidad ) ) }}</small>
                        </td>

                        <td colspan="2">
                            <small>{{ $lote->ALM_nombre }}</small>
                        </td>
                    </tr>
                @endforeach
            @endforeach


			<tr class="notas">
				<td colspan="12">
					* Correo automático enviado por Sistema de Inventarios de Médica Vial.
				</td>
			</tr>
    	</table>

	</body>
</html>
