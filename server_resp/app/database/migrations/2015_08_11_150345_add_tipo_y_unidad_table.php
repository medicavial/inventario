<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTipoYUnidadTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('almacenes', function(Blueprint $table)
		{
			$table->integer('TAL_clave')->unsigned();
			$table->foreign('TAL_clave')->references('TAL_clave')->on('tiposAlmacen');

			$table->integer('UNI_clave')->unsigned();
			$table->foreign('UNI_clave')->references('UNI_clave')->on('unidades');
			
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('almacenes', function(Blueprint $table)
		{
			$table->dropColumn('TAL_clave');
			$table->dropColumn('UNI_clave');
		});
	}

}
