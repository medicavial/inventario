<?php

class UnidadesTableSeeder extends Seeder {

    public function run()
    {
        DB::table('unidades')->truncate();
        
    	Unidad::create(array(
            'UNI_nombre'=> 'MédicaVial Roma',
            'UNI_nombrecorto' => 'MV Roma',
            'UNI_nombreMV' => 'MV Obregón',
            'UNI_claveMV' => 33
        ));
        // Unidad::create(array(
        //     'UNI_nombre'=> 'MédicaVial Satélite',
        //     'UNI_nombrecorto' => 'MV Satelite',
        //     'UNI_nombreMV' => 'MV Satélite',
        //     'UNI_claveMV' => 51
        // ));
        // Unidad::create(array(
        //     'UNI_nombre'=> 'MédicaVial Perisur',
        //     'UNI_nombrecorto' => 'MV Perisur',
        //     'UNI_nombreMV' => 'MV Perisur',
        //     'UNI_claveMV' => 56
        // ));
        // Unidad::create(array(
        //     'UNI_nombre'=> 'MédicaVial Puebla',
        //     'UNI_nombrecorto' => 'MV Puebla',
        //     'UNI_nombreMV' => 'MV Puebla',
        //     'UNI_claveMV' => 84
        // ));
        // Unidad::create(array(
        //     'UNI_nombre'=> 'MédicaVial Monterrey',
        //     'UNI_nombrecorto' => 'MV Monterrey',
        //     'UNI_nombreMV' => 'MV Monterrey',
        //     'UNI_claveMV' => 105
        // ));
        // Unidad::create(array(
        //     'UNI_nombre'=> 'MédicaVial Mérida',
        //     'UNI_nombrecorto' => 'MV Merida',
        //     'UNI_nombreMV' => 'MV Mérida',
        //     'UNI_claveMV' => 112
        // ));
        // Unidad::create(array(
        //     'UNI_nombre'=> 'MédicaVial San Luis Potosí',
        //     'UNI_nombrecorto' => 'MV San Luis',
        //     'UNI_nombreMV' => 'MV San Luis Potosí',
        //     'UNI_claveMV' => 114
        // ));
        // Unidad::create(array(
        //     'UNI_nombre'=> 'Operacion Médicavial',
        //     'UNI_nombrecorto' => 'MV Ofnas',
        //     'UNI_nombreMV' => 'MV Operacion',
        //     'UNI_claveMV' => 0
        // ));
        // Unidad::create(array(
        //     'UNI_nombre'=> 'MédicaVial Chihuahua',
        //     'UNI_nombrecorto' => 'MV Chihuahua',
        //     'UNI_nombreMV' => 'MV Chihuahua',
        //     'UNI_claveMV' => 170
        // ));
        // Unidad::create(array(
        //     'UNI_nombre'=> 'MédicaVial Interlomas',
        //     'UNI_nombrecorto' => 'MV Interlomas',
        //     'UNI_nombreMV' => 'MV Interlomas',
        //     'UNI_claveMV' => 235
        // ));
        // Unidad::create(array(
        //     'UNI_nombre'=> 'MédicaVial Veracruz',
        //     'UNI_nombrecorto' => 'MV Veracruz',
        //     'UNI_nombreMV' => 'MV Veracruz',
        //     'UNI_claveMV' => 236
        // ));


    }

}