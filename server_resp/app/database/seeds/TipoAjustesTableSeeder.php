<?php

class TipoAjustesTableSeeder extends Seeder {

    public function run()
    {
        DB::table('tiposAjuste')->truncate();

    	TipoAjuste::create(array(
            'TIA_nombre'=> 'Inicial'
        ));

        TipoAjuste::create(array(
            'TIA_nombre'=> 'Critico'
        ));

    }

}