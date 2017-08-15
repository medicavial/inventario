<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrdenFacturaTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('ordenFactura', function(Blueprint $table)
		{
			$table->integer('OCM_clave')->unsigned();
			$table->foreign('OCM_clave')->references('OCM_clave')->on('ordenCompra');

			$table->integer('FAC_clave')->unsigned();
			$table->foreign('FAC_clave')->references('FAC_clave')->on('facturas');
			
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
		Schema::drop('ordenFactura');
	}

}
