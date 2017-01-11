<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SegundaPrueba extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('segundaPrueba', function(Blueprint $table)
		{
			$table->increments('id_cliente');
			$table->string('cliente',200);
			$table->string('domicilio', 350);
			$table->string('telefono',10);
			$table->string('email',80);
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
		Schema::drop('segundaPrueba');
	}

}
