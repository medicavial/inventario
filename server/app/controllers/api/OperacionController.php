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

		//obtenemos el almacen principal de esa unidad
		$resultado = Almacen::where('UNI_clave',$unidad)->where('TAL_clave',1)->first();
		$almacen = $resultado->ALM_clave;
		//buscamos la orden
		$orden = OrdenCompra::find($cveOrden);

		// recorremos item por item 
		foreach ($items as $item) {
			
			//clave del item de esta orden
			$claveOrdenitem = $item['OIT_clave'];

			//la cantidad que se acompleto debe de set la misma que falto por eso la resta  
			$cantidad = $item['OIT_cantidadPedida'] - $item['OIT_cantidadSurtida'];
			$claveItem = $item['ITE_clave'];


			//acompletamos la orden del item 
			$datoItem = ordenItem::find($claveOrdenitem);
			$datoItem->OIT_cantidadSurtida = $item['OIT_cantidadPedida'];
			$datoItem->save();

			// se obtienen los datos del item si es forzoso el lote y los lotes
			$lotes = isset($item['lotes']) ? $item['lotes'] : array();
			$loteForzoso = $item['TIT_forzoso'];

			helpers::surteItem($claveItem,$cantidad,$almacen,$cveOrden,$usuario,'Se Completó Orden',$loteForzoso,$lotes);

		}

		$orden->OCM_cerrada = 1;
		$orden->OCM_fechaCerrada =  date('Y-m-d H:i:s');
		$orden->USU_cerro = $usuario;
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
		return Existencia::unidad($unidad);
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

            $pdf = helpers::ordenPDF($ordeCompra);
            $pdf->save($archivo);

            $message->attach($archivo);

        });

        return Response::json(array('respuesta' => 'Correo enviado Correctamente'));

	}

	// funcion que ayuda a mandar correo al proveedor de la orden creada
	public function enviaCorreoOrden($orden){

        $datos = OrdenCompra::find($orden);

        // con esta funcion preparamos el cuerpo del correo 

        try{

	        Mail::send('emails.orden', $datos , function($message) use ($orden)
	        {

	        	//generamos lo necesario para el envio
	        	$datosOrden = OrdenCompra::find($orden);
	        	$unidad = $datosOrden->UNI_clave;
	        	$proveedor = $datosOrden->PRO_clave;

	        	$nombreUnidad = Unidad::find($unidad)->UNI_nombrecorto;

	        	//generamos el pdf adjunto
	        	$archivo =  public_path().'/ordenesCompra/'.$orden.'.pdf';

	            $pdf = helpers::ordenPDF($orden);
	            $pdf->save($archivo);


	            $correoParametro = Parametro::find(1)->PAR_correoOrden;

	            // preparamos el correo a enviar
	            $correoProveedor = Proveedor::find($proveedor)->PRO_correo1;

	            if ($correoProveedor != '') {
	            	$correo = $correoProveedor;
	            	$correoCopia = $correoParametro;
	            }else{
	            	$correo = $correoParametro;
	            }

	            $message->from('salcala@medicavial.com.mx', 'Sistema de Inventario MV');
	            $message->subject('Orden de compra ' . $orden . ' ,' . $nombreUnidad);
	            $message->to($correo);
	            if ($correoCopia != '') {
	            	$message->cc($correoCopia);
	            }
	            $message->attach($archivo);

	        });

        	return Response::json(array('respuesta' => 'Correo enviado Correctamente a '. $correo));
        	
        }catch(Exception $e){

        	$datosOrden = OrdenCompra::find($orden);
        	$unidad = $datosOrden->UNI_clave;
        	$proveedor = $datosOrden->PRO_clave;

    		$correoParametro = Parametro::find(1)->PAR_correoOrden;

            // preparamos el correo a enviar
            $correoProveedor = Proveedor::find($proveedor)->PRO_correo1;

            if ($correoProveedor != '') {
            	$correo = $correoProveedor;
            }else{
            	$correo = $correoParametro;
            }

        	return Response::json(array('respuesta' => 'Correo no se logro mandar a '. $correo),500);
        
        }


	}

	public function itemsAlmacenes($unidad){
		$datos = Input::all();
		$almacenes = array();

		foreach ($datos as $dato) {
			array_push($almacenes, $dato['ALM_clave']);
		}

		return Existencia::almacenes($unidad,$almacenes);

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

			$existencia = $dato['EXI_cantidad'];
			$nivelCompra = $dato['CON_nivelCompra'];
			$nivelMaximo = $dato['CON_nivelMaximo'];
			$nivelMinimo = $dato['CON_nivelMinimo'];

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

	// agrega unnuevo movminiento
	public function movimiento(){

		//preparamos los movimientos del item
		$operacion = new Operacion;

		$operacion->tipomovimiento = Input::get('tipomov');
		$operacion->item = Input::get('item');
		$operacion->almacen = Input::get('almacen');
		$operacion->cantidad = Input::get('cantidad');
		$operacion->tipoajuste = Input::get('tipoa');
		$operacion->idLote = Input::get('idLote');
		$operacion->lote = Input::get('lote');
		$operacion->orden = Input::get('orden');
		$operacion->caducidad = Input::get('caducidad');
		$operacion->usuario = Input::get('usuario');
		$operacion->observaciones = Input::get('observaciones');
		$operacion->receta = Input::has('receta') ? Input::get('receta') : '';

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
		$reserva->save();
		
		return $reserva->RES_clave;
		
	}

	public function surtirItem($usuario){


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
		$operacion->observaciones = 'Surtido Receta MV con numero: ' . Input::get('receta');

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
		$orden->OCM_incompleta = Input::get('incompleta');
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

			$claveOrdenitem = $valor['OIT_clave'];
			$cantidadSurtida = ($valor['OIT_cantidadSurtida'] > 0) ? $valor['OIT_cantidadSurtida']  : $valor['OIT_cantidadPedida'];
			$ultimoCosto = ($valor['OIT_precioFinal'] > 0) ? $valor['OIT_precioFinal'] : $valor['OIT_precioEsperado'];
			$claveItem = $valor['ITE_clave'];
			$lotes = isset($valor['lotes']) ? $valor['lotes'] : array();
			$loteForzoso = $valor['TIT_forzoso'];

			$datoItem = ordenItem::find($claveOrdenItem);
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

		$almacenOrigen = Input::get('almacenOrigen');
		$almacenDestino = Input::get('almacenDestino');
		$idLote = Input::get('lote');
		$item = Input::get('item');
		$cantidad = Input::get('cantidad');


		//baja de cantidad en almacenOrigen
		$operacion1 = new Operacion;

		$operacion1->tipomovimiento = 3;
		$operacion1->item = Input::get('item');
		$operacion1->almacen = Input::get('almacenOrigen');
		$operacion1->cantidad = Input::get('cantidad');
		$operacion1->idLote = Input::get('lote');
		$operacion1->usuario = Input::get('usuario');
		$operacion1->traspaso = 1;
		$operacion1->observaciones = 'Disminución por traspaso';

		$operacion1->salida();

		$operacion1->verificaLote();

		//incremento de cantidad en almacenDestino
		$operacion2 = new Operacion;

		$operacion2->tipomovimiento = 2;
		$operacion2->item = Input::get('item');
		$operacion2->almacen = Input::get('almacenDestino');
		$operacion2->cantidad = Input::get('cantidad');
		$operacion2->idLote = Input::get('lote');
		$operacion2->usuario = Input::get('usuario');
		$operacion2->traspaso = 1;
		$operacion2->observaciones = 'Incremento por traspaso';

		$operacion2->entrada();

		$operacion2->verificaLote();


		return Response::json(array('respuesta' => 'Traspaso efectuado Correctamente'));

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


}
