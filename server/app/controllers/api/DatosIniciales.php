<?php

class DatosIniciales extends \BaseController {

	public function index($unidades) {
		$ordenes =  OrdenCompra::todos($unidades);
		
		$items = Item::todos();

		$porCaducar = DatosIniciales::porCaducar($unidades);

		$porSurtir = DatosIniciales::porSurtir($unidades);

		return array(
					 'itemsTotal' 	=> sizeof($items),
					 'ordenes'		=> sizeof($ordenes),
					 'porCaducar'	=> sizeof($porCaducar), 
					 'porSurtir'	=> sizeof($porSurtir)
				);

	}



	public function porCaducar($unidades) {

		$porCaducar = DB::table('existencias')
						->select(DB::raw('existencias.EXI_clave, existencias.ITE_clave, items.ITE_nombre, items.ITE_codigo ,existencias.ALM_clave, almacenes.ALM_nombre, existencias.EXI_cantidad,
											unidades.UNI_nombrecorto, lote.LOT_clave, lote.EXI_clave, lote.LOT_numero, lote.LOT_cantidad, lote.LOT_caducidad'))
						->join('lote', 'existencias.ITE_clave', '=', 'lote.ITE_clave')
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
						->select(DB::raw('reservas.RES_clave, items.ITE_codigo, items.ITE_nombre, almacenes.ALM_nombre, unidades.UNI_nombrecorto, reservas.RES_cantidad'))
						->join('items', 'reservas.ITE_clave', '=', 'items.ITE_clave')
						->join('almacenes', 'reservas.ALM_clave', '=', 'almacenes.ALM_clave')
						->join('unidades', 'almacenes.UNI_clave', '=', 'unidades.UNI_clave')
						->whereIn('almacenes.UNI_clave', explode(",",$unidades))
						->where('reservas.ALM_clave', '<>', 43)
						->orderBy('reservas.RES_clave', 'asc')
						->get();

		return $porSurtir;
	}

}
