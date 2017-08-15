<?php

class TipoItemTableSeeder extends Seeder {

    public function run()
    {
        DB::table('tiposItem')->truncate();

    	TipoItem::create(array(
            'TIT_nombre'=> 'Medicamento'
        ));

        TipoItem::create(array(
            'TIT_nombre'=> 'Ortesis'
        ));

        TipoItem::create(array(
            'TIT_nombre'=> 'Particulares'
        ));

        TipoItem::create(array(
            'TIT_nombre'=> 'Placas'
        ));

        TipoItem::create(array(
            'TIT_nombre'=> 'Curación'
        ));

        TipoItem::create(array(
            'TIT_nombre'=> 'Desechable'
        ));

    }

}