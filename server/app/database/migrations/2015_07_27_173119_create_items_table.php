<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateItemsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('items', function(Blueprint $table)
		{
			$table->increments('ITE_clave');
			$table->string('ITE_nombre');
			$table->decimal('ITE_precioventa',5,2);
			$table->integer('ITE_cantidadtotal');

			$table->integer('TIT_clave')->unsigned();
			$table->foreign('TIT_clave')->references('TIT_clave')->on('tiposItem');

			$table->integer('STI_clave')->unsigned();
			$table->foreign('STI_clave')->references('SIT_clave')->on('subTiposItem');

			$table->boolean('ITE_activo')->default(true);
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
		Schema::drop('items');
	}

}
