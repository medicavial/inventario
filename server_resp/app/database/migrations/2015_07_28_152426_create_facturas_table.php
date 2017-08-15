<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFacturasTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('facturas', function(Blueprint $table)
		{
			$table->increments('FAC_clave');
			$table->integer('PRO_clave')->unsigned();
			$table->foreign('PRO_clave')->references('PRO_clave')->on('proveedores');
			$table->decimal('FAC_importe',6,2);
			$table->decimal('FAC_iva',5,2);
			$table->decimal('FAC_total',6,2);
			$table->string('FAC_folio',20);
			$table->string('FAC_folioFiscal',50);
			$table->boolean('FAC_cancelada')->default(false);
			$table->dateTime('FAC_fechaEntrada');
			$table->dateTime('FAC_fechaPagada');
			$table->dateTime('FAC_fechacancelada');
			$table->integer('USU_cancela')->unsigned();
			$table->foreign('USU_cancela')->references('USU_clave')->on('usuarios');

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
		Schema::drop('facturas');
	}

}
