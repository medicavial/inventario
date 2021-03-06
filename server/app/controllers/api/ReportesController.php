<?php

class ReportesController extends BaseController {

	public function existencias(){

		$item = Input::get('item');

		if (Input::has('unidad')) {

			$unidad = Input::get('unidad');

			if(Input::has('almacen')){
				$almacen = Input::get('almacen');
				$nombre = Almacen::find($almacen)->ALM_nombre;

				$items = Existencia::unidad($unidad);

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
				$datos = Existencia::unidad($unidad);
			}

		}else if (Input::has('item')) {

			$unidad = Input::get('item');
			$datos = Existencia::item($item);

		}

		return $datos;
	}
}
