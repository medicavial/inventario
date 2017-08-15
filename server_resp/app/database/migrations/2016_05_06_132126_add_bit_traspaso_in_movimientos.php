<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddBitTraspasoInMovimientos extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('movimientos', function(Blueprint $table)
		{
			$table->boolean('MOV_traspaso')->after('MOV_cantidad');
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
			$table->dropColumn('MOV_traspaso');
		});
	}

}
