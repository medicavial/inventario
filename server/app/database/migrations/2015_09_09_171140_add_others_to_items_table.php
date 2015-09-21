<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddOthersToItemsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('items', function(Blueprint $table)
		{
			$table->string('ITE_codigo')->after('ITE_clave');
			$table->string('ITE_sustancia')->after('STI_clave');
			$table->string('ITE_presentacion')->after('STI_clave');
			$table->string('ITE_posologia')->after('STI_clave');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('items', function(Blueprint $table)
		{
			//
		});
	}

}
