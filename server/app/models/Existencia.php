<?php 

class Existencia extends Eloquent {

	protected $primaryKey ='EXI_clave';
    protected $table = 'existencias';

    public function scopeBusca($query,$item,$almacen)
    {
        return $query->where( array('ITE_clave' => $item,'ALM_clave' => $almacen) );

    }

    public function scopeItems($query,$almacen)
    {
        return $query->join('items', 'existencias.ITE_clave', '=', 'items.ITE_clave')
                     ->select('ITE_nombre','EXI_cantidad','EXI_ultimoMovimiento', 'existencias.updated_at','existencias.ITE_clave')
                     ->where('ALM_clave',$almacen)
                     ->get();

    }

    public function scopeUsuario($query,$usuario)
    {
        return $query->join('items', 'existencias.ITE_clave', '=', 'items.ITE_clave')
                     ->join('almacenes', 'existencias.ALM_clave', '=', 'almacenes.ALM_clave')
                     ->join('unidades', 'almacenes.UNI_clave', '=', 'unidades.UNI_clave')
                     ->join('usuarioAlmacen', 'almacenes.ALM_clave', '=', 'usuarioAlmacen.ALM_clave')
                     ->select('ITE_nombre','EXI_cantidad','EXI_ultimoMovimiento', 'UNI_nombrecorto','ALM_nombre')
                     ->where('USU_clave',$usuario)
                     ->get();

    }

}		
