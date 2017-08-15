<?php

class SubTipoItemTableSeeder extends Seeder {

    public function run()
    {
        DB::table('subTiposItem')->truncate();

    	SubTipoItem::create(array(
            'STI_nombre' => 'Alto Consumo'
        ));

        SubTipoItem::create(array(
            'STI_nombre' => 'Bajo Consumo'
        ));

    }

}