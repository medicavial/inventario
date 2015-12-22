<?php

class BusquedasController extends BaseController {

	public function almacenes(){
		return Almacen::unidades();
	}

	public function almacenesUsuario($usuario){
		return Almacen::existencia($usuario);
	}

	public function almacenUsuario($usuario){

		$almacenes = array();
		$datos = UsuarioAlmacen::where('USU_clave',$usuario)->get();

		foreach ($datos as $dato){
			array_push($almacenes, $dato->ALM_clave);
		}
        return Almacen::join('unidades', 'almacenes.UNI_clave', '=', 'unidades.UNI_clave')
                     ->join('tiposAlmacen', 'almacenes.TAL_clave', '=', 'tiposAlmacen.TAL_clave')
                     ->select('almacenes.*','unidades.UNI_nombre','TAL_nombre')
                     ->whereNotIn('ALM_clave', $almacenes)
                     ->where('ALM_activo',true)
                     ->get();
	}


	public function almacenesUnidad($unidad){

		return Almacen::unidad($unidad);
		
	}

	public function itemUnidad($item,$unidad){
		return Item::unidad($item,$unidad);
	}

	public function items(){
		return Item::activos();
	}

	public function itemsAlmacen($almacen){
		return Existencia::items($almacen);
	}

	public function itemsProveedor(){
		return Item::proveedor();
	}

	public function existencias($usuario){
		
		return Existencia::usuario($usuario);
		
	}

	public function movimientos(){

        return Movimiento::todos();
	}

	public function ordenescompra(){
		return OrdenCompra::todos();
	}

	public function ordencompra($id){

		$orden = array();
		$dato = OrdenCompra::busca($id);

		// foreach ($datos as $dato) {

		$items = OrdenItem::orden($id);

		$orden = array(
			'OCM_clave' => $dato->OCM_clave,
			'PRO_clave' => $dato->PRO_clave,
			'PRO_nombrecorto' => $dato->PRO_nombrecorto,
			'PRO_nombre' => $dato->PRO_nombre,
			'PRO_rfc' => $dato->PRO_rfc,
			'PRO_razonSocial' => $dato->PRO_razonSocial,
			'PRO_correo' => $dato->PRO_correo,
			'TOR_nombre' => $dato->TOR_nombre,
			'USU_nombrecompleto' => $dato->USU_nombrecompleto,
			'OCM_fechaReg' => $dato->OCM_fechaReg,
			'OCM_almacenes' => explode(',', $dato->OCM_almacenes),
			'UNI_clave' => $dato->UNI_clave,
			'UNI_nombre' => $dato->UNI_nombre,
			'UNI_responsable' => $dato->UNI_responsable,
			'UNI_horaentrega' => $dato->UNI_horaentrega,
			'UNI_direccion' => $dato->UNI_direccion,
			'OCM_cerrada' => $dato->OCM_cerrada,
			'OCM_fechaCerrada' => $dato->OCM_fechaCerrada,
			'OCM_cancelada' => $dato->OCM_cancelada,
			'OCM_fechaCancelacion' => $dato->OCM_fechaCancelacion,
			'OCM_motivo' => $dato->OCM_motivo,
			'OCM_importeEsperado' => $dato->OCM_importeEsperado,
			'OCM_importeFinal' => $dato->OCM_importeFinal,
			'OCM_pagada' => $dato->OCM_pagada,
			'OCM_fechaPagada' => $dato->OCM_fechapagado,
			'items' => $items
	    );
		    
		// }

		return $orden;
	}

	public function permisos(){
		return Permiso::activos();
	}

	public function presentaciones(){
		return Presentacion::activos();
	}

	public function proveedores(){
		return Proveedor::activos();
	}

	public function subtipositem(){
		return SubTipoItem::activos();
	}

	public function tiposAjuste(){
		return TipoAjuste::activos();
	}

	public function tiposalmacen(){
		return TipoAlmacen::activos();
	}

	public function tipositem(){
		return TipoItem::activos();
	}

	public function tiposMovimiento(){
		return TipoMovimiento::activos();
	}

	public function usuarios(){
		return User::activos();
	}

	public function unidades(){
		return Unidad::activos();
	}

	public function unidadesItem(){
		return UnidadItem::activos();
	}

}
