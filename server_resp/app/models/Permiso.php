<?php 

class Permiso extends Eloquent {

	protected $primaryKey ='PER_clave';
    protected $table = 'permisos';
    protected $guarded = []; 

    public function scopeActivos($query)
    {
        return $query->where('PER_activo',true)->get();
    }

}		
