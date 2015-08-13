<?php 

class TipoItem extends Eloquent {

	protected $primaryKey ='TIT_clave';
    protected $table = 'tiposItem';

    public function scopeActivos($query)
    {
        return $query->where('TIT_activo',true)->get();
    }


}		
