<?php 

class Configuracion extends Eloquent {

    protected $table = 'configuraciones';

    public function scopeActivos($query)
    {
        return $query->where('CON_activo',true)->get();
    }

}		
