<?php 

class Unidad extends Eloquent {

	protected $primaryKey ='UNI_clave';
    protected $table = 'unidades';

    public function scopeActivos($query)
    {
        return $query->where('UNI_activo',true)->get();
    }

}		
