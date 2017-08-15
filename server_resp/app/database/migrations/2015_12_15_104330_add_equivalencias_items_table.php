<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddEquivalenciasItemsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('items', function(Blueprint $table)
		{
			$table->boolean('ITE_agranel')->after('ITE_precioventa');
			$table->boolean('ITE_segmentable')->after('ITE_precioventa');
			$table->integer('ITE_cantidadCaja')->after('ITE_precioventa');
			$table->integer('UTI_clave')->references('UTI_clave')->on('unidadesItem')->after('ITE_precioventa');
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
			$table->dropColumn('ITE_agranel');
			$table->dropColumn('ITE_segmentable');
			$table->dropColumn('ITE_cantidadCaja');
			$table->dropColumn('UTI_clave');
		});
	}

}
