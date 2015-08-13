<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSurtioOrdenItemTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('surtidoOrdenItem', function(Blueprint $table)
		{
			$table->increments('SOI_clave');

			$table->integer('USU_surtio')->unsigned();
			$table->foreign('USU_surtio')->references('USU_clave')->on('usuarios');

			$table->dateTime('SOI_fechaReg');
			$table->integer('SOI_cantidadSurtida');

			$table->integer('OIT_clave')->unsigned();
			$table->foreign('OIT_clave')->references('OIT_clave')->on('ordenItems');

			$table->integer('ALM_clave')->unsigned();
			$table->foreign('ALM_clave')->references('ALM_clave')->on('almaenes');

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
		Schema::drop('surtidoOrdenItem');
	}

}
