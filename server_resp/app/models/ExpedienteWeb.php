<?php 

class ExpedienteWeb extends Eloquent {

    protected $table = 'Expediente';
    protected $primaryKey ='Exp_folio';
    protected $connection = 'mv';
    protected $guarded = []; 
    public $timestamps = false;
    
}		
