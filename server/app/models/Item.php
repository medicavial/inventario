<?php 

class Item extends Eloquent {

	protected $primaryKey ='ITE_clave';
    protected $table = 'items';

    public function scopeActivos($query)
    {
        return $query->where('ITE_activo',true)->get();
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

}		
