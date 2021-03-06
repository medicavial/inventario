<?php 

class OrdenItem extends Eloquent {

    protected $table = 'ordenItems';
    protected $primaryKey ='OIT_clave';

    public function scopeOrden($query,$id)
    {
        return $query->join('items', 'ordenItems.ITE_clave', '=', 'items.ITE_clave')
        			 ->where('OCM_clave',$id)->get();
    }
}		
