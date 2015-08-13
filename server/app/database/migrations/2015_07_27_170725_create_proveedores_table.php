<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProveedoresTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('proveedores', function(Blueprint $table)
		{
			$table->increments('PRO_clave');
			$table->string('PRO_nombrecorto',100);
			$table->string('PRO_nombre');
			$table->string('PRO_rfc',20);
			$table->longText('PRO_razonSocial');
			$table->boolean('PRO_activo')->default(true);		
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('proveedores');
	}

}
