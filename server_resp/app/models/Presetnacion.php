<?php 

class Presentacion extends Eloquent {

	protected $primaryKey ='PRE_clave';
    protected $table = 'presentaciones';
    protected $guarded = []; 

    public function scopeActivos($query)
    {
        return $query->where('PRE_activo',true)->get();
    }

}		
