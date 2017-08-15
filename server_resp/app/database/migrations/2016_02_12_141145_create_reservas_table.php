<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateReservasTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('reservas', function(Blueprint $table)
		{
			$table->increments('RES_clave');
			$table->integer('ITE_clave')->unsigned();
			$table->foreign('ITE_clave')->references('ITE_clave')->on('items');
			$table->integer('ALM_clave')->unsigned();
			$table->foreign('ALM_clave')->references('ALM_clave')->on('almacenes');
			$table->integer('RES_cantidad');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('reservas');
	}

}
