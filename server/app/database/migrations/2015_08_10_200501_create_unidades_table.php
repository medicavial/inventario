<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUnidadesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('unidades', function(Blueprint $table)
		{
			$table->increments('UNI_clave');
			$table->longText('UNI_nombre');
			$table->string('UNI_nombrecorto',80);
			$table->string('UNI_nombreMV',80);
			$table->integer('UNI_claveMV');
			$table->boolean('UNI_activo')->default(true);
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
		Schema::drop('unidades');
	}

}
