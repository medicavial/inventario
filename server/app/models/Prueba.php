<?php 

class Prueba extends Eloquent {

	protected $primaryKey ='id';
    protected $table = 'pruebas';
    protected $guarded = []; 
/*
    public function scopeActivos($query)
    {
        return $query->where('UNI_activo',true)->get();
    }
*/
}		
