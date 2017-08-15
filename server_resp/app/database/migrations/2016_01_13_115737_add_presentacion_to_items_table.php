<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddPresentacionToItemsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('items', function(Blueprint $table)
		{
			$table->string('ITE_presentacion')->after('ITE_sustancia');
			$table->boolean('ITE_talla')->after('ITE_segmentable');
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
			$table->dropColumn('ITE_presentacion');
			$table->dropColumn('ITE_talla');
		});
	}

}
