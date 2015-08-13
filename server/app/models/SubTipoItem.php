<?php 

class SubTipoItem extends Eloquent {

	protected $primaryKey ='STI_clave';
    protected $table = 'subTiposItem';

    public function scopeActivos($query)
    {
        return $query->where('STI_activo',true)->get();
    }

}		
