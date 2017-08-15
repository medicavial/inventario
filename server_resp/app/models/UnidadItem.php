<?php 

class UnidadItem extends Eloquent {

	protected $primaryKey ='UTI_clave';
    protected $table = 'unidadesItem';
    protected $guarded = []; 

    public function scopeActivos($query)
    {
        return $query->where('UTI_activo',true)->get();
    }

}		
