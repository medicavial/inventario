<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddOthersToProveedoresTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('proveedores', function(Blueprint $table)
		{
			$table->string('PRO_correo1')->after('PRO_rfc');
			$table->string('PRO_correo2')->after('PRO_rfc');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('proveedores', function(Blueprint $table)
		{
			$table->dropColumn('PRO_correo1');
			$table->dropColumn('PRO_correo2');
		});
	}

}
