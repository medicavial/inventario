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

}		
