<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddForzosoToTiposItem extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('tiposItem', function(Blueprint $table)
		{
			$table->boolean('TIT_forzoso')->after('TIT_nombre');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('tiposItem', function(Blueprint $table)
		{
			$table->dropColumn('TIT_forzoso');
		});
	}

}
