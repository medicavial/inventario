<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddRecetaToMovimientos extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('movimientos', function(Blueprint $table)
		{
			$table->integer('id_receta')->after('OCM_clave');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('movimientos', function(Blueprint $table)
		{
			$table->dropColumn('id_receta');
		});
	}

}
