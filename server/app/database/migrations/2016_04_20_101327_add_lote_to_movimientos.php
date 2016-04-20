<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddLoteToMovimientos extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('movimientos', function(Blueprint $table)
		{
			$table->integer('LOT_clave')->unsigned()->after('OCM_clave');
			$table->foreign('LOT_clave')->references('LOT_clave')->on('lote');
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
			$table->dropColumn('LOT_clave');
		});
	}

}
