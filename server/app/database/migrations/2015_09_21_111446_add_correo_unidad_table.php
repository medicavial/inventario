<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCorreoUnidadTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('unidades', function(Blueprint $table)
		{
			$table->string('UNI_correo')->after('UNI_claveMV');
		
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('unidades', function(Blueprint $table)
		{
			$table->dropColumn('UNI_correo');
		});
	}

}
