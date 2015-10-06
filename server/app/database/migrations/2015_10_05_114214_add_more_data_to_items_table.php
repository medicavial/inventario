<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMoreDataToItemsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('items', function(Blueprint $table)
		{
			$table->integer('ITE_clasificacion')->after('ITE_sustancia');
			$table->integer('ITE_codigoean')->after('ITE_sustancia');
			$table->integer('ITE_marca')->after('ITE_sustancia');
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
			$table->dropColumn('ITE_clasificacion');
			$table->dropColumn('ITE_codigoean');
			$table->dropColumn('ITE_marca');
		});
	}

}
