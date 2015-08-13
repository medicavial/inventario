<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateExistenciasTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('existencias', function(Blueprint $table)
		{
			$table->increments('EXI_clave');

			$table->integer('ITE_clave')->unsigned();
			$table->foreign('ITE_clave')->references('ITE_clave')->on('items');

			$table->integer('ALM_clave')->unsigned();
			$table->foreign('ALM_clave')->references('ALM_clave')->on('almacenes');

			$table->integer('EXI_cantidad');
			$table->dateTime('EXI_ultimoMovimiento');

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
		Schema::drop('existencias');
	}

}
