<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAlmacenesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('almacenes', function(Blueprint $table)
		{
			$table->increments('ALM_clave');
			$table->string('ALM_nombre',150);
			$table->longText('ALM_ubicacion');
			$table->longText('ALM_observaciones');
			$table->boolean('ALM_activo')->default(true);
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
		Schema::drop('almacenes');
	}

}
