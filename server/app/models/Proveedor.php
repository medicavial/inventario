<?php 

class Proveedor extends Eloquent {

	protected $primaryKey ='PRO_clave';
    protected $table = 'proveedores';
    protected $guarded = []; //para poder hacer consultas remotas (seguridad)

    public function scopeActivos($query)
    {
        return $query->where('PRO_activo',true)->get();
    }

}		
