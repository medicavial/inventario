<?php 

class ItemProveedor extends Eloquent {

    protected $table = 'itemsProveedor';
    protected $guarded = []; 

    public function scopeTodo($query,$item)
    {
        return $query->Join('proveedores','itemsProveedor.PRO_clave', '=' ,'proveedores.PRO_clave')
        			 ->Join('items','itemsProveedor.ITE_clave', '=' ,'items.ITE_clave')
        			 ->where('itemsProveedor.ITE_clave',$item)
        			 ->orderBy('IPR_ultimoCosto')
        			 ->get();
    }

}		
