<?php

class PermisosController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	//muestra todos los permisos activos/inactivos
	public function index()
	{
		return Permiso::all();
	}


	// muestra todos los permios activos
	public function actives()
	{
		return Permiso::activos();
	}


	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		$permiso = new Permiso;

		$permiso->PER_nombre = Input::get('nombre');
		
		$permiso->PER_entradas = Input::get('entradas');
        $permiso->PER_salidas = Input::get('salidas');
        $permiso->PER_traspasos = Input::get('traspasos');
        $permiso->PER_consultaItems = Input::get('editaItem');
        $permiso->PER_desactivaItems = Input::get('desactivaItem');
        $permiso->PER_consultaCatalogo = Input::get('editaCatalogos');
        $permiso->PER_desactivaCatalogo = Input::get('desactivaCatalogos');
        $permiso->PER_autorizaOrden = Input::get('autorizaorden');
        $permiso->PER_modificaOrden = Input::get('modificaorden');
        $permiso->PER_cerrarOrden = Input::get('cerrarorden');
        $permiso->PER_surtir = Input::get('surtir');
        $permiso->PER_subirFactura = Input::get('facturas');
        $permiso->PER_asociar = Input::get('asociar');
        $permiso->PER_activo = Input::get('activo');

		$permiso->save();

		return Response::json(array('respuesta' => 'Perfil Guardado Correctamente'));
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		return Permiso::find($id);
	}


	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		$permiso = Permiso::find($id);

		$permiso->PER_nombre = Input::get('nombre');
		
		$permiso->PER_entradas = Input::get('entradas');
        $permiso->PER_salidas = Input::get('salidas');
        $permiso->PER_traspasos = Input::get('traspasos');
        $permiso->PER_consultaItems = Input::get('editaItem');
        $permiso->PER_desactivaItems = Input::get('desactivaItem');
        $permiso->PER_consultaCatalogo = Input::get('editaCatalogos');
        $permiso->PER_desactivaCatalogo = Input::get('desactivaCatalogos');
        $permiso->PER_autorizaOrden = Input::get('autorizaorden');
        $permiso->PER_modificaOrden = Input::get('modificaorden');
        $permiso->PER_cerrarOrden = Input::get('cerrarorden');
        $permiso->PER_surtir = Input::get('surtir');
        $permiso->PER_subirFactura = Input::get('facturas');
        $permiso->PER_asociar = Input::get('asociar');
        $permiso->PER_activo = Input::get('activo');

		$permiso->save();

		return Response::json(array('respuesta' => 'Perfil Actualizado Correctamente'));
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}


}
