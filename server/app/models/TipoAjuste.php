<?php 

class TipoAjuste extends Eloquent {

	protected $primaryKey ='TIA_clave';
    protected $table = 'tiposAjuste';

    public function scopeActivos($query)
    {
        return $query->where('TIA_activo',true)->get();
    }

}		
