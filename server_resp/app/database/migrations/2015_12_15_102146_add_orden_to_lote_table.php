<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddOrdenToLoteTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('lote', function(Blueprint $table)
		{
			$table->integer('OCM_clave')->unsigned();
			$table->foreign('OCM_clave')->references('OCM_clave')->on('ordenCompra');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('lote', function(Blueprint $table)
		{
			$table->dropColumn('OCM_clave');
		});
	}

}
