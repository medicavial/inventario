<?php 

class OrdenCompra extends Eloquent {

    protected $table = 'ordenCompra';
    protected $primaryKey ='OCM_clave';


    public function scopeTodos($query)
    {
        return $query->join('tiposOrden', 'ordenCompra.TOR_clave', '=', 'tiposOrden.TOR_clave')
                     ->join('proveedores', 'ordenCompra.PRO_clave', '=', 'proveedores.PRO_clave')
                     ->join('usuarios', 'ordenCompra.USU_creo', '=', 'usuarios.USU_clave')
                     ->select('ordenCompra.*','PRO_nombre','TOR_nombre','USU_nombrecompleto')
                     ->get();
    }


}		
