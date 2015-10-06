<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddItemToConfTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('configuraciones', function(Blueprint $table)
		{
			$table->integer('ITE_clave')->unsigned()->after('UNI_clave');
			$table->foreign('ITE_clave')->references('ITE_clave')->on('items');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('configuraciones', function(Blueprint $table)
		{
			$table->dropColumn('ITE_clave');
		});
	}

}
