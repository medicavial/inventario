<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrdenItemsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('ordenItems', function(Blueprint $table)
		{
			$table->increments('OIT_clave');

			$table->integer('ITE_clave')->unsigned();
			$table->foreign('ITE_clave')->references('ITE_clave')->on('items');

			$table->integer('OCM_clave')->unsigned();
			$table->foreign('OCM_clave')->references('OCM_clave')->on('ordenCompra');

			$table->integer('OIT_cantidadPedida');
			$table->integer('OIT_cantidadSurtida');

			$table->decimal('OIT_precioEsperado',5,2);
			$table->decimal('OIT_precioFinal',5,2);

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
		Schema::drop('ordenItems');
	}

}
