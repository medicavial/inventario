<?php

class BusquedasController extends BaseController {

	public function almacenes(){
		return Almacen::unidades();
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

	public function items(){
		return Item::activos();
	}

	public function itemsProveedor(){
		return Item::proveedor();
	}

	public function permisos(){
		return Permiso::activos();
	}

	public function proveedores(){
		return Proveedor::activos();
	}

	public function subtipositem(){
		return SubTipoItem::activos();
	}

	public function tiposalmacen(){
		return TipoAlmacen::activos();
	}

	public function tipositem(){
		return TipoItem::activos();
	}

	public function usuarios(){
		return User::activos();
	}

	public function unidades(){
		return Unidad::activos();
	}

}
