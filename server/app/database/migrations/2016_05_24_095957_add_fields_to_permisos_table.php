<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFieldsToPermisosTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('permisos', function(Blueprint $table)
		{

			$table->renameColumn('PER_entradas', 'PER_movimientos');
			$table->renameColumn('PER_consultaItems', 'PER_usuarios');
			$table->renameColumn('PER_desactivaItems', 'PER_perfiles');
			$table->renameColumn('PER_desactivaCatalogo', 'PER_modificaCatalogo');
			$table->renameColumn('PER_autorizaOrden', 'PER_generarOrden');
			$table->renameColumn('PER_modificaOrden', 'PER_completaOrden');
			$table->renameColumn('PER_surtir', 'PER_surtirOrden');
			$table->renameColumn('PER_asociar', 'PER_conexiones');
			
			$table->boolean('PER_alertas')->after('PER_activo')->default(false);
			$table->boolean('PER_salidasAgranel')->after('PER_activo')->default(false);
			$table->boolean('PER_recetaMV')->after('PER_activo')->default(false);
			$table->boolean('PER_tipos')->after('PER_activo')->default(false);
			$table->boolean('PER_reportes')->after('PER_activo')->default(false);


		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('permisos', function(Blueprint $table)
		{
			$table->dropColumn('PER_alertas');
			$table->dropColumn('PER_salidasAgranel');
			$table->dropColumn('PER_recetaMV');
			$table->dropColumn('PER_tipos');
			$table->dropColumn('PER_reportes');

			$table->renameColumn('PER_movimientos','PER_entradas');
			$table->renameColumn('PER_usuarios','PER_consultaItems');
			$table->renameColumn('PER_perfiles','PER_desactivaItems');
			$table->renameColumn('PER_modificaCatalogo','PER_desactivaCatalogo');
			$table->renameColumn('PER_generarOrden','PER_autorizaOrden');
			$table->renameColumn('PER_completaOrden','PER_modificaOrden');
			$table->renameColumn('PER_surtirOrden','PER_surtir');
			$table->renameColumn('PER_conexiones','PER_asociar');
		});
	}

}
