<?php 

class Receta extends Eloquent {

    protected $table = 'NotaSuministros';
    protected $primaryKey ='NS_id';
    protected $connection = 'mv';
    protected $guarded = []; 
    public $timestamps = false;
    
}		