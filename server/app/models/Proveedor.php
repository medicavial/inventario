<?php 

class Proveedor extends Eloquent {

	protected $primaryKey ='PRO_clave';
    protected $table = 'proveedores';

    public function scopeActivos($query)
    {
        return $query->where('PRO_activo',true)->get();
    }

}		
