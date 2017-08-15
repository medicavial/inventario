<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddNoSegmentableRecetaInItems extends Migration {

	/**
	 * Migracion que agrega un bit a la tabla items para diferenciar items para no ser segmentados en caja en receta mv.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('items', function(Blueprint $table)
		{
			$table->boolean('ITE_noSegmentableReceta')->after('ITE_segmentable');
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
			$table->dropColumn('ITE_noSegmentableReceta');
		});
	}

}
