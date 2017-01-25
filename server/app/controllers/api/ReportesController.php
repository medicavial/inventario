<?php


class ReportesController extends BaseController {

	public function existencias(){

		$query = Existencia::query();

        $query->join('items', 'existencias.ITE_clave', '=', 'items.ITE_clave')
    			->join('tiposItem', 'items.TIT_clave', '=', 'tiposItem.TIT_clave')
				->join('almacenes', 'existencias.ALM_clave', '=', 'almacenes.ALM_clave')
				->join('unidades', 'almacenes.UNI_clave', '=', 'unidades.UNI_clave')
				->select('ITE_codigo','ITE_nombre','items.ITE_clave','almacenes.UNI_clave','almacenes.ALM_nombre','EXI_cantidad','EXI_ultimoMovimiento','UNI_nombrecorto','almacenes.ALM_clave','TIT_nombre','ITE_precioventa','existencias.EXI_clave')
				->where('EXI_cantidad','>',0);

	 	if (Input::has('unidad')) {
	 		$query->where('almacenes.UNI_clave', Input::get('unidad') );
		}else{
			$id= Input::get('usuario');
			/*$unidades = App::make('BusquedasController')->unidadesUsuario($id);*/
			$unidades =  UsuarioAlmacen::join('almacenes','almacenes.ALM_clave','=','usuarioAlmacen.ALM_clave')
								 ->join('unidades','almacenes.UNI_clave','=','unidades.UNI_clave')
								 ->where( array('UNI_activo' => true ,'USU_clave' => $id ) )
								 ->select('unidades.UNI_clave')
								 ->groupBy('almacenes.UNI_clave')
								 ->orderBy('almacenes.ALM_nombre')
								 ->get()
								 ->toArray();
			$query->whereIn('almacenes.UNI_clave', $unidades );
		}

		if (Input::has('almacen')) {									
			$query->where('existencias.ALM_clave', Input::get('almacen') );
		}

		if (Input::has('item')) {									
			$query->where('existencias.ITE_clave', Input::get('item') );
		}

		if (Input::has('tipo')) {									
			$query->where('items.TIT_clave', Input::get('tipo') );
		}								

		return $query->get();

	}


	public function lotes(){

		
		$query = Existencia::query();

        $query->join('almacenes', 'almacenes.ALM_clave', '=', 'existencias.ALM_clave')				
    		->join('items', 'items.ITE_clave' , '=', 'existencias.ITE_clave')
			->join('tiposItem','tiposItem.TIT_clave' , '=', 'items.TIT_clave')
			->join('lote', function($join){
	            $join->on('existencias.EXI_clave', '=', 'lote.EXI_clave');
	        	$join->on('items.ITE_clave', '=', 'lote.ITE_clave');
	        })->orderBy('ITE_codigo');

		
		$query->select('ITE_codigo','ITE_nombre','ALM_nombre','EXI_cantidad','LOT_numero','LOT_cantidad','LOT_caducidad');

	 // 	if (Input::has('unidad')) {
	 // 		$query->where('almacenes.UNI_clave', Input::get('unidad') );
		// }

		if (Input::has('almacen')) {									
			$query->where('existencias.ALM_clave', Input::get('almacen') );
		}

		if (Input::has('item')) {									
			$query->where('existencias.ITE_clave', Input::get('item') );
		}								

		if (Input::has('tipo')) {									
			$query->where('items.TIT_clave', Input::get('tipo') );
		}
		return $query->get();

	}

	public function lotesAvanzado(){

		$resultado = array();

		$datos = $this->existencias();

		foreach ($datos as $dato) {
			$lotes = Lote::where('EXI_clave',$dato['EXI_clave'])->get();
			$dato['lotes'] = $lotes;

			array_push($resultado, $dato);
		}

		return $resultado;

	}


	public function movimientos(){

		$query = Movimiento::query();

        $query->join('items', 'movimientos.ITE_clave', '=', 'items.ITE_clave')
				->join('almacenes', 'movimientos.ALM_clave', '=', 'almacenes.ALM_clave')
				->join('usuarios', 'movimientos.USU_clave', '=', 'usuarios.USU_clave')
				->join('tiposMovimiento', 'movimientos.TIM_clave', '=', 'tiposMovimiento.TIM_clave')
				->leftJoin('tiposAjuste', 'movimientos.TIA_clave', '=', 'tiposAjuste.TIA_clave')
				->select('ITE_codigo','ITE_nombre','ALM_nombre','USU_login','TIM_nombre', 'TIA_nombre','MOV_observaciones','MOV_cantidad','movimientos.created_at');

	 	if (Input::has('unidad')) {
	 		$query->where('UNI_clave', Input::get('unidad') );
		}

		if (Input::has('almacen')) {									
			$query->where('almacenes.ALM_clave', Input::get('almacen') );
		}

		if (Input::has('item')) {									
			$query->where('items.ITE_clave', Input::get('item') );
		}

		if (Input::has('tipo')) {									
			$query->where('items.TIT_clave', Input::get('tipo') );
		}								

		return $query->get();

	}

	public function traspasos(){
		$query = Movimiento::query();

		$fechaInicio = Input::has('fechaInicio') ? Input::get('fechaInicio') : date('Y-m-d') . ' 00:00:00';
		$fechaFinal = Input::has('fechaFinal') ? Input::get('fechaFinal') : date('Y-m-d') . ' 23:59:59';

		// $fechaInicio = date('Y-m-d') . ' 00:00:00';
		// $fechaFinal = date('Y-m-d') . ' 23:59:59';

        $query->join('items', 'movimientos.ITE_clave', '=', 'items.ITE_clave')
				->join('almacenes', 'movimientos.ALM_clave', '=', 'almacenes.ALM_clave')
				->join('usuarios', 'movimientos.USU_clave', '=', 'usuarios.USU_clave')
				->join('tiposMovimiento', 'movimientos.TIM_clave', '=', 'tiposMovimiento.TIM_clave')
				->leftJoin('tiposAjuste', 'movimientos.TIA_clave', '=', 'tiposAjuste.TIA_clave')
				->select('ITE_codigo','ITE_nombre','ALM_nombre','USU_login','TIM_nombre', 'TIA_nombre','MOV_observaciones','MOV_cantidad','movimientos.created_at')
				->where('movimientos.MOV_traspaso', 1 )
				->whereBetween('movimientos.created_at', array(Input::has('fechaInicio') ? Input::get('fechaInicio') : date('Y-m-d') . ' 00:00:00' , Input::has('fechaFinal') ? Input::get('fechaFinal') : date('Y-m-d') . ' 23:59:59'));
				// ->whereBetween('created_at', array("'".$fechaInicio."'", "'".$fechaFinal."'"));

	 	if (Input::has('unidad')) {
	 		$query->where('UNI_clave', Input::get('unidad') );
		}

		if (Input::has('almacen')) {									
			$query->where('almacenes.ALM_clave', Input::get('almacen') );
		}

		if (Input::has('item')) {									
			$query->where('items.ITE_clave', Input::get('item') );
		}

		if (Input::has('tipo')) {									
			$query->where('items.TIT_clave', Input::get('tipo') );
		}

		return $query->get();

	}

	public function items(){

		$query = Item::query();

        $query->join('tiposItem', 'items.TIT_clave', '=', 'tiposItem.TIT_clave')
                     ->join('subTiposItem', 'items.STI_clave', '=', 'subTiposItem.STI_clave')
                     ->select(DB::raw(
                 			'ITE_clave as ID_sistema,ITE_codigo as Codigo, ITE_nombre as nombre, 
							ITE_precioventa as Precio_venta, IF(ITE_segmentable = 0,"NO","SI") as Segmentable,
							ITE_cantidadtotal as Existencia,ITE_codigoean as CodigoBarras , TIT_nombre as Tipo,
							STI_nombre as Subtipo, IF(ITE_talla = 0, "NO","SI") as ConTalla,
							IF(ITE_receta = 0,"NO","SI") as Adicionable_receta'
                     	));

		return $query->get();

	}

	public function exportar($tipo){
		
		if ($tipo == 'existencias') {
			$datos = $this->existencias();
		}else if($tipo == 'items'){
			$datos = $this->items();
		}else if($tipo == 'ordenes'){
			$datos = $this->ordenes();
		}else if($tipo == 'lotes'){
			$datos = $this->lotes();
		}else if($tipo == 'movimientos'){
			$datos = $this->movimientos();
		}else if($tipo == 'traspasos'){
			$datos = $this->traspasos();
		}

		return Excel::create($tipo, function($excel) use($datos,$tipo) {

		    $excel->sheet('Datos', function($sheet) use($datos,$tipo) {

		        $sheet->fromArray($datos);

		        if ($tipo == 'existencias') {
		        	
			        $sheet->removeColumn('C',2);
			        $sheet->removeColumn('G');
			        $sheet->removeColumn('I');

			        $sheet->row(1, array(
					    'Codigo','Item','Almacen','Cantidad','Ultimo Movimiento','Unidad','Tipo Item','Precio Venta'
					));

		        }else if ($tipo == 'items'){
		        	$sheet->row(1, array(
				    	'ID_sistema','Codigo','Nombre','Precio venta','Segmentable',
				    	'Existencia','CodigoBarras','Tipo','Subtipo','ConTalla','Adicionable receta' 
					));
		        }else if ($tipo == 'ordenes'){
		        	$sheet->row(1, array(
				    	'No.','Fecha Registro','Fecha Surtida','Fecha Cancelada','usuario Alta',
				    	'Usuario Surtio','Usuario Cancelo','Ultimo Movimiento','Importe Esperado','Importe Final','Unidad','Proveedor','Estatus' 
					));
		        }else if ($tipo == 'lotes') {

			        $sheet->row(1, array(
					    'Codigo','Item','Almacen','Cantidad Almacen','Lote','Cantidad','Caducidad'
					));

		        }else if ($tipo == 'movmientos') {
		        	
			        $sheet->row(1, array(
					    'Codigo','Item','Almacen','usuario','Tipo Movimiento','Tipo Ajuste','Observaciones','Cantidad','Fecha'
					));

		        }else if ($tipo == 'traspasos') {

			        $sheet->row(1, array(
					    'Codigo','Item','Almacen','usuario','Tipo Movimiento','Tipo Ajuste','Observaciones','Cantidad','Fecha'
					));

		        }
		        
				// $sheet->setAutoSize(true);
				$sheet->freezeFirstRow();
				$sheet->row(1, function($row) {
				    // call cell manipulation methods
				    $row->setFont(array(
					    'size'       => '14',
					    'bold'       =>  true
					));
				});

				$sheet->setAutoFilter();

		    });

		})->store('xls', public_path('exports') , true);
		

	}

	public function exportarPDF($tipo){
		
		//$datos = $this->existencias();
		if ($tipo == 'existencias'){
			$datos = $this->existencias();
		} elseif ($tipo == 'traspasos'){
			$datos = $this->traspasos();
		}

		return Excel::create($tipo, function($excel) use($datos) {

		    $excel->sheet('Datos', function($sheet) use($datos) {

		        $sheet->fromArray($datos);
		        $sheet->removeColumn('C',2);
		        $sheet->removeColumn('G');

		        $sheet->row(1, array(
				     'CODIGO','ITEM','ALMACEN','CANTIDAD','ULTIMO MOV.','UNIDAD','PRECIO VANTA'
				));
				
				$sheet->setAutoSize(true);
				$sheet->setFontSize(9);

				$style = array(
			        'alignment' => array(
			            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
			        )
			    );

    			$sheet->getDefaultStyle()->applyFromArray($style);

				$sheet->row(1, function($row) {
				    // call cell manipulation methods
				    $row->setFont(array(
					    'bold'       =>  true
					));
				});

		    });

		})->store('pdf', public_path('exports') , true);

	}

	public function ordenes(){

		$parametros = array();
		$fecha = 'OCM_fechaReg';
		$fechaini = Input::has('fechaini') ? Input::get('fechaini') : date('Y-m-d') . ' 00:00:00';
		$fechafin = Input::has('fechafin') ? Input::get('fechafin') : date('Y-m-d') . ' 23:59:59';

		if (Input::has('acceso')) {

			$acceso = Input::get('acceso');
			$fechaini = date('Y-m-d', strtotime ( '-30 day' , strtotime ( $fechafin ) ) ) . ' 00:00:00';

			//verificamos los accesos directos 

			//los surtidos en los ultimos 30 dias
			if ($acceso == 'surtidos') {
				$parametros['OCM_cancelada'] = 0;
				$parametros['OCM_surtida'] = 1;
				$fecha = 'OCM_fechaSurtida';
			//los cancelados en ,os ultimos 30 dias
			}elseif ($acceso == 'cancelados') {
				$parametros['OCM_cancelada'] = 1;
				$fecha = 'OCM_fechaCancelacion';
			//los registrados en los ultimos 30 dias
			}else{
				$parametros['OCM_cancelada'] = 0;
				$parametros['OCM_surtida'] = 0;
			}
		}

		$sql = 'OCM_clave as id , 
				OCM_fechaReg as AltaOrden ,
				OCM_fechaSurtida as SurtidaOrden ,
				OCM_fechaCancelacion as CancelacionOrden , 
				ucreo.USU_login as UsuarioCreo ,
				usurtio.USU_login as UsuarioSurtio ,
				ucancelo.USU_login as UsuarioCancelo , 
				ordenCompra.updated_at as UltimoMovimiento , 
				OCM_importeEsperado as importeEsperado , 
				OCM_importeFinal as importeFinal , 
				UNI_nombre as unidad , 
				PRO_nombre as proveedor , 
				CASE
					WHEN OCM_cancelada = 1 THEN "Cancelada" 
					WHEN OCM_cerrada = 1 THEN "Cerrada"
					WHEN OCM_surtida = 1 AND OCM_incompleta = 1 AND OCM_cerrada = 0 THEN "Incompleta"
					ELSE "Abiertas" 
				END as Estatus';

		if (Input::has('unidad')) {
			$parametros['ordenCompra.UNI_clave'] = Input::get('unidad');
		}

		if (Input::has('tipo')) {

			if ( Input::get('tipo') == "cerrado" ) {
				$fecha = 'OCM_fechaCerrada';
			}else if( Input::get('tipo') == "surtido" ){
				$fecha = 'OCM_fechaSurtida';
			}else if ( Input::get('tipo') == "cancelacion" ) {
				$fecha = 'OCM_fechaCancelacion';
			}
		}

		return  OrdenCompra::join('tiposOrden', 'ordenCompra.TOR_clave', '=', 'tiposOrden.TOR_clave')
					->join('proveedores', 'ordenCompra.PRO_clave', '=', 'proveedores.PRO_clave')
					->join('unidades', 'ordenCompra.UNI_clave', '=', 'unidades.UNI_clave')
					->join('usuarios as ucreo', 'ordenCompra.USU_creo', '=', 'ucreo.USU_clave')
					->leftJoin('usuarios as usurtio', 'ordenCompra.USU_surtio', '=', 'usurtio.USU_clave')
					->leftJoin('usuarios as ucerro', 'ordenCompra.USU_cerro', '=', 'ucerro.USU_clave')
					->leftJoin('usuarios as ucancelo', 'ordenCompra.USU_cancelo', '=', 'ucancelo.USU_clave')
					->select(DB::raw($sql))
					->whereBetween($fecha, array($fechaini, $fechafin))
					->where($parametros)
					->orderBy('OCM_fechaReg','DESC')
					->get();

	}

	public function ordenCompraPDF($id){
		$pdf = helpers::ordenPDF($id);
    	return $pdf->stream();
	}
}
