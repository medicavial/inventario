<?php 

class Item extends Eloquent {

	protected $primaryKey ='ITE_clave';
    protected $table = 'items';
    protected $guarded = []; 

    public function scopeActivos($query)
    {
        return $query->join('tiposItem','items.TIT_clave','=','tiposItem.TIT_clave')
                     ->join('presentaciones','items.PRE_clave', '=' ,'presentaciones.PRE_clave')
                     ->where('ITE_activo',true)
                     ->orderBy('ITE_nombre')
                     ->get();
    }

    public function scopeTodos($query)
    {
        return $query->Join('tiposItem','items.TIT_clave', '=' ,'tiposItem.TIT_clave')
        			 ->Join('subTiposItem','items.STI_clave', '=' ,'subTiposItem.STI_clave')
        			 ->get();
    }

    public function scopeProveedor($query)
    {
        return $query->Join('itemsProveedor','items.ITE_clave', '=' ,'itemsProveedor.ITE_clave')
                     ->Join('proveedores','itemsProveedor.PRO_clave', '=' ,'proveedores.PRO_clave')
                     ->select('ITE_nombre','itemsProveedor.*','PRO_nombre')
                     ->get();
    }

    public function scopeUnidad($query,$item,$unidad)
    {
        return $query->Join('configuraciones','items.ITE_clave', '=' ,'configuraciones.ITE_clave')
                     ->where('configuraciones.UNI_clave',$unidad)
                     ->where('configuraciones.ITE_clave',$item)
                     ->get();
    }


    public function tipoItem()
    {
        return $this->hasOne('TipoItem', 'TIT_clave', 'TIT_clave');
    }


    public function configuracion($query,$unidad){
        
        // return $query->join('items', 'existencias.ITE_clave', '=', 'items.ITE_clave')
        //              ->join('almacenes', 'existencias.ALM_clave', '=', 'almacenes.ALM_clave')
        //              ->join('unidades', 'almacenes.UNI_clave', '=', 'unidades.UNI_clave')
        //              ->select('ITE_nombre','items.ITE_clave','almacenes.UNI_clave','almacenes.ALM_nombre','EXI_cantidad','EXI_ultimoMovimiento','UNI_nombrecorto','almacenes.ALM_clave')
        //              ->where('almacenes.UNI_clave', $unidad)
        //              ->groupBy('ITE_clave')
        //              ->orderBy('ITE_nombre')
        //              ->get();
    }

}		
