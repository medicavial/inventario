<?php

class Operacion {

	public $tipomovimiento;
	public $item;
	public $almacen;
	public $cantidad;
	public $tipoajuste = '';
	public $idLote = '';
	public $lote = '';
	public $orden = '';
	public $caducidad = '';
	public $usuario;
	public $observaciones = '';
	public $receta = '';
	public $traspaso = 0;

	private $existencia;
	private $cantidadActual;
	private $idExistencia;


	//funcion para verificar existencia 
	private function existenciaAlmacen(){

		//verificamos si existe algo registrado como exstencia del item en el almacen
		$consulta = Existencia::busca($this->item,$this->almacen);
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


		// setea el valor local al valor global
		$this->existencia = $existencia;
		$this->cantidadActual = $cantidadActual;
	}


	// en caso de ajuste se resetean los lotes registrados
	private function reseteaLotes(){

		//consultamos si hay lote el id de existenia y el item
		$parametros = array(
			'EXI_clave'=>$this->idExistencia,
			'ITE_clave'=>$this->item
		);


		//actualizamos los lotes encontrados a cero
		$lotes = Lote::where( $parametros )->update(array('LOT_cantidad' => 0));	

	}

	//funccion para dar de alta lote
	private function altaLote(){

		// si es ajuste de cualquier tipo
		if ($this->tipomovimiento == 1) {
			$this->reseteaLotes();
		}

		$datosLote = new Lote;
		$datosLote->EXI_clave = $this->idExistencia;
		$datosLote->ITE_clave = $this->item;
		$datosLote->LOT_numero = $this->lote;
		$datosLote->LOT_cantidad = $this->cantidad;
		$datosLote->LOT_caducidad = $this->caducidad;
		$datosLote->save();

	}

	private function actualizaLote(){

		$catidadActualLote = Lote::find($this->idLote)->LOT_cantidad;
		$existencia = Lote::find($this->idLote)->EXI_clave;


		// cuando verificamos el lote manda un id pero es para otro almacen 

		// verificamos que sea para el mismo almacen 
		if ($existencia == $this->idExistencia) {
			
			//ajuste
			if ($this->tipomovimiento == 1) {
				$this->reseteaLotes();
				$catidadIngresada = $this->cantidad;
			//entrada
			}elseif ($this->tipomovimiento == 2) {
				$catidadIngresada = $catidadActualLote  + $this->cantidad;
			//salida
			}elseif ($this->tipomovimiento == 3) {
				$catidadIngresada = $catidadActualLote  - $this->cantidad;
			}

			$datosLote = Lote::find($this->idLote);
			$datosLote->EXI_clave = $this->idExistencia;
			$datosLote->ITE_clave = $this->item;
			$datosLote->LOT_numero = $this->lote;
			$datosLote->LOT_cantidad = $catidadIngresada;
			$datosLote->LOT_caducidad = $this->caducidad;			
			$datosLote->save();

		//caso contrario agregamos lote
		}else{
			$this->altaLote();
		}


	}


	private function traspasoLote(){

		

		//entrada
		if ($this->tipomovimiento == 2) {

			//tomamos datos del lote anterior
			$loteDato = Lote::find($this->idLote);

			$this->lote = $loteDato->LOT_numero;
			$this->caducidad = $loteDato->LOT_caducidad;

			//consultamos si existe numero de lote con el almacen y el item 
			$parametros = array(
				'EXI_clave'	=> $this->idExistencia,
				'ITE_clave'	=> $this->item,
				'LOT_numero'=> $this->lote
			);

			$lote = Lote::where( $parametros );

			//si existe un lote con las caracteristicas solo actualizamos
			if ( $lote->count() > 0 ) {
				//obtenermos la clave del lote existente
				$claveLote = $lote->first()->LOT_clave;
				$catidadActualLote = Lote::find($claveLote)->LOT_cantidad;
				$datosLote = Lote::find($claveLote);
			//en caso contrario creamo uno nuevo registro
			}else{
				$catidadActualLote = 0;
				$datosLote = new Lote;
			}

			$catidadIngresada = $catidadActualLote  + $this->cantidad;
		//salida
		}elseif ($this->tipomovimiento == 3) {

			$loteDato = Lote::find($this->idLote);

			$this->lote = $loteDato->LOT_numero;
			$this->caducidad = $loteDato->LOT_caducidad;
			$catidadActualLote = $loteDato->LOT_cantidad;
			$catidadIngresada = $catidadActualLote  - $this->cantidad;
			$datosLote = Lote::find($this->idLote);	

		}

		$datosLote->EXI_clave = $this->idExistencia;
		$datosLote->ITE_clave = $this->item;
		$datosLote->LOT_numero = $this->lote;
		$datosLote->LOT_cantidad = $catidadIngresada;
		$datosLote->LOT_caducidad = $this->caducidad;
		$datosLote->save();

	}

	public function verificaLote(){

		// si no hay id de item pero esta escrito un lote lo tomamos como nuevo
		if ($this->traspaso == 1 && $this->idLote != '') {
			$this->traspasoLote();
		}else{
			if ($this->idLote == '' && $this->lote != '') {
				$this->altaLote();
			}elseif ($this->idLote != '') {
				$this->actualizaLote();
			}
		}
	}

	private function altaMovimiento(){

		$movimiento = new Movimiento;

		$movimiento->ITE_clave = $this->item;
		$movimiento->ALM_clave = $this->almacen;
		$movimiento->TIM_clave = $this->tipomovimiento;
		$movimiento->TIA_clave = $this->tipoajuste;
		$movimiento->USU_clave = $this->usuario;
		$movimiento->MOV_cantidad = $this->cantidad;
		$movimiento->MOV_observaciones = $this->observaciones;
		$movimiento->OCM_clave = $this->orden;
		$movimiento->LOT_clave = $this->idLote;
		$movimiento->id_receta = $this->receta;
		$movimiento->MOV_traspaso = $this->traspaso;
		if ($movimiento->MOV_traspaso==1) {
				$movimiento->CVE_traspaso = $this->cveTraspaso;
				// $movimiento->TRA_origen = $this->almacenOrigen;
				// $movimiento->TRA_destino = $this->almacenDestino;
		}

		$movimiento->save();

	}

	//se crea el alta de existencia de un item / o ajuste forzoso
	public function alta(){

		//guardamos el movimiento realizado
		$this->altaMovimiento();
		// verificamos las existencias de almacen
		$this->existenciaAlmacen();

		$this->existencia->ITE_clave = $this->item;
		$this->existencia->ALM_clave = $this->almacen;
		// aqui formateamos la cantidad de existencia
		$this->existencia->EXI_cantidad = $this->cantidad;
		$this->existencia->EXI_ultimoMovimiento = date('Y-m-d H:i:s');
		$this->existencia->save();

		//aqui guardamos el id actualizado o modificado
		$this->idExistencia = $this->existencia->EXI_clave;

		// buscamos la cantidad total del item
		$cantidadTotal = Item::find($this->item)->ITE_cantidadtotal;
		
		// calculamos la cantidad total del item
		$itemActualiza = Item::find($this->item);
		$itemActualiza->ITE_cantidadtotal = $cantidadTotal - $this->cantidadActual + $this->cantidad;
		$itemActualiza->save();

	}

	// se da una entrada de un item existente
	public function entrada(){

		//guardamos el movimiento realizado
		$this->altaMovimiento();
		// verificamos las existencias de almacen
		$this->existenciaAlmacen();

		$this->existencia->ITE_clave = $this->item;
		$this->existencia->ALM_clave = $this->almacen;
		$this->existencia->EXI_cantidad = $this->cantidadActual + $this->cantidad;
		$this->existencia->EXI_ultimoMovimiento = date('Y-m-d H:i:s');
		$this->existencia->save();

		//aqui guardamos el id actualizado o modificado
		$this->idExistencia = $this->existencia->EXI_clave;

		$cantidadTotal = Item::find($this->item)->ITE_cantidadtotal;
		
		$itemactualiza = Item::find($this->item);
		$itemactualiza->ITE_cantidadtotal = $cantidadTotal + $this->cantidad;
		$itemactualiza->save();

	}

	// se da una salida de un item existente
	public function salida(){

		//guardamos el movimiento realizado
		$this->altaMovimiento();
		// verificamos las existencias de almacen
		$this->existenciaAlmacen();

		$this->existencia->ITE_clave = $this->item;
		$this->existencia->ALM_clave = $this->almacen;
		$this->existencia->EXI_cantidad = $this->cantidadActual - $this->cantidad;
		$this->existencia->EXI_ultimoMovimiento = date('Y-m-d H:i:s');
		$this->existencia->save();

		//aqui guardamos el id actualizado o modificado
		$this->idExistencia = $this->existencia->EXI_clave;

		$cantidadTotal = Item::find($this->item)->ITE_cantidadtotal;
		
		$itemactualiza = Item::find($this->item);
		$itemactualiza->ITE_cantidadtotal = $cantidadTotal - $this->cantidad;
		$itemactualiza->save();

	}


}

?>