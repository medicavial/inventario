<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateConfigurationTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('configuraciones', function(Blueprint $table)
		{
			$table->increments('id');

			$table->integer('UNI_clave')->unsigned();
			$table->foreign('UNI_clave')->references('UNI_clave')->on('unidades');

			$table->integer('CON_nivelMinimo');
			$table->integer('CON_nivelMaximo');
			$table->integer('CON_nivelCompra');
			$table->integer('CON_correos');

			$table->boolean('CON_activo')->default(true);

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
		Schema::drop('configuraciones');
	}

}
