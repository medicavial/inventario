<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateParametrosTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('parametros', function(Blueprint $table)
		{
			$table->increments('PAR_clave');
			$table->string('PAR_correoOrden');
			$table->string('PAR_correoClinicas');
			$table->string('PAR_responsable');
			$table->string('PAR_horaEntrega');
			$table->string('PAR_lugarEntrega');
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
		Schema::drop('parametros');
	}

}
