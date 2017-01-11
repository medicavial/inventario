<?php


class MedicaController extends BaseController {

	public function tabulador($claveLesion,$folio){

		$queryLesion = "SELECT Clave_lesionCia FROM LesionEquivalencia where Clave_lesionMV='". $claveLesion ."'";
		$datoLesion =  DB::connection('mv')->select($queryLesion)[0];
        $lesionCia  = $datoLesion->Clave_lesionCia;

        $queryFolio = "SELECT PRO_clave, LOC_claveint, Cia_clave, Esc_clave, Exp_fecreg,Unidad.Uni_clave,Exp_poliza,Uni_propia,RIE_clave from Expediente
		          INNER JOIN Unidad on Expediente.Uni_clave = Unidad.Uni_clave 
		          WHERE Exp_folio='".$folio."'";

		$datos =  DB::connection('mv')->select($queryFolio)[0];

        $producto       = $datos->PRO_clave;
        $poliza         = $datos->Exp_poliza;
        $localidad      = $datos->LOC_claveint;
        $compania       = $datos->Cia_clave;
        $escolaridad    = $datos->Esc_clave;
        $fechaRegistro  = $datos->Exp_fecreg;
        $unidad         = $datos->Uni_clave;
        $unidadPropia   = $datos->Uni_propia;
        $riesgo   = $datos->RIE_clave;

        $clave = 0;
        
        //AXA completo
        if ($compania == 7)
        {
            if ($producto == 12)
            {
                if ($localidad == 18) {
                    $clave = 95;
                }else {
                    $clave = 61; 
                }
            }
            elseif($producto == 15)
            {
                if($localidad == 1 || $localidad == 2 || $localidad == 3){ 
                    $clave = 46;
                }else {
                    $clave = 47;      
                }
            }      
            elseif ($producto == 1)
            {
                if ($unidad == 5){ 
                    $clave = 28;
                }elseif ($localidad != 18){ 
                    $clave = 52;
                }else {
                    $clave = 61;  
                }
            }else{
                $clave = 61;                
            }
        }

        
        //QUALITAS****************************************************************************************************
        //solo DF
        if($compania == 19){

            if ($producto == 1){
                //mv puevla
                if ($unidad == 4) {                    
                    $clave = 7;
                //mv monterrey
                }elseif ($unidad == 5) {                    
                    $clave = 28;
                //Sasc Ixtapaluca y es mayor a 1 de noviembre 2016
                }elseif ( ($unidad == 110 || $unidad == 266 || $unidad == 65) && date($fechaRegistro) >= date('2016-11-01 00:00:00')) {
                    $clave = 108;
                }else{                    
                    $clave = 63;
                }

            //No Qx
            }elseif($producto == 9){

                //si son unidades de red especificos o propias de DF 
                if (  ( ( $unidad == 232 || $unidad == 125 || $unidad == 249 || ( $localidad == 18 && $unidadPropia == 'S') ) ) && date($fechaRegistro) >= date('2016-11-01 00:00:00')  ) {                                    
                    $clave = 107;

                }else{                    
                    $clave = 63;
                }
            }

        }


        // ABA tabulador completo
        if ($compania == 1)
        {
            if ($producto == 1) {

                if ($unidadPropia == 'S')
                {
                    if($unidad == 5){
                        $clave = 28;
                    } 
                    elseif ($unidad == 4){
                        $clave = 40;
                    } 
                    else{
                        $clave = 82;
                    } 
                          
                }else{
                    $clave = 102;
                }  

            }else{
                $clave = 61;
            }
        }



        //AFIRME completo
        if ($compania == 2)
        {   
            if ($producto == 1) {
                $clave = 11;
            }else{
                $clave = 61;
            }
        }


        // AGUILA completo
        if ($compania == 3)
        {
            if ($producto == 9)
            {
                if($localidad == 18 || $localidad == 29 || $localidad == 81){ 
                    $clave = 96;
                }else {
                    $clave = 61;
                }
            }
            elseif ($producto == 1)
            {
                $clave = 4;  
            }else {
                $clave = 61;     
            }
        }

        // AIG completo
        if($compania == 4)
        {
            if($producto == 12)
            {
                if($localidad == 18 || $localidad == 29) {
                    $clave = 96;
                }
                else {
                    $clave = 61;
                }

            }elseif ($producto == 16){ 

                if($localidad == 18 || $localidad == 29) {
                    $clave = 96;
                }else {
                    $clave = 106;            
                }

            }elseif ($producto == 1)
            {
                $clave = 106;
            }                  
            else{
                $clave = 61;                     
                
            }
            
        }

        // ANA completo
        if ($compania == 5)
        {
            if ($producto == 1)
            { 
                if ($unidadPropia == 'S')
                {
                    if ($unidad == 5) {
                        $clave = 28;  
                    }
                    else {
                        $clave = 5;  
                    }
                }
                else
                {
                    $clave = 6;  
                }  
            }
            else{
                $clave = 61;  
            }
        }

        // ATLAS completo
        if ($compania == 6)
        {
            if ($producto == 15){ 
                $clave = 104;
            }elseif ($producto == 1){
                if ($unidadPropia == 'S'){
                    $clave = 73;
                }else{
                    $clave = 74;
                }
            }else{
                $clave = 61;
            }
        }

        // FUTV SECC1
        if ($compania == 39)
        {
            if ($producto == 1)
            {
                $clave = 1;
            } 
            else {
                $clave = 61;
            }
        }

        // FUTV SECC2
        if ($compania == 40)
        {
            if ($producto == 1)
            {
                $clave = 1;
            } 
            else {
                $clave = 61;
            }
        }

        // GENERAL 
        if ($compania == 9)
        {
            if ($producto == 1){

                if ($riesgo == 3 || $riesgo == 4 || $riesgo == 5){

                    if ($unidadPropia == 'S'){ 
                        $clave = 98;
                    }else{
                        $clave = 99;
                    }

                }else{
                    $clave = 79;
                } 
            
            }else{ 
                $clave = 61; 
            }
        }

        // GNP todos
        if ($compania == 10)
        {
            if ($producto == 1)
            {
                if ($unidadPropia == 'S')
                {
                    if ($unidad == 4){ 
                        $clave = 28;
                    }else{ 
                        $clave = 100;
                    }

                }else{
                  $clave =  76;                 
                }

            }elseif($producto == 9){

                $clave = 107;

            }else{

                $clave = 61;

            }
        }


        // HDI

        if($compania == 12)
        {
            if($producto == 1)
            {
                if($unidadPropia == 'S') {
                    $clave = 76;
                }else {
                    $clave = 55;                              
                }

            }else {
               $clave = 61;  
            }
        }

        // GRUPO CALEB
        if($compania == 57)
        {
            if($producto == 1){
                $clave = 49; 
            }else{
                $clave = 61;
            }
        }


        // BANORTE
        if ($compania == 8)
        {
            if ($producto == 16)
            {
                if ($unidadPropia == 'S'){$clave = 88;}
                else{$clave = 76;}
            }   
            elseif ($producto == 1)
            {
                if ($unidadPropia == 'S'){$clave = 88;}
                else{ $clave = 76; }
            }   
            else{
                $clave = 61; 
            } 
        }


        // HIR
        if ($compania == 31)
        {
            if($producto == 2)
            {
                $clave = 85;                              
            }
            else{
                $clave = 61;                 
            }
        }

        // LATINO
        if ($compania == 14)
        {
            if($producto == 1)
            { 
                if($unidadPropia == 'S'){ $clave = 5;}
                else{ $clave = 6;}
            }
            else{
                $clave = 61;                 
            }
        }

        // MAPFRE
        if ($compania == 15)
        {
            if($producto == 1)
            { 
                if($unidadPropia == 'S'){ $clave = 21;}
                else{ $clave = 24;}                                           

            }
            else{
                $clave = 61; 
            }

        }


        // METLIFE
        if($compania == 55){

            if($producto == 2){
                $clave = 97;                              
            }
            else{
                $clave = 61;                 
            }
        }

        // MULTIASISTENCIA

        if ($compania == 35 || $compania == 36 || $compania == 37)
        {
            if($producto == 1)
            {
                $clave = 103;                              
            }
            else{
                $clave = 61;                 
            }

        }

        // MULTIVA                                  
        if ($compania == 17)
        {
            if($producto == 1)
            {
                $clave = 105;                              
            }
            else
            {
                $clave = 61;                 
            }
        }

        // POTOSI                   
        if ($compania == 18)
        {
            if($producto == 1)
            {
                if($unidadPropia == 'S'){ $clave = 67;}
                else {$clave = 68;}
            }
            elseif ($producto == 2)
            {
                if($unidadPropia == 'S'){ $clave = 67;}
                else{ $clave = 68;}                              
            }  
            else
            {
               $clave = 61;  
            }
          
        }


        // PRIMERO               
        if ($compania == 22)
        {
            if($producto == 1)
            {
                if($unidadPropia == 'S')
                {
                    $clave = 2;
                }
                else{
                    $clave = 6;
                }                              
            }
            else
            {
                $clave = 61;                 
            }

        }



        // RSA                          

        if ($compania == 20)
        {
            if($producto == 1)
            {
                if( $localidad == 18 || $localidad == 169 || $localidad == 41 || $localidad == 47 || $localidad == 61 )
                { 
                    $clave = 33;
                }
                else{
                    $clave = 43;                                
                } 
            }
            elseif ($producto == 2)
            {
                $clave = 21; 
            }
            else
            {
               $clave = 61;                 
            }

        }


        // SPT
        if ($compania == 32)
        {
            if($producto == 1)
            {
                $clave = 1;                              
            }
            else{
                $clave = 61;                 
            }

        }


        // TTRAVOL
        if ($compania == 34)
        {
            if($producto == 1)
            {
                $clave = 1;                              
            }
            else
            {
                $clave = 61;                 
            }
        }




        // INBURSA
        if ($compania == 45)
        {
            if($producto == 1)
            {
                if($unidadPropia == 'S'){ $clave= 75;}
                else{ $clave= 76;}
            }
            elseif ($producto == 4)
            {
              // if (Sesiones > 1) {$clave= 89;}
              // if(Consulta) {$clave = 90;}
              // if(Num Placas = 1) {$clave=93;}
              // else {$clave=94;}
              // $clave=94;
            }      
            else{
               $clave = 61;                 
            }
          
        }






        // verificamos si entro a alga condicion
        if ($clave == 0) {
            
            return Response::json(array('flash' => 'Sin datos en tabulador'),500);

        }else{

            $query="SELECT TAD_importe FROM TabuladorDetalle WHERE TAB_clave = " . $clave . " AND LES_clave='".$lesionCia."'";


            $importe = DB::connection('mv')->select($query)[0]->TAD_importe;

            return Response::json(array('importe' => $importe,'claveTabulador' => $clave));
        }


	}
}
