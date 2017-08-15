<?php 

class Almacen extends Eloquent {

	protected $primaryKey ='ALM_clave';
    protected $table = 'almacenes';
    protected $guarded = []; 

    public function scopeActivos($query)
    {
        return $query->where('ALM_activo',true)->get();
    }

    public function scopeTodos($query)
    {
        return $query->join('unidades', 'almacenes.UNI_clave', '=', 'unidades.UNI_clave')
                     ->join('tiposAlmacen', 'almacenes.TAL_clave', '=', 'tiposAlmacen.TAL_clave')
                     ->select('almacenes.*','unidades.UNI_nombre','TAL_nombre')
                     ->orderBy('ALM_nombre')
                     ->get();
    }

    public function scopeUnidades($query)
    {
        return $query->join('unidades', 'almacenes.UNI_clave', '=', 'unidades.UNI_clave')
                     ->join('tiposAlmacen', 'almacenes.TAL_clave', '=', 'tiposAlmacen.TAL_clave')
        			 ->select('almacenes.*','unidades.UNI_nombre','TAL_nombre')
                     ->orderBy('ALM_nombre')
        			 ->where('ALM_activo',true)->get();
    }


    public function scopeUnidad($query,$unidad)
    {
        return $query->join('tiposAlmacen', 'almacenes.TAL_clave', '=', 'tiposAlmacen.TAL_clave')
                     ->where('UNI_clave',$unidad)
                     ->where('ALM_activo',true)
                     ->orderBy('ALM_nombre')
                     ->get();
    }

    public function scopeUsuario($query,$usuario)
    {   
        $almacenes = UsuarioAlmacen::where('USU_clave',$usuario)->select('ALM_clave')->get();

        return $query->whereNotIn('ALM_clave', $almacenes)
                     ->select('almacenes.*')
                     ->where('ALM_activo',true)
                     ->orderBy('ALM_nombre')
                     ->get();
    }


    public function scopeExistencia($query,$usuario)
    {   
        return $query->join('usuarioAlmacen', 'almacenes.ALM_clave', '=', 'usuarioAlmacen.ALM_clave')
                     ->select('almacenes.*')
                     ->where( array('ALM_activo' => true , 'USU_clave' => $usuario) )
                     ->orderBy('ALM_nombre')
                     ->get();
    }

}		
