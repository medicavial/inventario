<?php


class ReportesController extends BaseController {

	public function existencias(){

		$query = Existencia::query();

        $query->join('items', 'existencias.ITE_clave', '=', 'items.ITE_clave')
    			->join('tiposItem', 'items.TIT_clave', '=', 'tiposItem.TIT_clave')
				->join('almacenes', 'existencias.ALM_clave', '=', 'almacenes.ALM_clave')
				->join('unidades', 'almacenes.UNI_clave', '=', 'unidades.UNI_clave')
				->select('ITE_codigo','ITE_nombre', 'items.ITE_clave','almacenes.UNI_clave','almacenes.ALM_nombre','EXI_cantidad','EXI_ultimoMovimiento','UNI_nombrecorto','almacenes.ALM_clave','TIT_nombre','ITE_precioventa','existencias.EXI_clave','ITE_sustancia', 'ITE_presentacion')
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
	        })
	        ->orderBy('ITE_codigo');


		$query->select('ITE_codigo','ITE_nombre','ALM_nombre','EXI_cantidad','LOT_numero','LOT_cantidad','LOT_caducidad','lote.EXI_clave','LOT_clave', 'lote.updated_at');

		// if (Input::has('unidad')) {
		// 	$query->where('almacenes.UNI_clave', Input::get('unidad') );
		// }

		/* Permiso 1 y 2 pueden ver Lotes en cero, los demas permisos no deben verlos */
		/* Además, debe venir en True la variable verCeros */
		if ( Input::has('permiso') ) {
			if ( Input::get('permiso') > 2 ) {
				$query->where('LOT_cantidad','>',0);
			}
		}

		if (Input::has('verCeros')) {
			// return Input::get('verCeros');
			if (Input::get('verCeros') == 'false') {
				$query->where('LOT_cantidad','>',0);
			}
		}

		//esto debe de funcionar solo en el ajuste de lotes
		if (Input::has('lote')) {
			if (Input::get('lote') != '') {
				$query->where('LOT_numero','=',Input::get('lote'));
			}
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
				// ->whereBetween('movimientos.created_at', array(Input::has('fechaInicio') ? Input::get('fechaInicio') : date('Y-m-d') . ' 00:00:00' , Input::has('fechaFinal') ? Input::get('fechaFinal') : date('Y-m-d') . ' 23:59:59'));

				$query->where('movimientos.created_at', '>', Input::get('fechaInicio').' 00:00:00');
				$query->where('movimientos.created_at', '<', Input::get('fechaFinal').' 23:59:59');
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

        $query->join('items', 'movimientos.ITE_clave', '=', 'items.ITE_clave')
				->join('almacenes', 'movimientos.ALM_clave', '=', 'almacenes.ALM_clave')
				->join('unidades', 'almacenes.UNI_clave', '=', 'unidades.UNI_clave')
				->join('usuarios', 'movimientos.USU_clave', '=', 'usuarios.USU_clave')
				->join('tiposMovimiento', 'movimientos.TIM_clave', '=', 'tiposMovimiento.TIM_clave')
				->join('traspasos', 'movimientos.CVE_traspaso','=','traspasos.TRA_codigo')
				->leftJoin('tiposAjuste', 'movimientos.TIA_clave', '=', 'tiposAjuste.TIA_clave')
				->select('ITE_codigo','ITE_nombre','ALM_nombre','USU_login','USU_nombrecompleto','TIM_nombre', 'TIA_nombre','MOV_observaciones','MOV_cantidad','movimientos.created_at', 'TRA_id', 'TRA_codigo','TRA_fecha','MOV_clave','UNI_nombrecorto')
				->where('movimientos.MOV_traspaso', 1 ) //filtramos los traspasos
				->where('movimientos.TIM_clave', 2 ) // solo nos interesan las entradas aunque se registran tambien las salidas en los traspasos
				->whereBetween('movimientos.created_at', array(Input::has('fechaInicio') ? Input::get('fechaInicio') : date('Y-m-d') . ' 00:00:00' , Input::has('fechaFinal') ? Input::get('fechaFinal') : date('Y-m-d') . ' 23:59:59'));

	 	if (Input::has('unidad')) {
	 		$query->where('almacenes.UNI_clave', Input::get('unidad') );
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

		$movimientos = $query->get();
		$i=0;

		$respuesta=array();
		foreach ($movimientos as $traspaso) {
			if ( ($i==0 && $movimientos[$i]['TRA_codigo'] == $traspaso['TRA_codigo']) || ($i>0 && $movimientos[$i-1]['TRA_codigo'] != $traspaso['TRA_codigo']) ) {

				//recopilamos los datos de los items por id de traspaso
				for ($numItem=0; $numItem < sizeof($movimientos) ; $numItem++) {
					if ($traspaso['TRA_codigo'] == $movimientos[$numItem]['TRA_codigo']) {
						$datos[] = array(
											'ITE_codigo' 	=> $movimientos[$numItem]['ITE_codigo'],
											'ITE_nombre' 	=> $movimientos[$numItem]['ITE_nombre'],
											'MOV_cantidad' 	=> $movimientos[$numItem]['MOV_cantidad'],
											'MOV_clave' 	=> $movimientos[$numItem]['MOV_clave'],
											'TIM_nombre' 	=> $movimientos[$numItem]['TIM_nombre'],
											'MOV_obs' 		=> substr($movimientos[$numItem]['MOV_observaciones'], 24),
										);
					}
				}

				//preparamos los datos que se mostrarán al usuario
				$respuesta[]=array(
									'TRA_id' 		=> $traspaso['TRA_id'],
									'TRA_codigo' 	=> $traspaso['TRA_codigo'],
									'TRA_fecha' 	=> $traspaso['TRA_fecha'],
									'USU_nombre' 	=> $traspaso['USU_nombrecompleto'],
									'UNI_nombre' 	=> $traspaso['UNI_nombrecorto'],
									'numItems'		=> sizeof($datos),
									'datos' 		=> $datos,
									);
			}
			$datos=null;
			$i++;
		}
		return $respuesta;
	}

	public function traspasoPDF($cveTraspaso){
		// return $cveTraspaso;
		$pdf = helpers::traspasoPDF($cveTraspaso);

		// return $pdf;
	}

	public function items(){

		$query = Item::query();

        $query->join('tiposItem', 'items.TIT_clave', '=', 'tiposItem.TIT_clave')
                     ->join('subTiposItem', 'items.STI_clave', '=', 'subTiposItem.STI_clave')
                     ->select(DB::raw(
                 			'ITE_clave as ID_sistema,ITE_codigo as Codigo, ITE_nombre as nombre, ITE_sustancia as activo, ITE_presentacion as presentacion,
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
				    	'ID_sistema','Codigo','Nombre', 'Sustancia', 'Presentacion','Precio venta','Segmentable',
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

		        }else if ($tipo == 'movimientos') {

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
		} elseif ($tipo == 'movimientos'){
			$datos = $this->movimientos();
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

		return OrdenCompra::join('usuarios', 'ordenCompra.USU_creo', '=', 'usuarios.USU_clave')
							->join('unidades', 'ordenCompra.UNI_clave', '=', 'unidades.UNI_clave')
							->join('proveedores', 'ordenCompra.PRO_clave', '=', 'proveedores.PRO_clave')
							->leftJoin('usuarios as usurtio', 'ordenCompra.USU_surtio', '=', 'usurtio.USU_clave')
							->select(DB::raw($select))
							->whereIn('ordenCompra.UNI_clave', explode(",",$unidades))
							->where('OCM_cerrada',0)
							->where('OCM_cancelada',0)
							->orderBy('OCM_clave')
							->get();
	}

	public function ordenesExcel($unidades){

		$datos = ReportesController::ordenesAbiertas($unidades);

		return Excel::create('Ordenes_Abiertas', function($excel) use($datos) {

			//SE ESTABLECE EL TÍTULO
			$excel->setTitle('Ordenes de Compra Abiertas');

			//DATOS DE AUTOR DE DOCUMENTO
			$excel->setCreator('MedicaVial')
				  ->setCompany('MedicaVial')
				  ->setDescription('Listado de Ordenes de Compra Abiertas');

			$excel->sheet('Listado', function($sheet) use($datos) {

				$sheet->fromArray($datos);

			});
		// })->download('xlsx');
		})->store('xls', public_path('exports') , true);
	}

	public function detalleOrden($idOrden){
		$select = 'OIT_clave,
						   ordenItems.ITE_clave,
						   ITE_codigo,
						   ITE_nombre,
						   OCM_clave,
						   OIT_cantidadPedida,
						   OIT_cantidadSurtida,
						   OIT_precioEsperado,
						   OIT_precioFinal';

		$orden = OrdenCompra::find($idOrden);
		$items = DB::table('ordenItems')
					->join('items','ordenItems.ITE_clave', '=', 'items.ITE_clave')
					->select(DB::raw($select))
					->where('OCM_clave', $idOrden)
					->get();

    	$respuesta[] = array(
    		'idOrden' 		=> $idOrden,
    		'fechaOrden' 	=> $orden['OCM_fechaReg'],
				'detalles'		=> $orden,
    		'items' 			=> $items
    		);

    	return $respuesta;
	}

	public function ordenCompraPDF($id){
		$pdf = helpers::ordenPDF($id);
    	return $pdf->stream();
	}

	public function recetasComp(){
		set_time_limit(300); // limite de tiempo en tiempo en segundos

		$respuesta=array();
		$fechaInicio='2017-07-01 00:00:00';
		$fechaFin='2017-07-31 23:59:59';

		$recetasComp = Receta::join('Usuario','RecetaMedica.Usu_login','=','Usuario.Usu_login')
							->join('Unidad','RecetaMedica.Uni_clave','=','Unidad.Uni_clave')
							->join('Expediente','RecetaMedica.Exp_folio','=','Expediente.Exp_folio')
							->join('NotaMedica','RecetaMedica.Exp_folio','=','NotaMedica.Exp_folio')
							->where('tipo_receta',3)
							->where('RM_fecreg','>=',$fechaInicio)
							->where('RM_fecreg','<=',$fechaFin)
							->select('RecetaMedica.*','Usuario.Usu_nombre','Uni_nombrecorto','Exp_fecreg','Not_fechareg')
							->get();
		foreach ($recetasComp as $receta) {

			$cantidadRecetas = Receta::where('tipo_receta',3)
								->where('Exp_folio', $receta['Exp_folio'])
								->where('RM_fecreg','>=',$fechaInicio)
								->where('RM_fecreg','<=',$fechaFin)
								->count();

			$items = Movimiento::join('items', 'movimientos.ITE_clave', '=', 'items.ITE_clave')
								->where('id_receta',$receta['id_receta'])
								->select('ITE_nombre')
								// ->select('ITE_nombre','ITE_codigo','ITE_precioventa')
								->get();
			$items=(array)$items;

			$listaItems="";
			$lista="";

			if (sizeof($items>0)) {
				// $listaItems = $items;
				foreach ($items as $item) {
					$listaItems = $item;
				}

				for ($i=0; $i <sizeof($listaItems) ; $i++) {
					if ($lista=="") {
						$lista = $lista.$listaItems[$i]['ITE_nombre'];
					} else{
						$lista = $lista.', '.$listaItems[$i]['ITE_nombre'];
					}
				}
			}

			// return $lista;


			$itemSurtido = Receta::join('NotaSuministros','RecetaMedica.id_receta','=','NotaSuministros.id_receta')
							->where('RecetaMedica.id_receta', $receta['id_receta'])
							// ->where('RecetaMedica.id_receta', 32912)
							->select('NS_descripcion','NS_surtida','NS_cancelado')
							->get();

			$itemSurtido=(array)$itemSurtido;
			$listaSurtidos="";
			$surtidos="";
			$cantidadSurtidos=0;

			if (sizeof($itemSurtido>0)) {
				// $listaSurtidos = $items;
				foreach ($itemSurtido as $item) {
					$listaSurtidos = $item;
				}
				$cantidadSurtidos = sizeof($listaSurtidos);

				for ($i=0; $i<sizeof($listaSurtidos) ; $i++) {
					if ($surtidos=="") {
						$surtidos = $surtidos.$listaSurtidos[$i]['NS_descripcion'];

					} else{
						$surtidos = $surtidos.'; '.$listaSurtidos[$i]['NS_descripcion'];
					}
				}
			}

			// return $surtidos;

			$precioItems = Movimiento::join('items', 'movimientos.ITE_clave', '=', 'items.ITE_clave')
								->where('id_receta',$receta['id_receta'])
								->select('ITE_nombre','ITE_codigo','ITE_precioventa')
								->sum('ITE_precioventa');

			// $recetasxMedico = Receta::where('tipo_receta',3)
			// 					->where('Usu_login', $receta['Usu_login'])
			// 					->where('RM_fecreg','>=',$fechaInicio)
			// 					->where('RM_fecreg','<=',$fechaFin)
			// 					->count();

			$fecha= Receta::where('RecetaMedica.Exp_folio', $receta['Exp_folio'])
								// ->join('Expediente','RecetaMedica.Exp_folio','=','Expediente.Exp_folio')
								// ->join('NotaMedica','RecetaMedica.Exp_folio','=','NotaMedica.Exp_folio')
								// ->where('RM_fecreg','>=',$fechaInicio)
								// ->where('RM_fecreg','<=',$fechaFin)
								->where('tipo_receta',1)
								->select('RM_fecreg')
								->get();

			$fecha =  (array) $fecha;
			// return $fecha;
			$fechaNM="";
			// return sizeof($fecha);
			if (sizeof($fecha)==1) {
				foreach ($fecha as $fec) {

					if (sizeof($fec)==1) {
						if (sizeof($fec[0])==1) {
							if ($fec[0]['RM_fecreg']) {
								$fechaNM=$fec[0]['RM_fecreg'];
							}
						}
					}
				}
			}

			$respuesta[] = array(
				'idReceta' => $receta['id_receta'],
				'folPaciente' => $receta['Exp_folio'],
				'fecha_registro' => $receta['Exp_fecreg'],
				'fecha_notaMedica' => $receta['Not_fechareg'],
				'fecha_Receta_NotaMedica' => $fechaNM,
				'fechaRecetaComplementaria' => $receta['RM_fecreg'],
				'USU_Emitio' => $receta['Usu_login'],
				'NombreUsuario' => $receta['Usu_nombre'],
				'motivo' => $receta['RM_motivo'],
				// 'RecetasEmitidas' => $recetasxMedico,
				// 'TipoReceta' => $receta['tipo_receta'],
				'Unidad' => $receta['Uni_nombrecorto'],
				'RecetasxFolio' => $cantidadRecetas,
				'precioTotal' => '$'.$precioItems,
				'itemsReceta' => $lista,
				'itemsSurtidos' => $surtidos,
				'cantidadSurtidos' => $cantidadSurtidos,
				);
		};

		// return $respuesta;

		return Excel::create('Medicamentos_entregados_sin_receta', function($excel) use($respuesta) {

			//SE ESTABLECE EL TÍTULO
			$excel->setTitle('Medicamentos entregados sin receta');

			//DATOS DE AUTOR DE DOCUMENTO
			$excel->setCreator('MedicaVial')
				  ->setCompany('MedicaVial')
				  ->setDescription('Listado de medicamentos entregados sin receta');

			$excel->sheet('Listado', function($sheet) use($respuesta) {

				$sheet->fromArray($respuesta);

			});
		})->download('xlsx');

	}

	public function pruebaCorreo($parametro){
		$data 	= Input::all(); //recogemos los datos que se enviaron por post
		$orden 	= OrdenCompra::find($parametro);
    	$nombreUnidad 	= Unidad::find($orden['UNI_clave'])->UNI_nombrecorto;
    	$datosProv 		= Proveedor::find($orden['PRO_clave']);

    	//estos datos se van a enviar a la vista
    	$datos = array( 'numOrden' 		=> $parametro,
    					'unidad' 		=> $nombreUnidad,
    					'datosOrden' 	=> $orden,
    					'datosProv' 	=> $datosProv,
    					);

		// Mail::send('emails.prueba', array('datos'=>$datos), function($message)
		Mail::send('emails.prueba', $datos, function($message) use ($datos)
		{
    		$archivo=public_path().'/ordenesCompra/'.$datos['numOrden'].'.pdf';

				$message->from('sramirez@medicavial.com.mx', 'Médica Vial');
		    $message->to('sramirez@medicavial.com.mx', 'Nombre')->subject('Orden de Compra '.$datos['numOrden']);
				// $message->cc('jacortes@medicavial.com.mx');
    		// $message->bcc(array('egutierrez@medicavial.com.mx','adominguez@medicavial.com.mx'));
		    $message->attach($archivo);
		});

        return Response::json(array('respuesta' => 'Correo enviado Correctamente'));
	}
}
