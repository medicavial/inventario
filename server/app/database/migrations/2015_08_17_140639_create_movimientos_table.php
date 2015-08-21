<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMovimientosTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('movimientos', function(Blueprint $table)
		{

			$table->increments('MOV_clave');
			
			$table->integer('ITE_clave')->unsigned();
			$table->foreign('ITE_clave')->references('ITE_clave')->on('items');

			$table->integer('ALM_clave')->unsigned();
			$table->foreign('ALM_clave')->references('ALM_clave')->on('almacenes');

			$table->integer('TIM_clave')->unsigned();
			$table->foreign('TIM_clave')->references('TIM_clave')->on('tiposMovimiento');

			$table->integer('TIA_clave')->unsigned();
			$table->foreign('TIA_clave')->references('TIA_clave')->on('tiposAjuste');

			$table->integer('USU_clave')->unsigned();
			$table->foreign('USU_clave')->references('USU_clave')->on('usuarios');

			$table->integer('MOV_cantidad');
			$table->string('MOV_observaciones');

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
		Schema::drop('movimientos');
	}

}
