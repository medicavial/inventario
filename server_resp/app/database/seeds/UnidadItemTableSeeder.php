<?php

class UnidadItemTableSeeder extends Seeder {

    public function run()
    {
        DB::table('unidadesItem')->truncate();

    	UnidadItem::create(array(
            'UTI_nombre'=> 'Ampolleta'
        ));

        UnidadItem::create(array(
            'UTI_nombre'=> 'Aguja'
        ));

        UnidadItem::create(array(
            'UTI_nombre'=> 'Pieza'
        ));

        UnidadItem::create(array(
            'UTI_nombre'=> 'Critico'
        ));

        UnidadItem::create(array(
            'UTI_nombre'=> 'Dm'
        ));

    }

}