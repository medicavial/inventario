<?php

class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		// Eloquent::unguard();

		$this->call('UserTableSeeder');
		$this->call('PermisoTableSeeder');
		$this->call('PresetnacionesTableSeeder');
		$this->call('TipoAjustesTableSeeder');
		$this->call('TipoAlmacenTableSeeder');
		$this->call('TipoItemTableSeeder');
		$this->call('TipoMovimientoTableSeeder');
		$this->call('TipoOrdenTableSeeder');
		$this->call('UnidadesTableSeeder');
		$this->call('SubTipoItemTableSeeder');
		
	}


}
