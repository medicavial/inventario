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



	public function porCaducar($unidades) {

		// $porCaducar = DB::table('existencias')
		// ->select(DB::raw('existencias.EXI_clave, existencias.ITE_clave, items.ITE_nombre, items.ITE_codigo ,existencias.ALM_clave, almacenes.ALM_nombre, existencias.EXI_cantidad,
		// 					unidades.UNI_nombrecorto, lote.LOT_clave, lote.EXI_clave, lote.LOT_numero, lote.LOT_cantidad, lote.LOT_caducidad'))
		$porCaducar = DB::table('lote')
						->select(DB::raw('existencias.EXI_clave, existencias.ITE_clave, items.ITE_nombre, items.ITE_codigo ,existencias.ALM_clave, almacenes.ALM_nombre, existencias.EXI_cantidad,
											unidades.UNI_nombrecorto, lote.LOT_clave, lote.EXI_clave, lote.LOT_numero, lote.LOT_cantidad, lote.LOT_caducidad'))
						->join('existencias', 'lote.ITE_clave', '=', 'existencias.ITE_clave')
						->join('items', 'existencias.ITE_clave', '=', 'items.ITE_clave')
						->join('almacenes', 'existencias.ALM_clave', '=', 'almacenes.ALM_clave')
						->join('unidades', 'almacenes.UNI_clave', '=', 'unidades.UNI_clave')
						->where('lote.LOT_cantidad', '>', 0)
						->where('EXI_cantidad', '>', 0)
						->where('existencias.ALM_clave', '<>', 43)
						->where('LOT_caducidad', '<>', '0000-00-00 00:00:00')
						// ->where('LOT_caducidad', '>=', DB::raw('DATE(DATE_SUB(NOW(), INTERVAL 7 DAY))'))
						->where('LOT_caducidad', '>=', DB::raw('NOW()'))
						->where('LOT_caducidad', '<=', DB::raw('DATE(DATE_ADD(NOW(), INTERVAL 30 DAY))'))
						->whereIn('almacenes.UNI_clave', explode(",",$unidades))
						->orderBy('LOT_caducidad', 'asc')
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

		$porSurtir = DatosIniciales::porSurtir($unidades);

		foreach ($porSurtir as $item) {
			$respuesta[] = array( 'RES_clave'				=> $item->RES_clave,
														'ITE_codigo'			=> $item->ITE_codigo,
														'ITE_nombre'			=> $item->ITE_nombre,
														'ALM_nombre'			=> $item->ALM_nombre,
														'UNI_nombrecorto'	=> $item->UNI_nombrecorto,
														'RES_cantidad'		=> $item->RES_cantidad,
														'RES_fecha'				=> $item->RES_fecha,
														'receta'					=> DB::connection('mv')->table('NotaSuministros')->where('id_reserva', $item->RES_clave)->first()
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

}
