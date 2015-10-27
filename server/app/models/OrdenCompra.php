<?php 

class OrdenCompra extends Eloquent {

    protected $table = 'ordenCompra';
    protected $primaryKey ='OCM_clave';


    public function scopeTodos($query)
    {
        return $query->join('tiposOrden', 'ordenCompra.TOR_clave', '=', 'tiposOrden.TOR_clave')
                     ->join('proveedores', 'ordenCompra.PRO_clave', '=', 'proveedores.PRO_clave')
                     ->join('usuarios', 'ordenCompra.USU_creo', '=', 'usuarios.USU_clave')
                     ->select('ordenCompra.*','PRO_nombrecorto','TOR_nombre','USU_nombrecompleto')
                     ->get();
    }

    public function scopeBusca($query,$id)
    {
        return $query->join('tiposOrden', 'ordenCompra.TOR_clave', '=', 'tiposOrden.TOR_clave')
                     ->join('proveedores', 'ordenCompra.PRO_clave', '=', 'proveedores.PRO_clave')
                     ->join('usuarios', 'ordenCompra.USU_creo', '=', 'usuarios.USU_clave')
                     ->join('unidades', 'ordenCompra.UNI_clave', '=', 'unidades.UNI_clave')
                     ->select('ordenCompra.*','proveedores.*','TOR_nombre','USU_nombrecompleto','UNI_nombre')
                     ->where('OCM_clave',$id)
                     ->first();
    }

    public function scopePorSurtir($query,$item,$unidad)
    {
        return $query->join('ordenItems', 'ordenCompra.OCM_clave', '=', 'ordenItems.OCM_clave')
                     ->select(DB::raw('sum(OIT_cantidadPedida) as PorSurtir'))
                     ->groupBy('ITE_clave')
                     ->where('UNI_clave', $unidad)
                     ->where('ITE_clave', $item)
                     ->where('OCM_cancelada', '<>',1)
                     ->where('OCM_cerrada', '<>',1)
                     ->first();
    }

    public function scopeDetalle($query,$id)
    {
        return $query->join('ordenItems', 'ordenCompra.OCM_clave', '=', 'ordenItems.OCM_clave')
                     ->where('ordenCompra.OCM_clave',$id)
                     ->get();
    }


}		
