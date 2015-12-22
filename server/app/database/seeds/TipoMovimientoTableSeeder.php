<?php

class TipoMovimientoTableSeeder extends Seeder {

    public function run()
    {
        DB::table('tiposMovimiento')->truncate();

    	TipoMovimiento::create(array(
            'TIM_nombre'=> 'Ajuste'
        ));

        TipoMovimiento::create(array(
            'TIM_nombre'=> 'Entrada'
        ));

        TipoMovimiento::create(array(
            'TIM_nombre'=> 'Salida'
        ));

        TipoMovimiento::create(array(
            'TIM_nombre'=> 'Entrada Traspaso'
        ));

        TipoMovimiento::create(array(
            'TIM_nombre'=> 'Salida Traspaso'
        ));

    }

}