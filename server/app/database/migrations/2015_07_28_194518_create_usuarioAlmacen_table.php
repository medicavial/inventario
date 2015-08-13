<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsuarioAlmacenTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('usuarioAlmacen', function(Blueprint $table)
		{
			$table->integer('USU_clave')->unsigned();
			$table->foreign('USU_clave')->references('USU_clave')->on('usuarios');

			$table->integer('ALM_clave')->unsigned();
			$table->foreign('ALM_clave')->references('ALM_clave')->on('almaenes');

			$table->dateTime('UAL_fechaAsociado');
			$table->integer('USU_asocio')->unsigned();
			$table->foreign('USU_asocio')->references('USU_clave')->on('usuarios');

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
		Schema::drop('usuarioAlmacen');
	}

}
