<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLoteTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('lote', function(Blueprint $table)
		{
			$table->increments('LOT_clave');

			$table->integer('ITE_clave')->unsigned();
			$table->foreign('ITE_clave')->references('ITE_clave')->on('items');

			$table->integer('EXI_clave')->unsigned();
			$table->foreign('EXI_clave')->references('EXI_clave')->on('existencias');

			$table->string('LOT_numero');
			$table->integer('LOT_cantidad');
			$table->dateTime('LOT_caducidad');

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
		Schema::drop('lote');
	}

}
