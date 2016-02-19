<?php 

class Reserva extends Eloquent {

	protected $primaryKey ='RES_clave';
    protected $table = 'reservas';
    protected $guarded = []; 
    public $timestamps = false;
    
}		
