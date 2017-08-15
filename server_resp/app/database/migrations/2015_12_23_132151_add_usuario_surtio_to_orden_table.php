<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddUsuarioSurtioToOrdenTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('ordenCompra', function(Blueprint $table)
		{
			$table->integer('USU_surtio')->unsigned()->after('USU_cerro');
			$table->foreign('USU_surtio')->references('USU_clave')->on('usuarios');
			$table->dateTime('OCM_fechaSurtida')->after('USU_cerro');
			$table->boolean('OCM_surtida')->default(false)->after('USU_cerro');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('ordenCompra', function(Blueprint $table)
		{
			$table->dropColumn('USU_surtio');
			$table->dropColumn('OCM_fechaSurtida');
			$table->dropColumn('OCM_surtida');
		});
	}

}
