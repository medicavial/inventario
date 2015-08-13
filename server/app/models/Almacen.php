<?php 

class Almacen extends Eloquent {

	protected $primaryKey ='ALM_clave';
    protected $table = 'almacenes';

    public function scopeActivos($query)
    {
        return $query->where('ALM_activo',true)->get();
    }


    public function scopeUnidades($query)
    {
        return $query->join('unidades', 'almacenes.UNI_clave', '=', 'unidades.UNI_clave')
                     ->join('tiposAlmacen', 'almacenes.TAL_clave', '=', 'tiposAlmacen.TAL_clave')
        			 ->select('almacenes.*','unidades.UNI_nombre','TAL_nombre')
        			 ->where('ALM_activo',true)->get();
    }

    public function scopeUsuario($query,$usuario)
    {   
        $almacenes = UsuarioAlmacen::where('USU_clave',$usuario)->select('ALM_clave')->get();

        return $query->whereNotIn('ALM_clave', $almacenes)
                     ->select('almacenes.*')
                     ->where('ALM_activo',true)
                     ->get();
    }

}		
