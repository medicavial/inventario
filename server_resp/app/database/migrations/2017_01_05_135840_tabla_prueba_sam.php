<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TablaPruebaSam extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('pruebas', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('nombre',100);
			$table->integer('edad');
			$table->float('estatura');
			$table->boolean('vivo');
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
		Schema::drop('pruebas');
	}

}
