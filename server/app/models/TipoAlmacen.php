<?php 

class TipoAlmacen extends Eloquent {

	protected $primaryKey ='TAL_clave';
    protected $table = 'tiposAlmacen';

    public function scopeActivos($query)
    {
        return $query->where('TAL_activo',true)->get();
    }


}		
