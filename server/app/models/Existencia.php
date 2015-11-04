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

    public function scopeItem($query,$item)
    {
        return $query->join('items', 'existencias.ITE_clave', '=', 'items.ITE_clave')
                     ->join('almacenes', 'existencias.ALM_clave', '=', 'almacenes.ALM_clave')
                     ->join('unidades', 'almacenes.UNI_clave', '=', 'unidades.UNI_clave')
                     ->select('ITE_nombre','items.ITE_clave','almacenes.UNI_clave','almacenes.ALM_nombre','EXI_cantidad','EXI_ultimoMovimiento','UNI_nombrecorto')
                     ->where('items.ITE_clave', $item)
                     ->get();

    }


    public function scopeAlmacenes($query,$unidad,$almacenes)
    {

        return $query->join('items', 'existencias.ITE_clave', '=', 'items.ITE_clave')
                     ->join('almacenes', 'existencias.ALM_clave', '=', 'almacenes.ALM_clave')
                     ->join('configuraciones', function($join){
                            $join->on('configuraciones.ITE_clave','=', 'existencias.ITE_clave');
                            $join->on('configuraciones.UNI_clave','=', 'almacenes.UNI_clave');
                        })
                     ->select(DB::raw('existencias.ITE_clave,ITE_nombre,almacenes.UNI_clave,sum(EXI_cantidad) as EXI_cantidad,CON_nivelCompra,CON_nivelMinimo,CON_nivelMaximo'))
                     ->groupBy('ITE_clave')
                     ->where('almacenes.UNI_clave', $unidad)
                     ->whereIn('almacenes.ALM_clave', $almacenes)
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

    public function scopeUnidad($query,$unidad)
    {
        return $query->join('items', 'existencias.ITE_clave', '=', 'items.ITE_clave')
                     ->join('almacenes', 'existencias.ALM_clave', '=', 'almacenes.ALM_clave')
                     ->join('unidades', 'almacenes.UNI_clave', '=', 'unidades.UNI_clave')
                     ->select('ITE_nombre','items.ITE_clave','almacenes.UNI_clave','almacenes.ALM_nombre','EXI_cantidad','EXI_ultimoMovimiento','UNI_nombrecorto','almacenes.ALM_clave')
                     ->groupBy('ITE_clave')
                     ->where('almacenes.UNI_clave', $unidad)
                     ->get();

    }

    public function scopeReporteUnidad($query,$unidad)
    {
        return $query->join('items', 'existencias.ITE_clave', '=', 'items.ITE_clave')
                     ->join('almacenes', 'existencias.ALM_clave', '=', 'almacenes.ALM_clave')
                     ->join('unidades', 'almacenes.UNI_clave', '=', 'unidades.UNI_clave')
                     ->select('ITE_nombre','items.ITE_clave','almacenes.UNI_clave','almacenes.ALM_nombre','EXI_cantidad','EXI_ultimoMovimiento','UNI_nombrecorto','almacenes.ALM_clave')
                     ->where('almacenes.UNI_clave', $unidad)
                     ->get();

    }

    public function scopeConfiguracion($query,$unidad)
    {
        return $query->join('items', 'existencias.ITE_clave', '=', 'items.ITE_clave')
                     ->join('almacenes', 'existencias.ALM_clave', '=', 'almacenes.ALM_clave')
                     ->join('configuraciones', function($join){
                            $join->on('configuraciones.ITE_clave','=', 'existencias.ITE_clave');
                            $join->on('configuraciones.UNI_clave','=', 'almacenes.UNI_clave');
                        })
                     
                     ->select(DB::raw('existencias.ITE_clave,ITE_nombre,almacenes.UNI_clave,sum(EXI_cantidad) as EXI_cantidad,CON_nivelCompra,CON_nivelMinimo,CON_nivelMaximo,ITE_codigo'))
                     ->groupBy('ITE_clave')
                     ->where('almacenes.UNI_clave', $unidad)
                     ->get();

    }

}		
