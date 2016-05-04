<?php

class Operacion {

	public $tipomovimiento;
	public $item;
	public $almacen;
	public $cantidad;
	public $tipoajuste;
	public $idLote;
	public $lote;
	public $orden;
	public $caducidad;
	public $usuario;
	public $observaciones;
	public $receta;

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

	//funccion para dar de alta lote
	private function altaLote(){

		$datosLote = new Lote;
		$datosLote->EXI_clave = $this->idExistencia;
		$datosLote->ITE_clave = $this->item;
		$datosLote->LOT_numero = $this->lote;
		$datosLote->LOT_cantidad = $this->cantidad;
		$datosLote->LOT_caducidad = $this->caducidad;
		$datosLote->save();

	}

	private function actualizaLote($tipo){

		$catidadActualLote = Lote::find($this->idLote)->LOT_cantidad;
		//ajuste
		if ($tipo == 1) {
			$catidadIngresada = $this->cantidad;
		//entrada
		}elseif ($tipo == 2) {
			$catidadIngresada = $catidadActualLote  + $this->cantidad;
		//salida
		}elseif ($tipo == 3) {
			$catidadIngresada = $catidadActualLote  - $this->cantidad;
		}

		$datosLote = Lote::find($this->idLote);
		$datosLote->EXI_clave = $this->idExistencia;
		$datosLote->ITE_clave = $this->item;
		$datosLote->LOT_numero = $this->lote;
		$datosLote->LOT_cantidad = $catidadIngresada;
		$datosLote->LOT_caducidad = $this->caducidad;
		$datosLote->save();

	}

	public function verificaLote(){

		if ($this->idLote == '' && $this->lote != '') {
			$this->altaLote();
		}elseif ($this->idLote != '') {
			//decimos que el tipo 3 es una salida
			$this->actualizaLote($this->tipomovimiento);
		}
	}

	public function altaMovimiento(){

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

		$movimiento->save();

	}

	//se crea el alta de existencia de un item / o ajuste forzoso
	public function alta(){


		// verificamos las existencias de almacen y lote
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

		$this->existenciaAlmacen();

		$this->existencia->ITE_clave = $this->item;
		$this->existencia->ALM_clave = $this->almacen;
		$this->existencia->EXI_cantidad = $this->cantidadActual + $this->cantidad;
		$this->existencia->EXI_ultimoMovimiento = date('Y-m-d H:i:s');
		$this->existencia->save();

		$cantidadTotal = Item::find($this->item)->ITE_cantidadtotal;
		
		$itemactualiza = Item::find($this->item);
		$itemactualiza->ITE_cantidadtotal = $cantidadTotal + $this->cantidad;
		$itemactualiza->save();

	}

	// se da una salida de un item existente
	public function salida(){

		$this->existenciaAlmacen();

		$this->existencia->ITE_clave = $this->item;
		$this->existencia->ALM_clave = $this->almacen;
		$this->existencia->EXI_cantidad = $this->cantidadActual - $this->cantidad;
		$this->existencia->EXI_ultimoMovimiento = date('Y-m-d H:i:s');
		$this->existencia->save();

		$cantidadTotal = Item::find($this->item)->ITE_cantidadtotal;
		
		$itemactualiza = Item::find($this->item);
		$itemactualiza->ITE_cantidadtotal = $cantidadTotal - $this->cantidad;
		$itemactualiza->save();

	}


}

?>