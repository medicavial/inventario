<?php


class ReportesController extends BaseController {

	public function existencias(){

		$item = Input::get('item');

		
		if (Input::has('unidad')) {

			$unidad = Input::get('unidad');

			if(Input::has('almacen')){

				$almacen = Input::get('almacen');
				$nombre = Almacen::find($almacen)->ALM_nombre;

				$items = Existencia::reporteUnidad($unidad);

				foreach ($items as $item => $value) {

					$pasa = true;

					if ($almacen == $value->ALM_clave) {
					  	$cantidad = $value->EXI_cantidad;
					}else{
						
						$existencia = Existencia::where('ALM_clave',$almacen)->where('ITE_clave',$value->ITE_clave)->count();
						if ($existencia > 0) {
							$pasa = false;
						}else{
							$cantidad = 0;
						}
					}  

					if ( $pasa ) {
						$datos[] = array(
							'ALM_clave' => $value->ALM_clave,
							'ITE_nombre' => $value->ITE_nombre,
							'ITE_clave' => $value->ITE_clave,
							'UNI_clave' => $value->UNI_clave,
							'ALM_nombre' => $nombre,
							'EXI_cantidad' => $cantidad,
							'EXI_ultimoMovimiento' => $value->EXI_ultimoMovimiento,
							'UNI_nombrecorto' => $value->UNI_nombrecorto
						);
					}
				}

			}else{
				$datos = Existencia::reporteUnidad($unidad);
			}

		}else if (Input::has('item')) {

			$unidad = Input::get('item');
			$datos = Existencia::item($item);

		}

		return $datos;
	}

	public function exportar($tipo){
		
		// if ($tipo == 'existencias') {
			$datos = $this->existencias();
		// }

		return Excel::create($tipo, function($excel) use($datos) {

		    $excel->sheet('Datos', function($sheet) use($datos) {

		        $sheet->fromArray($datos);

		        // if ($tipo == 'existencias') {
		        	
			        $sheet->removeColumn('B',2);
			        $sheet->removeColumn('F');

			        $sheet->row(1, array(
					     'Item','Almacen','Cantidad','Ultimo Movimiento','Unidad'
					));

		        // }
		        
				$sheet->setAutoSize(true);
				$sheet->freezeFirstRow();
				$sheet->row(1, function($row) {
				    // call cell manipulation methods
				    $row->setFont(array(
					    'size'       => '16',
					    'bold'       =>  true
					));
				});
				$sheet->setAutoFilter();

		    });

		})->store('xls', public_path('exports') , true);

	}

	public function exportarPDF($tipo){
		
		$datos = $this->existencias();

		return Excel::create($tipo, function($excel) use($datos) {

		    $excel->sheet('Datos', function($sheet) use($datos) {

		        $sheet->fromArray($datos);
		        $sheet->removeColumn('B',2);
		        $sheet->removeColumn('F');

		        $sheet->row(1, array(
				     'ITEM','ALMACEN','CANTIDAD','ULTIMO MOV.','UNIDAD'
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

		return OrdenCompra::join('tiposOrden', 'ordenCompra.TOR_clave', '=', 'tiposOrden.TOR_clave')
					->join('proveedores', 'ordenCompra.PRO_clave', '=', 'proveedores.PRO_clave')
					->join('unidades', 'ordenCompra.UNI_clave', '=', 'unidades.UNI_clave')
					->join('usuarios as ucreo', 'ordenCompra.USU_creo', '=', 'ucreo.USU_clave')
					->leftJoin('usuarios as usurtio', 'ordenCompra.USU_surtio', '=', 'usurtio.USU_clave')
					->leftJoin('usuarios as ucerro', 'ordenCompra.USU_cerro', '=', 'ucerro.USU_clave')
					->leftJoin('usuarios as ucancelo', 'ordenCompra.USU_cancelo', '=', 'ucancelo.USU_clave')
					->select('OCM_clave as id','OCM_fechaReg as AltaOrden','ucreo.USU_login as UsuarioCreo','ordenCompra.updated_at as UltimoMovimiento','OCM_importeEsperado as importeEsperado','OCM_importeFinal as importeFinal','UNI_nombre as unidad','PRO_nombre as proveedor')
					->orderBy('OCM_fechaReg','DESC')
					->get();
	}

	public function ordenCompraPDF($id){
		$pdf = helpers::ordenPDF($id);
    	return $pdf->stream();
	}
}
