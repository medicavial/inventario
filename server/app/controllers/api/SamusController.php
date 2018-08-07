<?php

class SamusController extends BaseController {
	public function pruebaSamus($id){
		$datosReceta = DB::connection('mv')
											 ->table('RecetaMedica')
											 ->select('RecetaMedica.*', 'TIR_nombre', 'RecetaMedica.Exp_folio', 'Expediente.Exp_completo', 'Expediente.Uni_ClaveActual',
																'uniPaciente.Uni_nombrecorto as uniPaciente', 'uniReceta.Uni_nombrecorto as uniReceta', 'Usu_nombre',
																DB::raw( 'IF( ( RM_fecreg + INTERVAL 30 MINUTE < now() ), 1, 0 ) as tardio,
																					CONCAT(RM_fecreg + INTERVAL 3 HOUR) as vigencia,
																					IF(NOW() > RM_fecreg + INTERVAL 3 Hour, 0, 1) as vigente,
																					IF( TIMEDIFF( now(), RM_fecreg + INTERVAL 3 Hour ) < 0, 0, TIMEDIFF( now(), RM_fecreg + INTERVAL 3 Hour ) ) as diferenciaTiempo' )
																)
											 ->join('TipoReceta', 'RecetaMedica.tipo_receta', '=', 'TipoReceta.TIR_id')
											 ->join('Expediente', 'RecetaMedica.Exp_folio', '=', 'Expediente.Exp_folio')
											 ->join('Usuario', 'RecetaMedica.Usu_login', '=', 'Usuario.Usu_login')
											 ->join('Unidad as uniPaciente', 'Expediente.Uni_ClaveActual', '=', 'uniPaciente.Uni_clave')
											 ->join('Unidad as uniReceta', 'RecetaMedica.Uni_clave', '=', 'uniReceta.Uni_clave')
											 ->where('id_receta', $id)
											 ->get();

		// obtenemos los datos de los items recetados
		$datosItems = Suministros::where('id_receta',$id)->where('NS_surtida',0)->where('NS_cancelado',0)->get();

		// preparamos el array de items
		$items = array();

		//recorremos item por item de la receta para obtener los datos del item en inventario
		foreach ($datosItems as $dato) {
			$item = $dato['id_item'];
			//buscamos el item y con esto decimos si SERA EDITABLE EN CASO DE SER ORTESIS
			$valoresItem 				= Item::find($item);
			$modificable 				= $valoresItem->ITE_talla;
			$familia 						= $valoresItem->TIT_clave;
			$segmentable 				= $valoresItem->ITE_segmentable;
			$segmentableReceta	= $valoresItem->ITE_noSegmentableReceta;
			$caja 							= $valoresItem->ITE_cantidadCaja;
			$forzoso 						= TipoItem::find($familia)->TIT_forzoso;

			if ($segmentable == 1 && $segmentableReceta == 0) {
				$cantidad = $dato['NS_cantidad'] * $caja;
			}else{
				$cantidad = $dato['NS_cantidad'];
			}

			$items[] = array(
				'receta' 			=> $id,
				'recetaItem' 	=> $dato['NS_id'],
				'item' 				=> $item,
				'forzoso' 		=> $forzoso,
				'familia' 		=> $familia,
				'cantidad' 		=> $cantidad,
				'caja' 				=> 0,
				'editable' 		=> $modificable,
				'existencia'	=> $dato['id_existencia'],
				'reserva' 		=> $dato['id_reserva'],
				'almacen' 		=> $dato['id_almacen'],
				'surtido' 		=> false,
				'lote' 				=> ''
			);
		}

		$uniInventario = Unidad::where('UNI_claveMV', $datosReceta[0]->Uni_ClaveActual)->get();

		if ( sizeof($uniInventario) > 0 ) {
			$claveUnidad = $uniInventario[0]->UNI_clave;
			$nombreUnidad = $uniInventario[0]->UNI_nombrecorto;;
		} else{
			$claveUnidad = -1;
			$nombreUnidad = $datosReceta[0]->uniPaciente;
		}

		// mandamos la diferecia de tiempo entendible
		$difTiempo=null;
		if ( strlen($datosReceta[0]->diferenciaTiempo > 1) ) {
			if ( intval( substr($datosReceta[0]->diferenciaTiempo, 0, 2) ) < 24 ) {
				$difTiempo = intval( substr($datosReceta[0]->diferenciaTiempo, 3, 2) ). ' minutos';
			}elseif( intval( substr($datosReceta[0]->diferenciaTiempo, 0, 2) ) > 23 ){
				$difTiempo = bcdiv(intval(substr($datosReceta[0]->diferenciaTiempo, 0, 2)) / 24, '1', 0).' día(s)';
			}
		}

		$uniReceta[]	= array('nombre' => $datosReceta[0]->uniReceta, 'clave' => $datosReceta[0]->Uni_clave);
		$uniActual[]	= array('nombre' => $datosReceta[0]->uniPaciente, 'clave' => $datosReceta[0]->Uni_ClaveActual);

		$respuesta = array(
			'receta' 		=> $datosReceta[0]->id_receta,
			'fecha' 		=> $datosReceta[0]->RM_fecreg,
			'tardio' 		=> $datosReceta[0]->tardio,
			'limite'		=> $datosReceta[0]->vigencia,
			'vigente'		=> $datosReceta[0]->vigente,
			'tiempo'		=> $difTiempo,
			'folio' 		=> $datosReceta[0]->Exp_folio,
			'tipo' 			=> $datosReceta[0]->TIR_nombre,
			'lesionado' => $datosReceta[0]->Exp_completo,
			'unidad' 		=> $claveUnidad,
			'uniNombre' => strtoupper($nombreUnidad),
			'usuario' 	=> $datosReceta[0]->Usu_nombre,
			'uniReceta'	=> $uniReceta,
			'uniActual'	=> $uniActual,
			'items' 		=> $items
		);

		return $respuesta;
	}
}
