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
		
		$permiso->PER_alertas = Input::get('alertas');
        $permiso->PER_conexiones = Input::get('conexion');
        $permiso->PER_movimientos = Input::get('movimientos');
        $permiso->PER_traspasos = Input::get('traspasos');
        $permiso->PER_generarOrden = Input::get('generaOrden');
        $permiso->PER_surtirOrden = Input::get('surtirOrden');
        $permiso->PER_cerrarOrden = Input::get('cerrarOrden');
        $permiso->PER_completaOrden = Input::get('completaOrden');
        $permiso->PER_salidasAgranel = Input::get('salidasAgranel');
        $permiso->PER_recetaMV = Input::get('recetaMV');
        $permiso->PER_usuarios = Input::get('usuarios');
        $permiso->PER_perfiles = Input::get('perfiles');
        $permiso->PER_tipos = Input::get('tipos');
        $permiso->PER_consultaCatalogo = Input::get('catalogos');
        $permiso->PER_modificaCatalogo = Input::get('editaCatalogos');
        $permiso->PER_reportes = Input::get('reportes');
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
		
		$permiso->PER_alertas = Input::get('alertas');
        $permiso->PER_conexiones = Input::get('conexion');
        $permiso->PER_movimientos = Input::get('movimientos');
        $permiso->PER_traspasos = Input::get('traspasos');
        $permiso->PER_generarOrden = Input::get('generaOrden');
        $permiso->PER_surtirOrden = Input::get('surtirOrden');
        $permiso->PER_cerrarOrden = Input::get('cerrarOrden');
        $permiso->PER_completaOrden = Input::get('completaOrden');
        $permiso->PER_salidasAgranel = Input::get('salidasAgranel');
        $permiso->PER_recetaMV = Input::get('recetaMV');
        $permiso->PER_usuarios = Input::get('usuarios');
        $permiso->PER_perfiles = Input::get('perfiles');
        $permiso->PER_tipos = Input::get('tipos');
        $permiso->PER_consultaCatalogo = Input::get('catalogos');
        $permiso->PER_modificaCatalogo = Input::get('editaCatalogos');
        $permiso->PER_reportes = Input::get('reportes');

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
