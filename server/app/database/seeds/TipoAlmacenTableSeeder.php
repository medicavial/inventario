<?php

class TipoAlmacenTableSeeder extends Seeder {

    public function run()
    {
        
        DB::table('tiposAlmacen')->truncate();

    	TipoAlmacen::create(array(
            'TAL_nombre'=> 'Principal'
        ));

        TipoAlmacen::create(array(
            'TAL_nombre'=> 'Botiquin'
        ));

    }

}