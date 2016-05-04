<?php 

class Receta extends Eloquent {

    protected $table = 'RecetaMedica';
    protected $primaryKey ='id_receta';
    protected $connection = 'mv';
    protected $guarded = []; 
    public $timestamps = false;
    
}		
