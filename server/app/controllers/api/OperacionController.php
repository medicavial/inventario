<?php

class OperacionController extends BaseController {


	public function actualizaConfiguracion($id){

		$configuracion = Configuracion::find($id);

		$configuracion->UNI_clave = Input::get('unidad');
		$configuracion->ITE_clave = Input::get('item');
		$configuracion->CON_nivelMinimo = Input::get('minimo');
		$configuracion->CON_nivelMaximo = Input::get('maxima');
		$configuracion->CON_nivelCompra = Input::get('compra');

		// if (Input::has('correos')) {
		// 	$configuracion->CON_correos = implode("," , Input::get('correos'));
		// }

		$configuracion->save();

		return Response::json(array('respuesta' => 'Configuración Actualizada Correctamente'));

	}

	public function cancelarItem($usuario){

		$claveExistencia = Input::get('existencia');
		$claveReserva = Input::get('reserva');
		$recetaItem = Input::get('recetaItem');

		//actualizamos en la tabla mv el item cancelado
		$recetaMV = Suministros::find($recetaItem);
		$recetaMV->NS_cancelado = 1;
		$recetaMV->NS_fecCancelado = date('Y-m-d H:i');
		$recetaMV->NS_usuCancel = $usuario;
		$recetaMV->save();

		//eliminamos reserva
		$reserva = Reserva::find($claveReserva);
		$reserva->delete();

		return Response::json(array('respuesta' => 'Item Cancelado Correctamente'));

	}

	public function cancelarOrden(){

		$orden = Input::get('orden');
		$usuario = Input::get('usuario');
		$motivo = Input::get('motivo');

		$orden = OrdenCompra::find($orden);

		$orden->OCM_cancelada = 1;
		$orden->OCM_fechaCancelacion =  date('Y-m-d H:i:s');
		$orden->USU_cancelo = $usuario;
		$orden->OCM_motivo = $motivo;
		$orden->save();

		return Response::json(array('respuesta' => 'Orden Cancelada Correctamente'));

	}

	public function cerrarOrden(){

		$orden = Input::get('orden');
		$usuario = Input::get('usuario');

		$orden = OrdenCompra::find($orden);

		$orden->OCM_cerrada = 1;
		$orden->OCM_fechaCerrada =  date('Y-m-d H:i:s');
		$orden->USU_cerro = $usuario;
		$orden->save();

		return Response::json(array('respuesta' => 'Orden Cerrada Correctamente'));

	}


	//funcion que ayuda a completar lo faltate de la orden de compra
	public function completaOrden(){

		$cveOrden = Input::get('orden');
		$items = Input::get('items');
		$unidad = Input::get('unidad');
		$usuario = Input::get('usuario');
		$precioFinal = Input::get('precioFinal');

		//obtenemos el almacen principal de esa unidad
		$resultado = Almacen::where('UNI_clave',$unidad)->where('TAL_clave',1)->first();
		$almacen = $resultado->ALM_clave;
		//buscamos la orden
		$orden = OrdenCompra::find($cveOrden);

		// recorremos item por item
		foreach ($items as $item) {

			//clave del item de esta orden
			$claveOrdenitem = $item['OIT_clave'];


			if (isset($item['cantidadSurtida'])) {
				//aqui se añadio o no cantidad diferente a la solicitada
				//se manda lo que se envio
				$cantidad = $item['cantidadSurtida'];
				//se agrega la cantidad surtida mas lo que se acompleto para la receta
				$surtida = $item['OIT_cantidadSurtida'] + $cantidad;
			}else{
				//la cantidad que se acompleto debe de ser la misma que falto por eso la resta
				$cantidad = $item['OIT_cantidadPedida'] - $item['OIT_cantidadSurtida'];
				$surtida = $item['OIT_cantidadPedida'];
			}

			$claveItem = $item['ITE_clave'];

			//acompletamos la orden del item
			$datoItem = OrdenItem::find($claveOrdenitem);
			$datoItem->OIT_cantidadSurtida = $surtida;
			$datoItem->save();

			// se obtienen los datos del item si es forzoso el lote y los lotes
			$lotes = isset($item['lotes']) ? $item['lotes'] : array();
			$loteForzoso = $item['TIT_forzoso'];

			helpers::surteItem($claveItem,$cantidad,$almacen,$cveOrden,$usuario,'Se Completó Orden',$loteForzoso,$lotes);

		}

		$orden->OCM_cerrada = 1;
		$orden->OCM_fechaCerrada =  date('Y-m-d H:i:s');
		$orden->USU_cerro = $usuario;
		$orden->OCM_importeFinal = $precioFinal;
		$orden->save();

		return Response::json(array('respuesta' => 'Orden Completada Correctamente'));


	}

	public function configuraciones(){

		$configuracion = new Configuracion;

		$configuracion->UNI_clave = Input::get('unidad');
		$configuracion->ITE_clave = Input::get('item');
		$configuracion->CON_nivelMinimo = Input::get('minimo');
		$configuracion->CON_nivelMaximo = Input::get('maxima');
		$configuracion->CON_nivelCompra = Input::get('compra');

		// if (Input::has('correos')) {
		// 	$configuracion->CON_correos = implode("," , Input::get('correos'));
		// }

		$configuracion->save();

		return Response::json(array('respuesta' => 'Configuración Registrada Correctamente'));

	}


	//muestra los datos de existencia con la unidad
	public function configuracionUnidad($unidad){
		return Item::activos();
	}

	public function eliminaUsuarioAlmacen($almacen,$usuario){
		UsuarioAlmacen::where('USU_clave',$usuario)->where('ALM_clave',$almacen)->delete();
		return Response::json(array('respuesta' => 'Almacen removido Correctamente'));

	}

	public function eliminaReserva($id){

		$reserva = Reserva::find($id);
		$reserva->delete();

		return Response::json(array('respuesta' => 'Reserva removida Correctamente'));

	}

	public function enviaCorreo(){

     	$datos = Input::all();
     	$comentario = Input::get('comentarios');

        Mail::send('emails.correo', array('key' => $datos), function($message) use ($datos)
        {

        	$ordeCompra = $datos['orden'];
        	$correo = $datos['correo'];
        	$copias = $datos['copias'];
        	$asunto = $datos['asunto'];

        	$clave = OrdenCompra::find($ordeCompra)->UNI_clave;
        	$nombreUnidad = Unidad::find($clave)->UNI_nombrecorto;

            $message->from('sistemasrep2@medicavial.com.mx', 'Sistema de Inventario MédicaVial');
            foreach ($copias as $copia) {
            	$message->cc($copia);
            }

            $message->subject($asunto);
            $message->to($correo);


            $archivo =  public_path().'/ordenesCompra/'.$ordeCompra.'.pdf';

            // $pdf = helpers::ordenPDF($ordeCompra);
            // $pdf->save($archivo);

            $message->attach($archivo);

        });

        return Response::json(array('respuesta' => 'Correo enviado Correctamente'));

	}

	// funcion que ayuda a mandar correo al proveedor de la orden creada
	public function enviaCorreoOrden($idOrden){
		$orden 			= OrdenCompra::find($idOrden);
    	$nombreUnidad 	= Unidad::find($orden['UNI_clave'])->UNI_nombrecorto;
    	$datosProv 		= Proveedor::find($orden['PRO_clave']);

    	//estos datos se van a enviar a la vista
    	$datos = array( 'numOrden' 		=> $idOrden,
    					'unidad' 		=> $nombreUnidad,
    					'datosOrden' 	=> $orden,
    					'datosProv' 	=> $datosProv,
    					);

    	//preparamos el correo
		Mail::send('emails.orden', $datos, function($message) use ($datos)
		{
    		$archivo=public_path().'/ordenesCompra/'.$datos['numOrden'].'.pdf';

			$message->from('mvcompras@medicavial.com.mx', 'Médica Vial');
		    $message->to($datos['datosProv']->PRO_correo1, $datos['datosProv']->PRO_nombre)->subject('Orden de Compra '.$datos['numOrden']);

		    if ($datos['datosProv']->PRO_correo2 != '') {
				$message->cc(array('auxcompras@medicavial.com.mx', $datos['datosProv']->PRO_correo2));
		    } else{
				$message->cc('auxcompras@medicavial.com.mx');
		    }

    		$message->bcc(array('alozano@medicavial.com.mx','mvcompras@medicavial.com.mx','sramirez@medicavial.com.mx'));
		    $message->attach($archivo);
		});

        return Response::json(array('respuesta' => 'Correo enviado Correctamente a '. $datos['datosProv']->PRO_correo1));

	}

	public function itemsAlmacenes($unidad){
		$datos = Input::all();
		$almacenes = array();

		foreach ($datos as $dato) {
			array_push($almacenes, $dato['ALM_clave']);
		}

		// return Existencia::almacenes($unidad,$almacenes);

		$datos =  Existencia::almacenes($unidad,$almacenes);

		$respuesta = array();

		foreach ($datos as $dato) {

			$claveItem = $dato['ITE_clave'];
			$consulta = OrdenCompra::porSurtir($claveItem,$unidad);

			if ($consulta->count() > 0) {
				$cantidad = $consulta->PorSurtir;
			}else{
				$cantidad = 0;
			}

			$conf = Configuracion::where(array( 'ITE_clave' => $claveItem,'UNI_clave' => $unidad ))->first();

			$nivelCompra = $conf->CON_nivelCompra;
			$nivelMaximo = $conf->CON_nivelMaximo;
			$nivelMinimo = $conf->CON_nivelMinimo;

			$existencia = $dato['EXI_cantidad'];

			//se genera una cantidad virtual cuando tienes cantidades por surtir
			$existenciaAparente = $existencia + $cantidad;

			$comprar = $nivelMaximo - $existenciaAparente;

			if ($existenciaAparente <= $nivelMinimo) {
				$semaforo = 'bgm-red';
			}elseif ( ($existenciaAparente > $nivelMinimo && $existenciaAparente < $nivelCompra) || $existenciaAparente == $nivelCompra ) {
				$semaforo = 'bgm-yellow';
			}elseif ($existenciaAparente > $nivelCompra) {
				$semaforo = 'bgm-green';
			}

			$respuesta[] = array(
				'ITE_clave' => $dato['ITE_clave'],
				'ITE_nombre' => $dato['ITE_nombre'],
				'UNI_clave' => $dato['UNI_clave'],
				'EXI_cantidad' => $existencia,
				'POR_surtir' => $cantidad,
				'CON_nivelCompra' => $nivelCompra,
				'CON_nivelMinimo' => $nivelMinimo,
				'CON_nivelMaximo' => $nivelMaximo,
				'ITE_codigo' => $dato['ITE_codigo'],
				'semaforo'	=> $semaforo,
				'compra' => $comprar,
			);
		}

		return $respuesta;

	}

	public function itemsUnidad($unidad){



		$datos =  Existencia::configuracion($unidad);
		$respuesta = array();


		foreach ($datos as $dato) {

			$claveItem = $dato['ITE_clave'];
			$consulta = OrdenCompra::porSurtir($claveItem,$unidad);

			if ($consulta->count() > 0) {
				$cantidad = $consulta->PorSurtir;
			}else{
				$cantidad = 0;
			}

			$conf = Configuracion::where(array( 'ITE_clave' => $claveItem,'UNI_clave' => $unidad ))->first();


			if ($conf) {

				$nivelCompra = $conf->CON_nivelCompra;
				$nivelMaximo = $conf->CON_nivelMaximo;
				$nivelMinimo = $conf->CON_nivelMinimo;

				$existencia = $dato['EXI_cantidad'];

				//se genera una cantidad virtual cuando tienes cantidades por surtir
				$existenciaAparente = $existencia + $cantidad;

				$comprar = $nivelMaximo - $existenciaAparente;


				if ($existenciaAparente <= $nivelMinimo) {
					$semaforo = 'bgm-red';
				}elseif ( ($existenciaAparente > $nivelMinimo && $existenciaAparente < $nivelCompra) || $existenciaAparente == $nivelCompra ) {
					$semaforo = 'bgm-yellow';
				}elseif ($existenciaAparente > $nivelCompra) {
					$semaforo = 'bgm-green';
				}

				$respuesta[] = array(
					'ITE_clave' => $dato['ITE_clave'],
					'ITE_nombre' => $dato['ITE_nombre'],
					'UNI_clave' => $dato['UNI_clave'],
					'EXI_cantidad' => $existencia,
					'POR_surtir' => $cantidad,
					'CON_nivelCompra' => $nivelCompra,
					'CON_nivelMinimo' => $nivelMinimo,
					'CON_nivelMaximo' => $nivelMaximo,
					'ITE_codigo' => $dato['ITE_codigo'],
					'semaforo'	=> $semaforo,
					'compra' => $comprar,
				);

			}else{
				// return Response::json(array('respuesta' => 'Algunos items no tienen alertas favor de verificar'),500);
				//cambio
			}
		}

		return $respuesta;

	}

	public function itemProveedor(){

		$itemprovedor = new ItemProveedor;
		$item = Input::get('item');

		$itemprovedor->ITE_clave = $item['ITE_clave'];
		$itemprovedor->PRO_clave = Input::get('proveedor');
		$itemprovedor->IPR_ultimoCosto = Input::get('cantidad');
		$itemprovedor->IPR_ultimaFecha = date('Y-m-d H:i:s');

		$itemprovedor->save();

		return Response::json(array('respuesta' => 'Item asignado Correctamente'));

	}

	public function importacion(){

		$ruta = 'archivo';
		$file = Input::file('file');
		$nombreArchivo = $file->getClientOriginalName();
		$file->move(public_path(),$file->getClientOriginalName());


		Excel::load( $nombreArchivo , function($reader) {

	        $datos = $reader->toArray();

	        foreach ($datos as $dato) {

	            $item = $dato['item_id'];
	            $unidad = $dato['unidad_id'];
	            $almacen = $dato['almacen_id'];
	            $existencia = $dato['existencia'];
	            $lote = $dato['lote'];
	            $caducidad = $dato['caducidad'];

	            $existenciaActual = Existencia::where(array('ALM_clave'=>$almacen,'ITE_clave' => $item ))->count();

	            if ($existenciaActual == 0) {

		            $operacion = new Operacion;

		            //la operacion es un ajuste de tipo inicial
					$operacion->tipomovimiento = 1;
					$operacion->tipoajuste = 1;

					$operacion->item = $item;
					$operacion->almacen = $almacen;
					$operacion->cantidad = $existencia;
					$operacion->idLote = '';
					$operacion->lote = $lote;
					$operacion->orden = '';
					$operacion->caducidad = $caducidad;
					$operacion->usuario = Input::get('usuario');
					$operacion->observaciones = 'Importación a través de archivo de excel';
					$operacion->receta = '';
					$operacion->alta();
					$operacion->verificaLote();

	            }else{
	            	return Response::json(array('flash' => 'Este Almacen ya contiene datos'),500);

	            }


	        }

	        return Response::json(array('respuesta' => 'Datos cargados correctamente'));

	    });
	}

	public function actualizaItemProveedor(){

		ItemProveedor::where( array(
			'ITE_clave' => Input::get('itemId'),
			'PRO_clave' => Input::get('proveedor'),
			'IPR_ultimaFecha' => Input::get('fecha')
		) )->update( array( 'IPR_ultimoCosto' => Input::get('cantidad') ));


		return Response::json(array('respuesta' => 'Conexión Actualizada Correctamente'));

	}

	public function eliminaItemProveedor(){

		ItemProveedor::where( array(
			'ITE_clave' => Input::get('ITE_clave'),
			'PRO_clave' => Input::get('PRO_clave'),
			'IPR_ultimaFecha' => Input::get('IPR_ultimaFecha')
		) )->delete();


		return Response::json(array('respuesta' => 'Conexión Eliminada Correctamente'));

	}

	// agrega unnuevo movminiento
	public function movimiento(){
		//si es SALIDA verificamos si se trata de un item agregado a receta
		if ( Input::get('tipomov') == 3 ) {
			if ( Input::has('receta') ) {
				$receta = Input::get('receta');
				//agregamos el detalle de la receta en las observaciones
				$obs =  "Surtido Receta MV con numero: ".$receta." (desde Sistema de Inventario)";
			} else {
				// si no es salida por receta dejamos en blanco la receta y las observaciones del movimiento
				$receta ='';
				$obs = Input::get('observaciones');
			}
		}

		$caducidad = Input::get('caducidad');
		if ( $caducidad != '' || $caducidad != null ) {
			$caducidad = substr( $caducidad, 0, 10 ) . ' 00:00:00';
		}

		//preparamos los movimientos del item
		$operacion = new Operacion;

		$operacion->tipomovimiento = Input::get('tipomov');
		$operacion->item = Input::get('item');
		$operacion->almacen = Input::get('almacen');
		$operacion->cantidad = Input::get('cantidad');
		$operacion->tipoajuste = Input::get('tipoa');
		$operacion->idLote = Input::get('idLote');
		// $operacion->caducidad = Input::get('caducidad');
		$operacion->caducidad = $caducidad;
		$operacion->lote = Input::get('lote');
		$operacion->orden = Input::get('orden');
		$operacion->usuario = Input::get('usuario');
		// $operacion->observaciones = Input::get('observaciones');
		$operacion->observaciones = $obs;
		// $operacion->receta = Input::has('receta') ? Input::get('receta') : '';
		$operacion->receta = $receta;


		// si es un ajuste no importa las cantidades en el item exitentes se resetean
		if ($operacion->tipomovimiento == 1) {

			$operacion->alta();

		// en este se toma que es una alta de item
		}else if($operacion->tipomovimiento == 2){

			$operacion->entrada();

		// en este se toma que es una baja de item
		}else if ($operacion->tipomovimiento == 3) {

			$operacion->salida();

		}

		$operacion->verificaLote();

		return Response::json(array('respuesta' => 'Movimiento guardado Correctamente'));

	}

	// agrega varios movminientos
	public function movimientos(){
		$datos = Input::all();
		foreach ($datos as $dato) {
			if ( $dato['caducidad'] != '' ) {
				$dato['caducidad'] = substr( $dato['caducidad'], 0, 10 ) . ' 00:00:00';
			}
			//preparamos los movimientos del item
			$operacion = new Operacion;

			$operacion->tipomovimiento 	= $dato['tipomov'];
			$operacion->item 	 					= $dato['item'];
			$operacion->almacen 	 			= $dato['almacen'];
			$operacion->cantidad 	 			= $dato['cantidad'];
			$operacion->tipoajuste 	 		= $dato['tipoa'];
			$operacion->idLote 	 				= $dato['idLote'];
			$operacion->lote 	 					= $dato['lote'];
			$operacion->orden 	 				= $dato['orden'];
			$operacion->caducidad 	 		= $dato['caducidad'];
			$operacion->usuario 	 			= $dato['usuario'];
			$operacion->observaciones 	= $dato['observaciones'];
			$operacion->receta 	 				= '';

			// si es un ajuste no importa las cantidades en el item exitentes se resetean
			if ($operacion->tipomovimiento == 1) {
				$operacion->alta();
			}

			// en este se toma que es una alta de item
			if($operacion->tipomovimiento == 2){
				$operacion->entrada();
			}

			// en este se toma que es una baja de item
			if ($operacion->tipomovimiento == 3) {
				$operacion->salida();
			}

			$operacion->verificaLote();

		}

		return Response::json(array('respuesta' => 'Movimiento guardado Correctamente'));


	}

	public function ordencompra(){

		$datos = Input::all();
		$ordenes = array();

		// recorremos todoas las ordenes procesadas
		foreach ($datos as $valor) {

			$items = $valor['items'];

			$almacenes = array();

			// el arreglo de almacenes para que quede en un solo array unico para guardar en bd
			foreach ($valor['almacenes'] as $almacen) {
				array_push($almacenes, $almacen['ALM_clave']);
			}

			//guardamos una nueva orden
			$orden = new OrdenCompra;

			$orden->OCM_fechaReg = date('Y-m-d H:i:s');
			$orden->TOR_clave = $valor['tipo'];
			$orden->USU_creo = $valor['usuario'];
			$orden->PRO_clave = $valor['proveedor'];
			$orden->OCM_importeEsperado = $valor['total'];
			$orden->OCM_almacenes = implode("," , $almacenes);
			$orden->UNI_clave = $valor['unidad'];

			$orden->save();

			$claveOrden = $orden->OCM_clave;

			// guardamos que items se guardaron en esta orden
			foreach ($items as $item) {

				$ordenItem = new OrdenItem;

				$ordenItem->ITE_clave = $item['ITE_clave'];
				$ordenItem->OCM_clave = $claveOrden;
				$ordenItem->OIT_cantidadPedida = $item['cantidad'];
				$ordenItem->OIT_precioEsperado = $item['IPR_ultimoCosto'];
				$ordenItem->save();

			}

			array_push($ordenes, $claveOrden);

		}
		$pdf = helpers::ordenPDF($orden->OCM_clave);
    	// return $pdf->stream();
		return Response::json(array('respuesta' => 'Orden Generada Correctamente','ordenes' => $ordenes));

	}

	public function proveedoresItems(){

		$datos = array();
		$items = Input::all();

		foreach ($items as $item) {

			$datos[] = array(
				'ITE_clave' => $item['ITE_clave'],
				'ITE_nombre' => $item['ITE_nombre'],
				'CON_nivelCompra' => $item['CON_nivelCompra'],
				'CON_nivelMaximo' => $item['CON_nivelMaximo'],
				'CON_nivelMinimo' => $item['CON_nivelMinimo'],
				'EXI_cantidad' => $item['EXI_cantidad'],
				'Cantidad' => $item['CON_nivelMaximo'] - $item['EXI_cantidad'],
				'proveedores' => ItemProveedor::todo($item['ITE_clave'])
		    );

		}

		return $datos;

	}

	public function reservaItem(){

		$item = Input::get('id_item');
		$almacen = Input::get('id_almacen');
		$cantidad = Input::get('NS_cantidad');

		$reserva = new Reserva;
		$reserva->RES_cantidad = $cantidad;
		$reserva->ITE_clave = $item;
		$reserva->ALM_clave = $almacen;
		$reserva->RES_fecha = date('Y-m-d H:i:s');
		$reserva->save();

		return $reserva->RES_clave;

	}

	public function surtirItem($usuario){

		$timeReceta = Receta::where('id_receta',Input::get('receta'))->select( DB::raw('IF((RM_fecreg + INTERVAL 30 MINUTE<now()) , concat(1), concat(0)) as tardio'))->get();
		$timeReceta = $timeReceta[0];

		$tardio="";

		if ($timeReceta->tardio=="1") {
			$tardio=" (Surtido Tardio)";
		}

		$operacion = new Operacion;

		$claveExistencia = Input::get('existencia');
		$claveReserva = Input::get('reserva');
		$recetaItem = Input::get('recetaItem');
		$lotes = Input::has('lotes') ? Input::get('lotes') : array();

		$operacion->tipomovimiento = 3;
		$operacion->item = Input::get('item');
		$operacion->almacen = Input::get('almacen');
		$operacion->cantidad = Input::get('cantidad');
		$operacion->receta = Input::get('receta');
		$operacion->tipoajuste = '';
		$operacion->orden = '';
		$operacion->idLote = '';
		$operacion->usuario = $usuario;
		$operacion->observaciones = 'Surtido Receta MV con numero: ' . Input::get('receta').$tardio;

		//actualizamos en la tabla mv el item surtido
		//en caso de que se haya cambiado las ortesis
		$recetaMV = Suministros::find($recetaItem);
		$recetaMV->NS_surtida = $operacion->item;
		$recetaMV->save();

		//eliminamos reserva
		$reserva = Reserva::find($claveReserva);
		$reserva->delete();

		//damos salida al item surtido
		$operacion->salida();

		foreach ($lotes as $lote) {

			$operacion->idLote 		= $lote['idLote'];
			$operacion->lote 		= $lote['lote'];
			// $operacion->caducidad 	= substr($lote['caducidad'], 0, 8).'01 00:00:00';
			$operacion->caducidad 	= $lote['caducidad'];
			$operacion->cantidad 	= $lote['cantidad'];
			$operacion->verificaLote();
		}

		return Response::json(array('respuesta' => 'Item Surtido Correctamente'));

	}


	//funcion que surte la orden de compra
	public function surtirOrden(){
		//obtenemos los datos
		$ordenClave = Input::get('orden');
		$usuario = Input::get('usuario');

		$unidad = OrdenCompra::find($ordenClave)->UNI_clave;
		$proveedor = OrdenCompra::find($ordenClave)->PRO_clave;

		$resultado = Almacen::where('UNI_clave',$unidad)->where('TAL_clave',1)->first();
		$almacen = $resultado->ALM_clave;

		$orden = OrdenCompra::find($ordenClave);

		$orden->OCM_bolsas = Input::get('bolsas');
		$orden->OCM_bultos = Input::get('bultos');
		$orden->OCM_cajas = Input::get('cajas');
		$orden->OCM_guia = Input::get('guia');
		// $orden->OCM_incompleta = Input::get('incompleta');
		$orden->OCM_observacionEntrega = Input::get('observacionEntrega');
		$orden->OCM_observacionesVerificacion = Input::get('observacionesVerificacion');
		$orden->OCM_incompleta = Input::get('incompleta');
		$orden->OCM_entrega = Input::get('tipoEntrega');
		$orden->OCM_verificacion = Input::get('verificacion');
		$orden->OCM_importeFinal = Input::get('total');

		$orden->OCM_fechaSurtida =  date('Y-m-d H:i:s');
		$orden->USU_surtio = $usuario;
		$orden->OCM_surtida = true;

		// si no esta incompleta cerramos la orden de compra
		if (!Input::get('incompleta') ) {

			$orden->OCM_fechaCerrada =  date('Y-m-d H:i:s');
			$orden->USU_cerro = $usuario;
			$orden->OCM_cerrada = true;

		}

		$orden->save();

		//obtenemos los items surtidos
		$items = Input::get('surtidos');

		foreach ($items as $valor) {

			$clave = $valor['OIT_clave'];
			$cantidadSurtida = ($valor['OIT_cantidadSurtida'] > 0) ? $valor['OIT_cantidadSurtida']  : $valor['OIT_cantidadPedida'];
			$ultimoCosto = ($valor['OIT_precioFinal'] > 0) ? $valor['OIT_precioFinal'] : $valor['OIT_precioEsperado'];
			$claveItem = $valor['ITE_clave'];
			$lotes = isset($valor['lotes']) ? $valor['lotes'] : array();
			$loteForzoso = $valor['TIT_forzoso'];

			$datoItem = OrdenItem::find($clave);
			$datoItem->OIT_cantidadSurtida = $cantidadSurtida;
			$datoItem->OIT_precioFinal = $ultimoCosto;
			$datoItem->save();

			helpers::surteItem($claveItem,$cantidadSurtida,$almacen,$ordenClave,$usuario,'Surtido Orden',$loteForzoso,$lotes);

		}

		return Response::json(array('respuesta' => 'Orden Surtida Correctamente'));

	}

	// agrega unnuevo movminiento
	public function traspaso(){

		//preparamos los movimientos que se involucran el el traspaso del item
		$datos =  Input::all();
		$cveTraspaso = date("YmdHis").'-'.$datos[0]['usuario'];

		//insertamos en la table de traspasos
		DB::table('traspasos')->insert(array(
		    array(
		    	'TRA_codigo' 	=> $cveTraspaso,
		     	'TRA_usuario' 	=> $datos[0]['usuario'],
		     	'TRA_fecha' 	=> DB::raw('now()')
		     	),
		));

		foreach ($datos as $dato) {
			# code...
			$almacenOrigen = $dato['almacenOrigen'];
			$almacenDestino = $dato['almacenDestino'];
			$idLote = $dato['lote'];
			$item = $dato['item'];
			$cantidad = $dato['cantidad'];
			$obs = $dato['obs'];
			$usuario = $dato['usuario'];


			//baja de cantidad en almacenOrigen
			$operacion1 = new Operacion;

			$operacion1->tipomovimiento = 3;
			$operacion1->item = $dato['item'];
			$operacion1->almacen = $dato['almacenOrigen'];
			$operacion1->cantidad = $dato['cantidad'];
			$operacion1->idLote = $dato['lote'];
			$operacion1->usuario = $dato['usuario'];
			$operacion1->traspaso = 1;
			$operacion1->observaciones = 'Disminución por traspaso '.$obs;
			$operacion1->cveTraspaso = $cveTraspaso;

			$operacion1->salida();

			$operacion1->verificaLote();

			//incremento de cantidad en almacenDestino
			$operacion2 = new Operacion;

			$operacion2->tipomovimiento = 2;
			$operacion2->item = $dato['item'];
			$operacion2->almacen = $dato['almacenDestino'];
			$operacion2->cantidad = $dato['cantidad'];
			$operacion2->idLote = $dato['lote'];
			$operacion2->usuario = $dato['usuario'];
			$operacion2->traspaso = 1;
			$operacion2->observaciones = 'Incremento por traspaso '.$obs;
			$operacion2->cveTraspaso = $cveTraspaso;

			$operacion2->entrada();

			$operacion2->verificaLote();
		}

		$cve = Movimiento::where('USU_clave', $usuario)
							->where('MOV_traspaso', 1)
							->select('CVE_traspaso')
							->orderBy('MOV_clave', 'desc')
							->take(1)
							->get();

		$pdf = helpers::traspasoPDF($cve[0]['CVE_traspaso']);
    	// return $pdf->stream();

		return Response::json(array('respuesta' => 'Traspaso efectuado Correctamente',
									'cveTraspaso' => $cveTraspaso,
									'datos' => $pdf));

	}

	public function usuarioAlmacen(){

		$usuario = Input::get('usuario');
		$usuarioasigno = Input::get('usuarioasigno');
		$almacenes = Input::get('almacenes');

		foreach ($almacenes as $dato){


			$conexion = new UsuarioAlmacen;

			$conexion->USU_clave =  $usuario;
	    	$conexion->ALM_clave =  $dato['ALM_clave'];
	    	$conexion->UAL_fechaAsociado =  date('Y-m-d H:i:s');
	    	$conexion->USU_asocio =  $usuarioasigno;

	    	$conexion->save();

		}

		return Response::json(array('respuesta' => 'Almacenes Asignados Correctamente'));

	}


	public function usuariosAlm(){
		$usuarios = User::activos();
		$respuesta = array();

		foreach ($usuarios as $dato){

			$almacenes = DB::table('usuarioAlmacen')
							->Join('almacenes','usuarioAlmacen.ALM_clave', '=' ,'almacenes.ALM_clave')
							->select('usuarioAlmacen.*','ALM_nombre')
							->where('USU_clave',$dato->USU_clave)->get();

			$respuesta[] = array(
				"clave" => $dato->USU_clave,
				"nombre" => $dato->USU_nombrecompleto,
				"usuario" => $dato->USU_login,
				"almacenes" => $almacenes
		    );
		}

		return $respuesta;

	}


	public function verificaOrden($orden){

		$datos = OrdenItem::join('ordenCompra','ordenCompra.OCM_clave','=','ordenItems.OCM_clave')
					->join('items','items.ITE_clave','=','ordenItems.ITE_clave')
					->join('tiposItem','items.TIT_clave','=','tiposItem.TIT_clave')
					->where('ordenCompra.OCM_clave',$orden)->get();
		$respuesta = array();

		foreach ($datos as $item) {

			$pedido = $item['OIT_cantidadPedida'];
			$surtido = $item['OIT_cantidadSurtida'];

			if ($surtido == 0) {
				array_push($respuesta,$item);
			}elseif ($surtido < $pedido) {
				array_push($respuesta,$item);
			}

		}

		return $respuesta;

	}

	public function reservasAntiguas(){
		//traemos el listado de reservas agrupadas por unidad
		$reservas = DB::table('reservas')
						->select('reservas.*', 'almacenes.UNI_clave', 'unidades.UNI_claveMV')
						->join('almacenes', 'reservas.ALM_clave', '=', 'almacenes.ALM_clave')
						->join('unidades', 'almacenes.UNI_clave', '=', 'unidades.UNI_clave')
						->groupBy('UNI_claveMV')
						->get();

		//verificamos si hay recetas pendientes por unidad
		$resumen = array();
		$cantidad = 0;

		foreach ($reservas as $reserva) {
			$apiURL = 'http://medicavial.net/mvnuevo/api/notaMedica.php?funcion=listadoRecetasSinSurtir&uni='.$reserva->UNI_claveMV;
			$datosURL = file_get_contents($apiURL);
			$recetasPendientes = json_decode($datosURL, true);

			//si en la unidad actual existe reserva
			//pero no hay recetas pendientes procedemos
			//a eliminar las reservas de esta unidad
			if ( sizeof($recetasPendientes) == 0 ) {
				$resumen[] = array( 'UNI_claveMV'	=> $reserva->UNI_claveMV,
									'UNI_clave'		=> $reserva->UNI_clave,
									'pendientes'	=> sizeof($recetasPendientes),
									'almacen'		=> $reserva->ALM_clave
									);

				$eliminados = DB::table('reservas')
								->where('ALM_clave', '=', $reserva->ALM_clave)
								->delete();
				$cantidad = $eliminados + $cantidad;
			}
		};
		// return $resumen;

		//eliminamos las reservas que tengan más de 30 días
		$reservas = DB::table('reservas')
						->where('RES_fecha', '<', DB::raw('DATE(DATE_SUB(NOW(), INTERVAL 30 DAY))'))
						->delete();

		$totalEliminados = $reservas + $cantidad;

		//generamos el correo informativo
        Mail::send('emails.reservas', array('cantidad' => $totalEliminados), function($message)
        {

            $message->from('mvcompras@medicavial.com.mx', 'Sistema de Inventario MédicaVial');
            $message->subject('Reservas Eliminadas');
            $message->to('sramirez@medicavial.com.mx');
            $message->cc('samuel11rr@gmail.com');
        });

	}

	public function corrigeObs(){
		//buscamos el ultimo registro sin observaciones
		$ultimo = Movimiento::where('id_receta', '<>', 0)
								->where('TIM_clave', 3)
								->where('MOV_observaciones', '')
								->orderBy('created_at', 'desc')
								->take(1)
								->get();


		if ( sizeof( $ultimo ) > 0 ) {
			//buscamos los ultimos registros a partir de la fecha del ultimo
			$porActualizar = Movimiento::where('id_receta', '<>', 0)
									->where('TIM_clave', 3)
									->where('MOV_observaciones', '')
									->where('created_at', '<=', $ultimo[0]['created_at'])
									->orderBy('created_at', 'desc')
									->take(10)
									->get();

			//iniciamos un ciclo por la cantidad de registros a actualizar
			for ($i=0; $i <sizeof( $porActualizar ) ; $i++) {
				DB::table('movimientos')
				    ->where('MOV_clave', $porActualizar[$i]['MOV_clave'])
				    ->update(array('MOV_observaciones' => 'Surtido Receta MV con numero: '.$porActualizar[$i]['id_receta'].' (desde Sistema de Inventario)'));
			}

			$respuesta = array( 'resumen' => sizeof( $porActualizar )." registros actualizados",
								'detalle' => $porActualizar );
		} else{
			$respuesta = 'No hay nada para actualizar';
		}


		return $respuesta;
	}


	public function ajusteLoteCaducidad(){
		//buscamos los lotes cuya caducidad no esté registrado el dia 01 a las 00 horas
		$lotes = Lote::whereRaw("substr(LOT_caducidad, 9, 5) <> '01 00'")
						->orderBy('created_at', 'asc')
						// ->take(10)
						->get();

		$respuesta = array();

		for ($i=0; $i < sizeof($lotes) ; $i++) {
			DB::table('lote')
			    ->where('LOT_clave', $lotes[$i]['LOT_clave'])
			    ->update(array('LOT_caducidad' => substr($lotes[$i]['LOT_caducidad'], 0, 8).'01 00:00:00'));


			$respuesta[] = array( 	'id_lote' 				=> $lotes[$i]['LOT_clave'],
									'caducidad original' 	=> $lotes[$i]['LOT_caducidad'],
									'caducidad correccion'	=> substr($lotes[$i]['LOT_caducidad'], 0, 8).'01 00:00:00');
		}

		return $respuesta;
	}

	public function ajusteLote(){
		return Input::All();
	}

}
