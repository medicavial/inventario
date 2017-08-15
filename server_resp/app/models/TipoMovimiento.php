<?php 

class TipoMovimiento extends Eloquent {

	protected $primaryKey ='TIM_clave';
    protected $table = 'tiposMovimiento';
    protected $guarded = []; 

    public function scopeActivos($query)
    {
        return $query->where('TIM_activo',true)->get();
    }

}		
