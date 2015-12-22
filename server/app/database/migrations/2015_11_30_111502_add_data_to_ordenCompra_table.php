<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDataToOrdenCompraTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('ordenCompra', function(Blueprint $table)
		{
			$table->integer('OCM_bolsas')->after('OCM_cerrada');
			$table->integer('OCM_cajas')->after('OCM_cerrada');
			$table->string('OCM_guia')->after('OCM_cerrada');
			$table->string('OCM_bultos')->after('OCM_cerrada');
			$table->string('OCM_entrega')->after('OCM_cerrada');
			$table->longText('OCM_observacionEntrega')->after('OCM_cerrada');
			$table->longText('OCM_observacionesVerificacion')->after('OCM_cerrada');
			$table->integer('OCM_verificacion')->after('OCM_cerrada');
			$table->boolean('OCM_incompleta')->after('OCM_cerrada');
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
			$table->dropColumn('OCM_bolsas');
			$table->dropColumn('OCM_cajas');
			$table->dropColumn('OCM_guia');
			$table->dropColumn('OCM_bultos');
			$table->dropColumn('OCM_entrega');
			$table->dropColumn('OCM_observacionEntrega');
			$table->dropColumn('OCM_observacionesVerificacion');
			$table->dropColumn('OCM_verificacion');
			$table->dropColumn('OCM_incompleta');
		});
	}

}
