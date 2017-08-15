<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateItemsProveedorTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('itemsProveedor', function(Blueprint $table)
		{

			$table->integer('ITE_clave')->unsigned();
			$table->foreign('ITE_clave')->references('ITE_clave')->on('items');

			$table->integer('PRO_clave')->unsigned();
			$table->foreign('PRO_clave')->references('PRO_clave')->on('proveedores');

			$table->decimal('IPR_ultimoCosto',5,2);
			$table->dateTime('IPR_ultimaFecha');

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
		Schema::drop('itemsProveedor');
	}

}
