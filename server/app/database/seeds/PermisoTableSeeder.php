<?php

class PermisoTableSeeder extends Seeder {

    public function run()
    {
        DB::table('permisos')->truncate();

    	Permiso::create(array(

            'PER_nombre'=> 'Administrador Sr.',
            'PER_entradas' => true,
            'PER_salidas' => true,
            'PER_traspasos' => true,
            'PER_consultaItems' => true,
            'PER_desactivaItems' => true,
            'PER_consultaCatalogo' => true,
            'PER_desactivaCatalogo' => true,
            'PER_autorizaOrden' => true,
            'PER_modificaOrden' => true,
            'PER_cerrarOrden' => true,
            'PER_surtir' => true,
            'PER_subirFactura' => true,
            'PER_asociar' => true
        ));

    }

}