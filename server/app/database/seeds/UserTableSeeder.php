<?php

class UserTableSeeder extends Seeder {

    public function run()
    {
        DB::table('usuarios')->truncate();

    	User::create(array(

            'USU_nombrecompleto'	=> 'Administrador',
            'USU_login'      		=> 'admin',
            'USU_psw'      			=> Hash::make('sistemas') //hashes our password nicely for us
            // 'remember_token'=> hash('sha256',Str::random(10),false)
 
        ));

    }

}