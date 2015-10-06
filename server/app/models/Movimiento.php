<?php 

class Movimiento extends Eloquent {

	protected $primaryKey ='MOV_clave';
    protected $table = 'movimientos';

    public function scopeTodos($query)
    {
        return $query->join('items', 'movimientos.ITE_clave', '=', 'items.ITE_clave')
                     ->join('almacenes', 'movimientos.ALM_clave', '=', 'almacenes.ALM_clave')
                     ->join('usuarios', 'movimientos.USU_clave', '=', 'usuarios.USU_clave')
                     ->join('tiposMovimiento', 'movimientos.TIM_clave', '=', 'tiposMovimiento.TIM_clave')
                     ->leftJoin('tiposAjuste', 'movimientos.TIA_clave', '=', 'tiposAjuste.TIA_clave')
                     ->leftJoin('ordenCompra', 'movimientos.OCM_clave', '=', 'ordenCompra.OCM_clave')
                     ->select('movimientos.*','ITE_nombre','ALM_nombre','USU_login','TIM_nombre', 'TIA_nombre','ITE_codigo')
                     ->get();
    }

}		
