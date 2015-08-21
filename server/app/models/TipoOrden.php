<?php 

class TipoOrden extends Eloquent {

    protected $table = 'tiposOrden';
    protected $primaryKey ='TOR_clave';

    public function scopeActivos($query)
    {
        return $query->where('TOR_activo',true)->get();

    }

}		
