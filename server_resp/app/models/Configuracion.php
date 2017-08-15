<?php 

class Configuracion extends Eloquent {

    protected $table = 'configuraciones';
    protected $guarded = []; 

    public function scopeActivos($query)
    {
        return $query->where('CON_activo',true)->get();
    }

}		
