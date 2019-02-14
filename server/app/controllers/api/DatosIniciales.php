<?php

class DatosIniciales extends \BaseController {

	public function index($unidades) {
		$ordenes =  OrdenCompra::todos($unidades);

		$items = Item::todos();

		$porCaducar = DatosIniciales::porCaducar($unidades);

		$porSurtir = DatosIniciales::porSurtir($unidades);

		$ordAbiertas = DatosIniciales::ordenesAbiertas($unidades);

		return array(
					 'itemsTotal' 	=> sizeof($items),
					 'ordenes'		=> sizeof($ordenes),
					 'porCaducar'	=> sizeof($porCaducar),
					 'porSurtir'	=> sizeof($porSurtir),
					 'ordAbiertas'	=> sizeof($ordAbiertas)
				);

	}



	public function porCaducar($unidades, $dias=null) {

		// EVALUAMOS LAS VARIABLES RECIBIDAS PARA DETERMINAR EL FORMATO DE LA CONSULTA
		// $variable = evaluacion ? valorTrue : valorFalse
		$unidadesArr = (gettype( $unidades ) == 'string') ? explode(",", $unidades) : $unidades;
		$cantidadDias = ( !$dias ) ? 30 : $dias;

		$select='existencias.ALM_clave, existencias.EXI_clave, existencias.ITE_clave, existencias.EXI_cantidad, 
				lote.LOT_clave, lote.EXI_clave, lote.LOT_numero, lote.LOT_cantidad, lote.LOT_caducidad,
				unidades.UNI_nombrecorto, unidades.UNI_clave, unidades.UNI_claveMV,
				items.ITE_nombre, items.ITE_codigo, almacenes.ALM_nombre';

		// $select='existencias.EXI_cantidad, lote.LOT_numero, lote.LOT_cantidad, lote.LOT_caducidad, unidades.UNI_nombrecorto, items.ITE_nombre, items.ITE_codigo,
		// 		 SUM(existencias.EXI_cantidad) as suma';

		$porCaducar = DB::table('lote')
						->select( DB::raw( $select ) )
						->join('existencias', 'lote.ITE_clave', '=', 'existencias.ITE_clave')
						->join('items', 'existencias.ITE_clave', '=', 'items.ITE_clave')
						->join('almacenes', 'existencias.ALM_clave', '=', 'almacenes.ALM_clave')
						->join('unidades', 'almacenes.UNI_clave', '=', 'unidades.UNI_clave')
						->where('lote.LOT_cantidad', '>', 0)
						->where('EXI_cantidad', '>', 0)
						->where('existencias.ALM_clave', '<>', 43)
						->where('LOT_caducidad', '<>', '0000-00-00 00:00:00')
						->where('LOT_caducidad', '>=', DB::raw('NOW()'))
						->where('LOT_caducidad', '<=', DB::raw('DATE(DATE_ADD(NOW(), INTERVAL '.$cantidadDias.' DAY))'))
						->whereIn('almacenes.UNI_clave', $unidadesArr)
						->orderBy('UNI_nombrecorto', 'asc')
						->orderBy('ALM_nombre', 'asc')
						->orderBy('LOT_caducidad', 'asc')
						// ->groupBy('UNI_nombrecorto', 'LOT_numero', 'ITE_codigo')
						->get();

		return $porCaducar;

	}


	public function porSurtir($unidades){

		$porSurtir = DB::table('reservas')
						->select(DB::raw('reservas.RES_clave, items.ITE_codigo, items.ITE_nombre, almacenes.ALM_nombre, unidades.UNI_nombrecorto, reservas.RES_cantidad, RES_fecha'))
						->join('items', 'reservas.ITE_clave', '=', 'items.ITE_clave')
						->join('almacenes', 'reservas.ALM_clave', '=', 'almacenes.ALM_clave')
						->join('unidades', 'almacenes.UNI_clave', '=', 'unidades.UNI_clave')
						->whereIn('almacenes.UNI_clave', explode(",",$unidades))
						->where('reservas.ALM_clave', '<>', 43)
						->orderBy('reservas.RES_clave', 'asc')
						->get();

		return $porSurtir;
	}

	public function porSurtirDetalles( $unidades ){
		set_time_limit(180);// limite de tiempo en tiempo en segundos

		/*  EN MISMO SERVIDOR */
		// $porSurtir = DB::table('reservas')
		// 				->select(DB::raw('reservas.RES_clave, items.ITE_codigo, items.ITE_nombre, almacenes.ALM_nombre, unidades.UNI_nombrecorto, reservas.RES_cantidad, RES_fecha'), 'medica_registromv.NotaSuministros.*')
		// 				->join('items', 'reservas.ITE_clave', '=', 'items.ITE_clave')
		// 				->join('almacenes', 'reservas.ALM_clave', '=', 'almacenes.ALM_clave')
		// 				->join('unidades', 'almacenes.UNI_clave', '=', 'unidades.UNI_clave')
		// 				->join('medica_registromv.NotaSuministros', 'medica_inventario.reservas.RES_clave', '=', 'medica_registromv.NotaSuministros.id_reserva')
		// 				->whereIn('almacenes.UNI_clave', explode(",",$unidades))
		// 				->where('reservas.ALM_clave', '<>', 43)
		// 				->orderBy('reservas.RES_clave', 'asc')
		// 				->get();
		//
		// return $porSurtir;
		/*  EN MISMO SERVIDOR */

		$porSurtir = DatosIniciales::porSurtir($unidades);

		foreach ($porSurtir as $item) {
			$respuesta[] = array( 'RES_clave'		=> $item->RES_clave,
								'ITE_codigo'		=> $item->ITE_codigo,
								'ITE_nombre'		=> $item->ITE_nombre,
								'ALM_nombre'		=> $item->ALM_nombre,
								'UNI_nombrecorto'	=> $item->UNI_nombrecorto,
								'RES_cantidad'		=> $item->RES_cantidad,
								'RES_fecha'			=> $item->RES_fecha,
								'receta'			=> DB::connection('mv')->table('NotaSuministros')->where('id_reserva', $item->RES_clave)->first()
														);
		}
		return $respuesta;

	}

	public function ordenesAbiertas($unidades){

		$select = 'OCM_clave as id,
				   OCM_fechaReg as AltaOrden,
				   ordenCompra.PRO_clave,
				   OCM_fechaSurtida as SurtidaOrden,
				   USU_creo as UsuarioCreo,
				   usuarios.USU_nombrecompleto,
				   ordenCompra.UNI_clave,
				   UNI_nombrecorto,
				   usurtio.USU_login as UsuarioSurtio,
				   PRO_nombrecorto,
				   OCM_importeEsperado,
				   CASE
					WHEN OCM_cancelada = 1 THEN "Cancelada"
					WHEN OCM_cerrada = 1 THEN "Cerrada"
					WHEN OCM_surtida = 1 AND OCM_incompleta = 1 AND OCM_cerrada = 0 THEN "Incompleta"
					ELSE "Abierta"
				   END as Estatus';

		$ordAbiertas = OrdenCompra::join('usuarios', 'ordenCompra.USU_creo', '=', 'usuarios.USU_clave')
							->join('unidades', 'ordenCompra.UNI_clave', '=', 'unidades.UNI_clave')
							->join('proveedores', 'ordenCompra.PRO_clave', '=', 'proveedores.PRO_clave')
							->leftJoin('usuarios as usurtio', 'ordenCompra.USU_surtio', '=', 'usurtio.USU_clave')
							->select(DB::raw($select))
							->where('OCM_cerrada',0)
							->where('OCM_cancelada',0)
							->whereIn('ordenCompra.UNI_clave', explode(",",$unidades))
							->get();
		return $ordAbiertas;
	}

	public function usuarioUnidades( $usuario ){
		$datosUsr =  DB::table('usuarios')
									 ->select('USU_clave', 'USU_login', 'PER_clave')
									 ->where('USU_login', $usuario)
									 ->where('USU_activo', DB::raw('1'))
									 ->get();

		if ( sizeof( $datosUsr ) ) {
			$almacenes = DB::table('usuarioAlmacen')
										 ->select('usuarioAlmacen.ALM_clave', 'UNI_clave')
										 ->where('USU_clave', $datosUsr[0]->USU_clave)
										 ->join('almacenes', 'usuarioAlmacen.ALM_clave', '=', 'almacenes.ALM_clave')
										 ->get();

			$unidades = array();
			$usrAlmacenes = array();

			for ($i=0; $i < sizeof($almacenes) ; $i++) {
				$usrAlmacenes[] = $almacenes[$i]->ALM_clave;
				$unidades[] = $almacenes[$i]->UNI_clave;
			}

			// $usrUnidades = DB::table('unidades')
			// 								 ->select('UNI_clave')
			// 								 ->whereIn('UNI_clave', $unidades)
			// 								 ->get();
			// return array($usrAlmacenes, $usrUnidades);
			return array($usrAlmacenes, $unidades);
		} else {
			return 'error';
		}
	}

	public function alertaCaducidades( $unidad=null ){
		$dias = 30;

		if ( !$unidad ) {
			//AQUI VAMOS A TOMAR TODAS LAS UNIDADES EXCEPTO LAS DE PRUEBA (8, 12)
			$unidades = Unidad::select('UNI_nombreCorto', 'UNI_claveMV', 'UNI_clave')->whereNotIn('UNI_clave', array(8,12))->get();

			$unidadesArr = array();
			$porCaducarUni = array();
			foreach ($unidades as $unidad) {
				$unidadesArr[] = $unidad->UNI_clave;

				// resumen por clinica
				$porCaducarGeneral[] = array('unidad' 	=> $unidad->UNI_nombreCorto,
										  	 'datos'	=> DatosIniciales::porCaducar( [$unidad->UNI_clave], $dias )
										);
				//generamos la vista
				// return View::make('emails.alerta-proxima-caducidad', ['datos' => $porCaducarGeneral, 'dias' => $dias]);
				
				
			}

			return $porCaducarGeneral;

			// $porCaducarGeneral[] = DatosIniciales::porCaducar( $unidadesArr, $dias );

			// return $porCaducarGeneral;
			//resumen general
			// $porCaducar = DatosIniciales::porCaducar( $unidadesArr, $dias );
		} else {
			$porCaducar = DatosIniciales::porCaducar( $unidad, $dias );
			return View::make('emails.alerta-proxima-caducidad', ['datos' => $porCaducarGeneral, 'dias' => $dias]);
		}

		// return sizeof($porCaducar);
		// return $porCaducar;
		return View::make('emails.alerta-proxima-caducidad', ['datos' => $porCaducarGeneral, 'dias' => $dias]);
	}


	public function alertaRecetas( $unidad=null ){

		if( date('G') != 6 ) return 'Not Allowed';

		if ( !$unidad ) {
			$unidades = Unidad::select('UNI_nombreCorto', 'UNI_claveMV', 'UNI_clave', 'UNI_correo')
							  ->whereNotIn('UNI_clave', array(8,12))
							  ->get();
			
			$resultadosArr = array();
			$acumuladoRecetas = 0;

			//obtenemos todas las recetas por unidad
			foreach ($unidades as $unidad) {
				$url = 'http://medicavial.net/mvnuevo/api/notaMedica.php?funcion=listadoRecetasSinSurtir&uni='.$unidad->UNI_claveMV;
				$respUrl = file_get_contents($url);
				$resJSON = json_decode($respUrl, true);

				$acumuladoRecetas += sizeof($resJSON);
				$resultadosArr[] = array( 'UNI_clave' 		=> $unidad->UNI_clave,
										  'UNI_claveMV' 	=> $unidad->UNI_claveMV,
										  'UNI_nombreCorto'	=> $unidad->UNI_nombreCorto,
										  'UNI_correo'		=> $unidad->UNI_correo,
										  'cantidadRecetas' => sizeof($resJSON),
										  'recetas'			=> $resJSON );
			}
		} else {
			$datosUnidad = Unidad::select('UNI_nombreCorto', 'UNI_claveMV', 'UNI_clave', 'UNI_correo')->where('UNI_claveMV', '=', $unidad)->get();

			$url = 'http://medicavial.net/mvnuevo/api/notaMedica.php?funcion=listadoRecetasSinSurtir&uni='.$unidad;
			$respUrl = file_get_contents($url);
			$resJSON = json_decode($respUrl, true);

			$resultadosArr[] = array( 'UNI_clave' 		=> $datosUnidad[0]->UNI_clave,
									  'UNI_claveMV' 	=> $datosUnidad[0]->UNI_claveMV,
									  'UNI_nombreCorto'	=> $datosUnidad[0]->UNI_nombreCorto,
									  'UNI_correo'		=> $datosUnidad[0]->UNI_correo,
									  'cantidadRecetas'	=> sizeof($resJSON),
									  'recetas'			=> $resJSON );
		}

		// return $resultadosArr;
		// return $acumuladoRecetas;
		// return DatosIniciales::correoRecetas( $resultadosArr, true );

		$envíos = array();

		//enviamos resumen a los ejecutivos solo si hay recetas pendientes
		if( $acumuladoRecetas > 0 ) $envio[] = DatosIniciales::correoRecetas( $resultadosArr, true );

		// enviamos a los administradores solo si hay recetas pendientes
		if( $acumuladoRecetas > 0 ) $envio[] = DatosIniciales::correoRecetas( $resultadosArr );

		//enviamos a cada una de las clinicas
		foreach ( $resultadosArr as $clinica ){
			if( $clinica['cantidadRecetas'] > 0 ){
				$envio[] = DatosIniciales::correoRecetas( [$clinica] );
			}else{
				$envio[] = $clinica['UNI_nombreCorto'].' NO';
			}
		}

		return $envio;
	}


	private function correoRecetas( $data, $resumen = null ){
		// return View::make('emails.alertaRecetas', ['datos' => $data, 'resumen' => $resumen]);
		$emails = array( 'clinica' 			=> $data[0]['UNI_correo'],
						 'administradores'	=> ['mrangel@medicavial.com.mx', 
						 						'coordenf@medicavial.com.mx', 
												'scisneros@medicavial.com.mx', 
												'alozano@medicavial.com.mx', 
												'mvcompras@medicavial.com.mx'],
						 'directivos'		=> ['jabraham@medicavial.com.mx', 
						 						'jsanchez@medicavial.com.mx', 
												'alozano@medicavial.com.mx',
												'agutierrez@medicavial.com.mx'] );

		try {
			Mail::send('emails.alertaRecetas', ['datos' => $data, 'resumen' => $resumen], function($message) use($data, $emails, $resumen)
			{
				$message->from('mvcompras@medicavial.com.mx', 'Sistema de Inventario MédicaVial');

				//asunto del correo para clinicas
				if( sizeof($data)==1 ) $message->subject('Recetas pendientes '.$data[0]['UNI_nombreCorto']);
				
				// asunto del correo para administradores
				if( sizeof($data)>1 ) $message->subject('Listado general de recetas pendientes');
				
				// asunto del correo para directivos
				if( sizeof($data)>1 && $resumen ) $message->subject('Resumen de recetas pendientes');


				// destinatarios
				if( sizeof( $data ) == 1 ) 				$message->to( $emails['clinica'] );
				if( sizeof( $data ) > 1 ) 				$message->to( $emails['administradores'] );
				if( sizeof( $data ) > 1 && $resumen )	$message->to( $emails['directivos'] );


				// $message->cc(array('mvcompras@medicavial.com.mx','auxcompras@medicavial.com.mx'));
				$message->bcc('sramirez@medicavial.com.mx');
			});
		} catch (Exception $e) {
			return $e;
		}

		if( sizeof($data)==1 ) return $emails['clinica'];
		if( sizeof($data)>1 ) return $emails['administradores'];
		if( sizeof($data)>1 && $resumen ) return $emails['directivos'];

	}

}
