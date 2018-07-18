<?php

class BusquedasController extends BaseController {

	public function almacenes(){
		return Almacen::unidades();
	}

	public function almacenesUsuario($usuario){
		return Almacen::existencia($usuario);
	}


	//consulta los almacenes que tiene el usuario disponibles para ver
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
                     ->orderBy('ALM_nombre')
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

	public function itemsAgranel(){
		return Item::join('tiposItem','items.TIT_clave','=','tiposItem.TIT_clave')
					 ->where( array('ITE_activo'=> true,'ITE_agranel'=> true) )
                     ->orderBy('ITE_nombre')
                     ->get();
	}

	public function itemsAlmacen($almacen){
		return Existencia::items($almacen);
	}

	public function itemsProveedor(){
		return Item::proveedor();
	}

	public function itemsReceta(){
		return Item::Join('tiposItem','items.TIT_clave', '=' ,'tiposItem.TIT_clave')
        			 ->Join('subTiposItem','items.STI_clave', '=' ,'subTiposItem.STI_clave')
        			 ->where('ITE_receta',1)->get();
	}

	public function itemsRecetaExistentes($id){
		return Movimiento::where('id_receta',$id)->get();
	}

	public function existencias($usuario){

		return Existencia::usuario($usuario);

	}

	public function existenciasUnidad($unidad,$tipo){

		if ($tipo == 1) {
			$sql = 'existencias.ALM_clave as almacen,EXI_clave as id,items.ITE_clave as Clave_producto, CONCAT(ITE_nombre, " ( " ,ITE_sustancia," ",ITE_presentacion," )") as Descripcion,PRE_nombre as presentacion,EXI_cantidad  - IFNULL( (select SUM(RES_cantidad) from reservas where ALM_clave = existencias.ALM_clave and ITE_clave = existencias.ITE_clave GROUP BY ITE_clave ) , 0 ) as Stock,ITE_posologia as posologia, ITE_cantidadCaja as Caja,ITE_noSegmentableReceta as segmentable, CONCAT(1) as tipoItem';
		}elseif($tipo == 2){
			$sql = 'existencias.ALM_clave as almacen,EXI_clave as id,items.ITE_clave as Clave_producto, ITE_nombre as Descripcion,PRE_nombre as presentacion,EXI_cantidad  - IFNULL( (select SUM(RES_cantidad) from reservas where ALM_clave = existencias.ALM_clave and ITE_clave = existencias.ITE_clave GROUP BY ITE_clave ) , 0 ) as Stock,ITE_posologia as posologia, ITE_cantidadCaja as Caja,ITE_noSegmentableReceta as segmentable, CONCAT(2) as tipoItem';
		}

		return Existencia::join('items', 'existencias.ITE_clave', '=', 'items.ITE_clave')
	                     ->join('almacenes', 'existencias.ALM_clave', '=', 'almacenes.ALM_clave')
	                     ->join('unidades', 'almacenes.UNI_clave', '=', 'unidades.UNI_clave')
	                     ->join('presentaciones', 'items.PRE_clave', '=', 'presentaciones.PRE_clave')
	                     ->select(DB::raw($sql))
	                     ->groupBy('existencias.ITE_clave')
	                     ->where('unidades.UNI_claveMV', $unidad)
	                     // este condicional solo filtra el botiquin
	                     ->where('almacenes.TAL_clave', 2)
	                     ->where('items.TIT_clave', $tipo)
	                     ->orderBy('Descripcion')
	                     ->get();

	}

	public function existenciasCortaEstancia($unidad){
		$sql='existencias.ALM_clave as almacen,EXI_clave as id,items.ITE_clave as Clave_producto, ITE_nombre as Descripcion, TIT_clave as tipoItem, PRE_nombre as presentacion,EXI_cantidad  - IFNULL( (select SUM(RES_cantidad) from reservas where ALM_clave = existencias.ALM_clave and ITE_clave = existencias.ITE_clave GROUP BY ITE_clave ) , 0 ) as Stock,ITE_posologia as posologia, ITE_cantidadCaja as Caja,ITE_noSegmentableReceta as segmentable, almacenes.TAL_clave';

		$listado = Existencia::join('items', 'existencias.ITE_clave', '=', 'items.ITE_clave')
                 ->join('almacenes', 'existencias.ALM_clave', '=', 'almacenes.ALM_clave')
                 ->join('unidades', 'almacenes.UNI_clave', '=', 'unidades.UNI_clave')
                 ->join('presentaciones', 'items.PRE_clave', '=', 'presentaciones.PRE_clave')
                 ->select(DB::raw($sql))
                 ->where('unidades.UNI_claveMV', $unidad)
                 // ->where('almacenes.TAL_clave', 4)// este condicional solo filtra el botiquin
                 ->whereRaw('(
                 				(almacenes.TAL_clave = 4)
                 				or
                 				(almacenes.TAL_clave = 2 and items.TIT_clave = 2)
                 				or
                 				(almacenes.TAL_clave = 2 and items.ITE_codigo in ("MED0004", "MED0014", "MED0017", "MED0024", "MED0048", "MED0050", "MED0091","MEDP001",
																				  "CUR0018", "CUR0019", "CUR0020", "CUR0042", "CUR0043", "CUR0044", "CUR0045", "CUR0046",
																				  "CUR0047", "CUR0048", "CUR0049", "CUR0052", "CUR0053", "CUR0054", "CUR0055", "CUR0056",
																				  "CUR0057", "CUR0059", "CUR0060", "CUR0061", "CUR0062", "CUR0063"
																				  ))
                 			)')
                 // ->groupBy('existencias.ITE_clave') //esto está dando problemas
                 ->orderBy('ITE_nombre')
                 ->get();

        for ($i=0; $i <sizeof($listado) ; $i++) {
        	if ( $listado[$i]->Stock == 0 ) {
        		// unset($listado[$i]);
        		$listado[$i]->Descripcion = 'SIN EXISTENCIA '.$listado[$i]->Descripcion;
        		$listado[$i]->Clave_producto = -1;
        	}
        }

        return $listado;

		// return DB::select(DB::raw('select existencias.ALM_clave as almacen, EXI_clave as id, items.ITE_clave as Clave_producto, ITE_nombre as Descripcion, TIT_clave as tipoItem, PRE_nombre as presentacion,
		// 							EXI_cantidad - IFNULL( (select SUM(RES_cantidad) from reservas where ALM_clave = existencias.ALM_clave and ITE_clave = existencias.ITE_clave GROUP BY ITE_clave ) , 0 ) as Stock,
		// 							ITE_posologia as posologia, ITE_cantidadCaja as Caja, ITE_noSegmentableReceta as segmentable
		// 							from existencias
		// 							inner join almacenes on existencias.ALM_clave = almacenes.ALM_clave
		// 							inner join unidades on almacenes.UNI_clave = unidades.UNI_clave
		// 							inner join items on existencias.ITE_clave = items.ITE_clave
		// 							inner join presentaciones on items.PRE_clave = presentaciones.PRE_clave
		// 							where unidades.UNI_claveMV = '.$unidad.'
		// 							and almacenes.TAL_clave=4
		// 							group by existencias.ITE_clave
		// 							order by ITE_nombre asc'));
	}

	public function existenciasParticulares($unidad){
		$sql='existencias.ALM_clave as almacen,EXI_clave as id,items.ITE_clave as Clave_producto, ITE_nombre as Descripcion,PRE_nombre as presentacion,EXI_cantidad  - IFNULL( (select SUM(RES_cantidad) from reservas where ALM_clave = existencias.ALM_clave and ITE_clave = existencias.ITE_clave GROUP BY ITE_clave ) , 0 ) as Stock,ITE_posologia as posologia, ITE_cantidadCaja as Caja,ITE_noSegmentableReceta as segmentable, items.TIT_clave as tipoItem';

		return Existencia::join('items', 'existencias.ITE_clave', '=', 'items.ITE_clave')
                 ->join('almacenes', 'existencias.ALM_clave', '=', 'almacenes.ALM_clave')
                 ->join('unidades', 'almacenes.UNI_clave', '=', 'unidades.UNI_clave')
                 ->join('presentaciones', 'items.PRE_clave', '=', 'presentaciones.PRE_clave')
                 ->select(DB::raw($sql))
                 ->groupBy('existencias.ITE_clave')
                 ->where('unidades.UNI_claveMV', $unidad)
                 // traemos del almacen particulares y ortesis del almacen 'botiquin'
                 ->whereRaw('(
                 				(almacenes.TAL_clave = 5)
                 				or
                 				(almacenes.TAL_clave = 2 and items.TIT_clave = 2)
                 				or
                 				(almacenes.TAL_clave = 2 and items.ITE_codigo in ("MED0004", "MED0014", "MED0017", "MED0024", "MED0048", "MED0050", "MED0091","MEDP001",
																				  "CUR0018", "CUR0019", "CUR0020", "CUR0042", "CUR0043", "CUR0044", "CUR0045", "CUR0046",
																				  "CUR0047", "CUR0048", "CUR0049", "CUR0052", "CUR0053", "CUR0054", "CUR0055", "CUR0056",
																				  "CUR0057"))
                 			)')
	             // ->orWhere(function($query)
	             // {
	             //    $query->where('almacenes.TAL_clave', 2)
	             //          ->where('items.TIT_clave', 2);
	             // })
                 // ->where('items.TIT_clave', $tipo)
                 ->orderBy('ITE_nombre', 'asc')
                 ->get();
	}

	public function lote($lote){

        return Lote::where('LOT_numero',$lote)->first();
	}

	public function lotesAlmacenXitem($almacen,$item){
		$clave = Existencia::where( array('ITE_clave'=>$item,'ALM_clave'=>$almacen) )->first()->EXI_clave;

		return Lote::where( array('EXI_clave'=>$clave,'ITE_clave' => $item) )->where('LOT_cantidad','>',0)->get();
	}

	public function lotesUnidadXitem($unidad,$item){

		return Lote::join('existencias','existencias.EXI_clave','=','lote.EXI_clave')
					 ->join('almacenes','almacenes.ALM_clave','=','existencias.ALM_clave')
					 ->where('UNI_clave',$unidad)
					 ->where('lote.ITE_clave',$item)
					 ->where('TAL_clave',1)
					 ->where('LOT_cantidad','>',0)
					 ->select('lote.*')
					 ->get();
	}

	public function movimientos(){

        return Movimiento::todos();

	}

	public function movimientosAgranel(){

        return Movimiento::agranel();
	}

	public function ordenescompra($unidades){

				return OrdenCompra::todos($unidades);
	}

	public function ordencompra($id){

		$orden = array();
		$dato = OrdenCompra::busca($id);

		// foreach ($datos as $dato) {

		$items = OrdenItem::orden($id);

		$orden = array(
			'OCM_clave' => $dato->OCM_clave,
			'OCM_surtida' => $dato->OCM_surtida,
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
		// $datosReceta = Receta::find($id);
		$datosReceta = Receta::where('id_receta',$id)
								->select( DB::raw('RecetaMedica.*, TIR_nombre, IF((RM_fecreg + INTERVAL 30 MINUTE<now()) , concat(1), concat(0)) as tardio'))
								->join('TipoReceta', 'RecetaMedica.tipo_receta', '=', 'TipoReceta.TIR_id')
								->get();
		$datosReceta = $datosReceta[0];
		// return $datosReceta;

		// $lesionado = ExpedienteWeb::find($datosReceta->Exp_folio)->Exp_completo;
		$lesionado = ExpedienteWeb::find($datosReceta->Exp_folio);
		$datos = Suministros::where('id_receta',$id)->where('NS_surtida',0)->where('NS_cancelado',0)->get();
		$items = array();

		//recorremos item por item de la receta para obtener los datos del item en inventario
		foreach ($datos as $dato) {

			$item = $dato['id_item'];

			//buscamos el item y con esto decimo si sera editable en caso de ser ortesis
			$valoresItem = Item::find($item);
			$modificable = $valoresItem->ITE_talla;
			$familia = $valoresItem->TIT_clave;
			$segmentable = $valoresItem->ITE_segmentable;
			$segmentableReceta = $valoresItem->ITE_noSegmentableReceta;
			$caja = $valoresItem->ITE_cantidadCaja;

			$forzoso = TipoItem::find($familia)->TIT_forzoso;

			if ($segmentable == 1 && $segmentableReceta == 0) {
				$cantidad = $dato['NS_cantidad'] * $caja;
			}else{
				$cantidad = $dato['NS_cantidad'];
			}

			$items[] = array(
				'receta' => $id,
				'recetaItem' => $dato['NS_id'],
				'item' => $item,
				'forzoso' => $forzoso,
				'familia' => $familia,
				'cantidad' => $cantidad,
				'caja' => 0,
				'editable' => $modificable,
				'existencia' => $dato['id_existencia'],
				'reserva' => $dato['id_reserva'],
				'almacen' => $dato['id_almacen'],
				'surtido' => false,
				'lote' => ''
			);

		}

		$uniMV = $lesionado->Uni_ClaveActual;
		$uniInventario = Unidad::where('UNI_claveMV', $uniMV)->get();

		if ( sizeof($uniInventario) > 0 ) {
			$claveUnidad = $uniInventario[0]['UNI_clave'];
			$nombreUnidad = $uniInventario[0]['UNI_nombrecorto'];
		} else{
			$claveUnidad = -1;
			$nombreUnidad = ' [EL PACIENTE FUE TRASLADADO A OTRA UNIDAD] ';
		}

		$respuesta = array(
			'receta' 		=> $id,
			'fecha' 		=> $datosReceta->RM_fecreg,
			'tardio' 		=> $datosReceta->tardio,
			'folio' 		=> $datosReceta->Exp_folio,
			'tipo' 			=> $datosReceta->TIR_nombre,
			'lesionado' => $lesionado->Exp_completo,
			// 'unidad' 	=> $uniInventario[0]['UNI_clave'],
			// 'uniNombre' => $uniInventario[0]['UNI_nombrecorto'],
			'unidad' 		=> $claveUnidad,
			'uniNombre' => $nombreUnidad,
			'items' 		=> $items,
			'recetaInf'	=> $datosReceta
		);

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

	public function unidadesUsuario($id){
		return UsuarioAlmacen::join('almacenes','almacenes.ALM_clave','=','usuarioAlmacen.ALM_clave')
							 ->join('unidades','almacenes.UNI_clave','=','unidades.UNI_clave')
							 ->where( array('UNI_activo' => true ,'USU_clave' => $id ) )
							 ->select('unidades.*')
							 ->groupBy('almacenes.UNI_clave')
							 ->orderBy('almacenes.ALM_nombre')
							 ->get();
	}

	public function unidadesItem(){
		return UnidadItem::activos();
	}


}
