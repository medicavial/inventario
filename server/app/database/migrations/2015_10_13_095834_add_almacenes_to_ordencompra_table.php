<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAlmacenesToOrdencompraTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('ordenCompra', function(Blueprint $table)
		{
			$table->integer('UNI_clave')->unsigned()->after('PRO_clave');
			$table->foreign('UNI_clave')->references('UNI_clave')->on('unidades');
			$table->string('OCM_almacenes')->after('PRO_clave');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('ordenCompra', function(Blueprint $table)
		{
			$table->dropColumn('UNI_clave');
			$table->dropColumn('OCM_almacenes');
		});
	}

}
