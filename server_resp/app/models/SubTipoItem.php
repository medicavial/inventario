<?php 

class SubTipoItem extends Eloquent {

	protected $primaryKey ='STI_clave';
    protected $table = 'subTiposItem';
    protected $guarded = []; 

    public function scopeActivos($query)
    {
        return $query->where('STI_activo',true)->get();
    }

}		
