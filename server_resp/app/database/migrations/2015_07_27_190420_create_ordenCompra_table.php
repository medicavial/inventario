<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrdenCompraTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('ordenCompra', function(Blueprint $table)
		{
			$table->increments('OCM_clave');
			$table->dateTime('OCM_fechaReg');
			
			$table->integer('TOR_clave')->unsigned();
			$table->foreign('TOR_clave')->references('TOR_clave')->on('tiposOrden');

			$table->integer('USU_creo')->unsigned();
			$table->foreign('USU_creo')->references('USU_clave')->on('usuarios');

			$table->integer('PRO_clave')->unsigned();
			$table->foreign('PRO_clave')->references('PRO_clave')->on('proveedores');

			$table->boolean('OCM_cerrada')->default(false);
			$table->dateTime('OCM_fechaCerrada');

			$table->integer('USU_cerro')->unsigned();
			$table->foreign('USU_cerro')->references('USU_clave')->on('usuarios');

			$table->boolean('OCM_cancelada')->default(false);
			$table->dateTime('OCM_fechaCancelacion');
			$table->longText('OCM_motivo');

			$table->integer('USU_cancelo')->unsigned();
			$table->foreign('USU_cancelo')->references('USU_clave')->on('usuarios');

			$table->decimal('OCM_importeEsperado',10,2);
			$table->decimal('OCM_importeFinal',10,2);
			$table->boolean('OCM_pagada')->default(false);
			$table->dateTime('OCM_fechaPagada');
			
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
		Schema::drop('ordenCompra');
	}

}
