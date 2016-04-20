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

	public function itemAlmacen($almacen,$item){

		return Existencia::join('items', 'existencias.ITE_clave', '=', 'items.ITE_clave')
	                     ->select('ITE_nombre','EXI_cantidad','EXI_ultimoMovimiento', 'existencias.updated_at','existencias.ITE_clave','EXI_clave')
	                     ->where('ALM_clave',$almacen)
	                     ->where('existencias.ITE_clave',$item)
	                     ->first();
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

	public function existenciasUnidad($unidad,$tipo){
		
		if ($tipo == 1) {
			$sql = 'existencias.ALM_clave as almacen,EXI_clave as id,items.ITE_clave as Clave_producto, CONCAT(ITE_nombre, " ( " ,ITE_sustancia," ",ITE_presentacion," )") as Descripcion,PRE_nombre as presentacion,EXI_cantidad  - IFNULL( (select SUM(RES_cantidad) from reservas where ALM_clave = existencias.ALM_clave and ITE_clave = existencias.ITE_clave GROUP BY ITE_clave ) , 0 ) as Stock,ITE_posologia as posologia, ITE_cantidadCaja as Caja';
		}else{
			$sql = 'existencias.ALM_clave as almacen,EXI_clave as id,items.ITE_clave as Clave_producto, ITE_nombre as Descripcion,PRE_nombre as presentacion,EXI_cantidad  - IFNULL( (select SUM(RES_cantidad) from reservas where ALM_clave = existencias.ALM_clave and ITE_clave = existencias.ITE_clave GROUP BY ITE_clave ) , 0 ) as Stock,ITE_posologia as posologia, ITE_cantidadCaja as Caja';
		}

		return Existencia::join('items', 'existencias.ITE_clave', '=', 'items.ITE_clave')
	                     ->join('almacenes', 'existencias.ALM_clave', '=', 'almacenes.ALM_clave')
	                     ->join('unidades', 'almacenes.UNI_clave', '=', 'unidades.UNI_clave')
	                     ->join('presentaciones', 'items.PRE_clave', '=', 'presentaciones.PRE_clave')
	                     ->select(DB::raw($sql))
	                     ->groupBy('existencias.ITE_clave')
	                     ->where('almacenes.UNI_clave', $unidad)
	                     // este condicional solo filtra el botiquin 
	                     ->where('almacenes.TAL_clave', 2)
	                     ->where('items.TIT_clave', $tipo)
	                     ->get();
		
	}

	public function lote($lote){

        return Lote::where('LOT_numero',$lote)->first();
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

	public function receta($id){

		//obtenemos la receta de la base de MV
		$datos = Receta::where('id_receta',$id)->where('NS_surtida',0)->get();
		$respuesta = array();


		//recorremos item por item de la receta para obtener los datos del item en inventario
		foreach ($datos as $dato) {

			$item = $dato['id_item'];

			//buscamos el item y con esto decimo si sera editable en caso de ser ortesis
			$valoresItem = Item::find($item);
			$modificable = $valoresItem->ITE_talla;
			$familia = $valoresItem->TIT_clave;
			$caja = $valoresItem->ITE_cantidadCaja;
			
			$respuesta[] = array(
				'receta' => $dato['NS_id'],
				'item' => $item,
				'familia' => $familia,
				'cantidad' => $dato['NS_cantidad'],
				'caja' => $caja,
				'editable' => $modificable,
				'existencia' => $dato['id_existencia'],
				'reserva' => $dato['id_reserva'],
				'almacen' => $dato['id_almacen'],
				'surtido' => false,
				'lote' => ''
			);
			
		}

		return $respuesta;
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
