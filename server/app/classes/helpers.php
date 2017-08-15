<?php

class helpers {

	public static function ordenPDF($id){

		$orden = array();
	    $dato = OrdenCompra::busca($id);
	    $items = OrdenItem::orden($id);

	    $orden = array(
	        'OCM_clave' => $dato->OCM_clave,
	        'PRO_nombrecorto' => $dato->PRO_nombrecorto,
	        'PRO_nombre' => $dato->PRO_nombre,
	        'PRO_rfc' => $dato->PRO_rfc,
	        'PRO_razonSocial' => $dato->PRO_razonSocial,
	        'PRO_correo' => $dato->PRO_correo,
	        'TOR_nombre' => $dato->TOR_nombre,
	        'USU_nombrecompleto' => $dato->USU_nombrecompleto,
	        'OCM_fechaReg' => $dato->OCM_fechaReg,
	        'OCM_almacenes' => explode(',', $dato->OCM_almacenes),
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

		$archivo =  public_path().'/ordenesCompra/'.$orden['OCM_clave'].'.pdf';

		//VERIFICAMOS SI EXSITE EL ARCHIVO PDF GENERADO
		if (file_exists($archivo)) {
			/*
			Esto genera la vista del PDF cargando los datos desde la DB
			$pdf = PDF::loadView('ordenes.ordenCompra', array('data' => $orden) );
			*/

			//CUANDO YA EXISTE EL PDF GENERADO CARGAMOS DICHO PDF
			//definimos header para mostrar documentos pdf
			header("Content-type:application/pdf");
			// definimos si se descargará o si se mostrará en el navegador el documento
			header("Content-Disposition:inline;filename='".$orden['OCM_clave'].".pdf'");
			// cargamos el pdf original
			readfile($archivo);
		} else{
			//SI NO EXISTE EL PDF LO GENERAMOS
			$pdf = PDF::loadView('ordenes.ordenCompra', array('data' => $orden) )->save($archivo);
		}

	    // $pdf = PDF::loadView('ordenes.ordenCompra', array('data' => $orden) )->save($archivo);
	    return $pdf;

	}

	//helper para crear todo el ingreso del item a nivel global y de existencia modificando el costo del mismmo
	public static function ingresaTotal($item,$cantidad,$almacen,$orden,$usuario,$observaciones){

		//verificamos existencia
		$consulta = Existencia::busca($item,$almacen);

		if ($consulta->count() > 0) {

			//si existe consulta la clave de existencia que relaciona el item con el almacen
			//tomamos la clave y la cantidad actual de existencia en ese almacen
			$claveExistencia = $consulta->first()->EXI_clave;
			$cantidadActual = $consulta->first()->EXI_cantidad;

			//obtenemos la clave de existencia
			$existencia = Existencia::find($claveExistencia);

		}else{
			
			//si no existe la cantidad es 0 por que no hay nada registrado aun
			$existencia = new Existencia;
			$cantidadActual = 0;
		}

		//modificamos los datos
		$existencia->EXI_cantidad = $cantidadActual + $cantidad;
		$existencia->EXI_ultimoMovimiento = date('Y-m-d H:i:s');
		$existencia->save();

		//buscamos la cantidad total del item 
		$cantidadTotal = Item::find($item)->ITE_cantidadtotal;
		
		// actualizamos la cantidad global del item
		$itemactualiza = Item::find($item);
		$itemactualiza->ITE_cantidadtotal = $cantidadTotal + $cantidad;
		$itemactualiza->save();

		//creamos el registro que se realizo con el surtido
		$movimiento = new Movimiento;

		$movimiento->ITE_clave = $item;
		$movimiento->ALM_clave = $almacen;
		$movimiento->OCM_clave = $orden;
		$movimiento->TIM_clave = 2;
		$movimiento->USU_clave = $usuario;
		$movimiento->MOV_cantidad = $cantidad;
		$movimiento->MOV_observaciones = $observaciones;

		$movimiento->save();

		if ($claveExistencia) {
			return $claveExistencia;
		}else{
			return $existencia->EXI_clave;
		}

	}

	public static function ingresaLotes($item,$lotes,$orden,$existencia){
		

		foreach ($lotes as $valor) {
			# code...
			$lote = new Lote;

			$lote->EXI_clave = $existencia;
			$lote->ITE_clave = $existencia;
			$lote->OCM_clave = $existencia;
			$lote->LOT_numero = $valor['lote'];
			$lote->LOT_cantidad = $valor['cantidad'];
			$lote->LOT_caducidad = $valor['caducidad'];
			$lote->save();
		}

	}


	public static function surteItem($item,$cantidad,$almacen,$orden,$usuario,$observaciones,$loteForzoso,$lotes){

		$operacion = new Operacion;

		$operacion->tipomovimiento = 2;
		$operacion->item = $item;
		$operacion->almacen = $almacen;
		$operacion->cantidad = $cantidad;
		$operacion->usuario = $usuario;
		$operacion->orden = $orden;
		$operacion->observaciones = $observaciones;

		$operacion->entrada();

		if ($loteForzoso == 1) {
			
			foreach ($lotes as $lote) {
				$operacion->idLote 		= $lote['idLote'];
				$operacion->lote 		= $lote['lote'];
				$operacion->caducidad 	= $lote['caducidad'];
				$operacion->cantidad 	= $lote['cantidad'];
				$operacion->verificaLote();
			}
		}

	}

	public static function completaItem($item,$cantidad,$almacen,$orden,$usuario,$observaciones,$loteForzoso,$lotes,$claveOrdenItem){

		$operacion = new Operacion;

		$operacion->tipomovimiento = 2;
		$operacion->item = $item;
		$operacion->almacen = $almacen;
		$operacion->cantidad = $cantidad;
		$operacion->usuario = $usuario;
		$operacion->orden = $orden;
		$operacion->observaciones = $observaciones;

		$operacion->entrada();

		foreach ($lotes as $lote) {
			$operacion->idLote 		= $lote['idLote'];
			$operacion->lote 		= $lote['lote'];
			$operacion->caducidad 	= $lote['caducidad'];
			$operacion->cantidad 	= $lote['cantidad'];
			$operacion->verificaLote();
		}

	}

	public static function traspasoPDF($cveTraspaso){
		
		$datos = Movimiento::join('usuarios', 'movimientos.USU_clave', '=', 'usuarios.USU_clave')
								->join('items', 'movimientos.ITE_clave', '=', 'items.ITE_clave')
								->join('lote', 'movimientos.LOT_clave', '=', 'lote.LOT_clave')
								->join('traspasos', 'movimientos.CVE_traspaso', '=', 'traspasos.TRA_codigo')
								->where('CVE_traspaso', $cveTraspaso)
								->where('MOV_traspaso', 1)
								->where('TIM_clave', 2)
								->select('movimientos.*','ITE_nombre','USU_nombrecompleto','LOT_numero','CVE_traspaso','TRA_id')
								->get();

		$archivo =  public_path().'/acusesTraspasos/'.'traspaso_'.$cveTraspaso.'.pdf';

		//VERIFICAMOS SI EXSITE EL ARCHIVO PDF GENERADO
		if (file_exists($archivo)) {
			//CUANDO YA EXISTE EL PDF GENERADO CARGAMOS DICHO PDF
			//definimos header para mostrar documentos pdf
			header("Content-type:application/pdf");
			// definimos si se descargará o si se mostrará en el navegador el documento
			header("Content-Disposition:inline;filename='".'traspaso_'.$cveTraspaso.".pdf'");
			// cargamos el pdf original
			readfile($archivo);
		} else{
			//SI NO EXISTE EL PDF LO GENERAMOS
			$pdf = PDF::loadView('traspasos.acuseTraspaso', array('data' => $datos) )->save($archivo);
		}

	    return $pdf;
	    // return $pdf->stream();

	}


}

?>