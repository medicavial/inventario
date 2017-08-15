<?php

class TipoOrdenTableSeeder extends Seeder {

    public function run()
    {
        DB::table('tiposOrden')->truncate();

    	TipoOrden::create(array(
            'TOR_nombre'=> 'Manual'
        ));

        TipoOrden::create(array(
            'TOR_nombre'=> 'Automatica'
        ));

    }

}