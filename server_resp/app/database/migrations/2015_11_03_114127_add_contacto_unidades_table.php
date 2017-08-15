<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddContactoUnidadesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	
	public function up()
	{
		Schema::table('unidades', function(Blueprint $table)
		{
			$table->string('UNI_direccion')->after('UNI_correo');
			$table->string('UNI_horaentrega')->after('UNI_correo');
			$table->string('UNI_responsable')->after('UNI_correo');
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
			$table->dropColumn('UNI_direccion');
			$table->dropColumn('UNI_horaentrega');
			$table->dropColumn('UNI_responsable');
		});
	}

}
