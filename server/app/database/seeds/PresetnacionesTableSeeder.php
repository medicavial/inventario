<?php

class PresetnacionesTableSeeder extends Seeder {

    public function run()
    {
        DB::table('presentaciones')->truncate();

    	Presentacion::create(array('PRE_nombre'	=> 'Capsula'));

        Presentacion::create(array('PRE_nombre' => 'Pastilla'));

        Presentacion::create(array('PRE_nombre' => 'Tableta'));

        Presentacion::create(array('PRE_nombre' => 'Ampolleta'));

        Presentacion::create(array('PRE_nombre' => 'General'));

    }

}