<?php

class OperacionController extends BaseController {



	public function eliminaUsuarioAlmacen($almacen,$usuario){
		UsuarioAlmacen::where('USU_clave',$usuario)->where('ALM_clave',$almacen)->delete();
		return Response::json(array('respuesta' => 'Almacen removido Correctamente'));
	}

	public function itemProveedor(){

		$itemprovedor = new ItemProveedor;
		$item = Input::get('item');

		$itemprovedor->ITE_clave = $item['ITE_clave'];
		$itemprovedor->PRO_clave = Input::get('proveedor');
		$itemprovedor->IPR_ultimoCosto = Input::get('cantidad');
		$itemprovedor->IPR_ultimaFecha = date('Y-m-d H:i:s');

		$itemprovedor->save();

		return Response::json(array('respuesta' => 'Item asignado Correctamente'));

	}

	// agrega unnuevo movminiento
	public function movimiento(){

		//preparamos los movimientos del item

		$tipomovimiento = Input::get('tipomov');
		$item = Input::get('item');
		$almacen = Input::get('almacen');
		$cantidad = Input::get('cantidad');
		$tipoajuste = Input::get('tipoa');

		$movimiento = new Movimiento;

		$movimiento->ITE_clave = $item;
		$movimiento->ALM_clave = $almacen;
		$movimiento->TIM_clave = $tipomovimiento;
		$movimiento->TIA_clave = $tipoajuste;
		$movimiento->USU_clave = Input::get('usuario');
		
		if ( Input::has('orden') ) {
			$movimiento->OCM_clave = Input::get('orden');
		}

		$movimiento->MOV_cantidad = $cantidad;
		$movimiento->MOV_observaciones = Input::get('observaciones');

		$movimiento->save();

		//verificamos si existe algo registrado como exstencia del item en el almacen
		$consulta = Existencia::busca($item,$almacen);
		//si existe manda true si no false
		$existe = ($consulta->count() > 0) ? true : false;

		if ($existe) {
			//si existe consulta la clave de existencia que relaciona el item con el almacen
			//para obtener la clave y la cantidad que existe actualmente
			foreach ($consulta->get() as $dato) {
				$clave = $dato->EXI_clave;
				$cantidadActual = $dato->EXI_cantidad;
			}

			$existencia = Existencia::find($clave);

		}else{
			//si no existe la cantidad es 0 por que no hay nada registrado aun
			$existencia = new Existencia;
			$cantidadActual = 0;
		}


		// //si es un ajuste no importa las cantidades en el item exitentes se resetean
		if ($tipomovimiento == 1) {
			
			$existencia->ITE_clave = $item;
			$existencia->ALM_clave = $almacen;
			$existencia->EXI_cantidad = $cantidad;
			$existencia->EXI_ultimoMovimiento = date('Y-m-d H:i:s');
			$existencia->save();

			$cantidadTotal = Item::find($item)->ITE_cantidadtotal;
			
			$itemactualiza = Item::find($item);
			$itemactualiza->ITE_cantidadtotal = $cantidadTotal - $cantidadActual + $cantidad;
			$itemactualiza->save();

		//en este se toma que es una alta de item
		}else if($tipomovimiento == 2){

			$existencia->ITE_clave = $item;
			$existencia->ALM_clave = $almacen;
			$existencia->EXI_cantidad = $cantidadActual + $cantidad;
			$existencia->EXI_ultimoMovimiento = date('Y-m-d H:i:s');
			$existencia->save();

			$cantidadTotal = Item::find($item)->ITE_cantidadtotal;
			
			$itemactualiza = Item::find($item);
			$itemactualiza->ITE_cantidadtotal = $cantidadTotal + $cantidad;
			$itemactualiza->save();
			

		//en este se toma que es una baja de item
		}else if ($tipomovimiento == 3) {

			$existencia->ITE_clave = $item;
			$existencia->ALM_clave = $almacen;
			$existencia->EXI_cantidad = $cantidadActual - $cantidad;
			$existencia->EXI_ultimoMovimiento = date('Y-m-d H:i:s');
			$existencia->save();

			$cantidadTotal = Item::find($item)->ITE_cantidadtotal;
			
			$itemactualiza = Item::find($item);
			$itemactualiza->ITE_cantidadtotal = $cantidadTotal - $cantidad;
			$itemactualiza->save();
			
		}

		return Response::json(array('respuesta' => 'Movimiento guardado Correctamente'));

	}


	// agrega unnuevo movminiento
	public function traspaso(){

		//preparamos los movimientos que se involucran el el traspaso del item

		$almacenOrigen = Input::get('almacenOrigen');
		$almacenDestino = Input::get('almacenDestino');
		$item = Input::get('item');
		$cantidad = Input::get('cantidad');


		//baja de cantidad en almacenOrigen
		$movimiento = new Movimiento;

		$movimiento->ITE_clave = $item;
		$movimiento->ALM_clave = $almacenOrigen;
		$movimiento->TIM_clave = 3;
		$movimiento->USU_clave = Input::get('usuario');
		$movimiento->MOV_cantidad = $cantidad;
		$movimiento->MOV_observaciones = 'Disminución por traspaso';

		$movimiento->save();

		//obtenemos datos de existencia del item y almacen
		$consulta = Existencia::busca($item,$almacenOrigen)->get();
		foreach ($consulta as $dato) {
			$clave = $dato->EXI_clave;
			$cantidadActual = $dato->EXI_cantidad;
		}

		//preparamos edicion de datos
		$existenciaSalida = Existencia::find($clave);

		$existenciaSalida->ITE_clave = $item;
		$existenciaSalida->ALM_clave = $almacenOrigen;
		$existenciaSalida->EXI_cantidad = $cantidadActual - $cantidad;//se resta la cantidad a traspasar
		$existenciaSalida->EXI_ultimoMovimiento = date('Y-m-d H:i:s');
		$existenciaSalida->save();

		//incremento de cantidad en almacenDestino

		$movimiento = new Movimiento;

		$movimiento->ITE_clave = $item;
		$movimiento->ALM_clave = $almacenDestino;
		$movimiento->TIM_clave = 2;
		$movimiento->USU_clave = Input::get('usuario');
		$movimiento->MOV_cantidad = $cantidad;
		$movimiento->MOV_observaciones = 'Incremento por traspaso';

		$movimiento->save();


		//obtenemos datos de existencia del item y almacen
		$consulta = Existencia::busca($item,$almacenDestino);
		//si existe cantidades registradas manda true si no false
		$existe = ($consulta->count() > 0) ? true : false;

		if ($existe) {
			//si existe consulta la clave de existencia que relaciona el item con el almacen
			//para obtener la clave y la cantidad que existe actualmente
			foreach ($consulta->get() as $dato) {
				$clave = $dato->EXI_clave;
				$cantidadActual = $dato->EXI_cantidad;
			}

			$existenciaEntrada = Existencia::find($clave);

		}else{
			//si no existe la cantidad es 0 por que no hay nada registrado aun
			$existenciaEntrada = new Existencia;
			$cantidadActual = 0;
		}

		//modificamos el numero de existencia

		$existenciaEntrada->ITE_clave = $item;
		$existenciaEntrada->ALM_clave = $almacenDestino;
		$existenciaEntrada->EXI_cantidad = $cantidadActual + $cantidad;
		$existenciaEntrada->EXI_ultimoMovimiento = date('Y-m-d H:i:s');
		$existenciaEntrada->save();


		return Response::json(array('respuesta' => 'Traspaso efectuado Correctamente'));

	}

	public function usuarioAlmacen(){

		$usuario = Input::get('usuario');
		$usuarioasigno = Input::get('usuarioasigno');
		$almacenes = Input::get('almacenes');

		foreach ($almacenes as $dato){


			$conexion = new UsuarioAlmacen;

			$conexion->USU_clave =  $usuario; 
	    	$conexion->ALM_clave =  $dato['ALM_clave'];
	    	$conexion->UAL_fechaAsociado =  date('Y-m-d H:i:s');
	    	$conexion->USU_asocio =  $usuarioasigno;

	    	$conexion->save();

		}

		return Response::json(array('respuesta' => 'Almacenes Asignados Correctamente'));

	}

	public function usuariosAlm(){
		$usuarios = User::activos();
		$respuesta = array();

		foreach ($usuarios as $dato){

			$almacenes = DB::table('usuarioAlmacen')
							->Join('almacenes','usuarioAlmacen.ALM_clave', '=' ,'almacenes.ALM_clave')
							->select('usuarioAlmacen.*','ALM_nombre')
							->where('USU_clave',$dato->USU_clave)->get();

			$respuesta[] = array(
				"clave" => $dato->USU_clave,
				"nombre" => $dato->USU_nombrecompleto,
				"usuario" => $dato->USU_login,
				"almacenes" => $almacenes
		    );
		}

		return $respuesta;
	}


}
