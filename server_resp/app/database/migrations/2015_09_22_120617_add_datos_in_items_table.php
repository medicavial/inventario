<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDatosInItemsTable extends Migration {

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
			$table->string('ITE_posologia')->after('STI_clave');
			$table->integer('PRE_clave')->unsigned()->after('STI_clave');
			$table->foreign('PRE_clave')->references('PRE_clave')->on('presentaciones');
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
			$table->dropColumn('ITE_codigo');
			$table->dropColumn('ITE_sustancia');
			$table->dropColumn('ITE_posologia');
			$table->dropColumn('PRE_clave');
		});
	}

}
