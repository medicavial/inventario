<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePermisosTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('permisos', function(Blueprint $table)
		{
			$table->increments('PER_clave');
			$table->string('PER_nombre',100);
			$table->boolean('PER_entradas')->default(false);
			$table->boolean('PER_salidas')->default(false);
			$table->boolean('PER_traspasos')->default(false);
			$table->boolean('PER_consultaItems')->default(false);
			$table->boolean('PER_desactivaItems')->default(false);
			$table->boolean('PER_consultaCatalogo')->default(false);
			$table->boolean('PER_desactivaCatalogo')->default(false);
			$table->boolean('PER_autorizaOrden')->default(false);
			$table->boolean('PER_modificaOrden')->default(false);
			$table->boolean('PER_cerrarOrden')->default(false);
			$table->boolean('PER_surtir')->default(false);
			$table->boolean('PER_subirFactura')->default(false);
			$table->boolean('PER_asociar')->default(false);
			$table->boolean('PER_activo')->default(true);
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('permisos');
	}

}
