<?php


class MedicaController extends BaseController {

	public function tabulador($claveLesion,$folio){

		$queryLesion = "SELECT Clave_lesionCia FROM LesionEquivalencia where Clave_lesionMV='". $claveLesion ."'";
		$datoLesion =  DB::connection('mv')->select($queryLesion)[0];
        $lesionCia  = $datoLesion->Clave_lesionCia;

        $queryFolio = "SELECT PRO_clave, LOC_claveint, Cia_clave, Esc_clave, Exp_fecreg from Expediente
		          INNER JOIN Unidad on Expediente.Uni_clave = Unidad.Uni_clave 
		          WHERE Exp_folio='".$folio."'";

		$datos =  DB::connection('mv')->select($queryFolio)[0];

        $producto       = $datos->PRO_clave;
        $localidad      = $datos->LOC_claveint;
        $compania       = $datos->Cia_clave;
        $escolaridad    = $datos->Esc_clave;
        $fechaRegistro  = $datos->Exp_fecreg;
        
        if($compania==7){

            if($producto==1){

                if ($localidad == 169) {
                    $query="SELECT TAD_importe FROM TabuladorDetalle WHERE TAB_clave = 6 AND LES_clave='".$lesionCia."'";
                    $clave = 28;
                }
                elseif($localidad == 167 || $localidad == 61  || $localidad == 41  || $localidad == 47){
                    
                    $query="SELECT TAD_importe FROM TabuladorDetalle WHERE TAB_clave = 1 AND LES_clave='".$lesionCia."'";
                    $clave = 86;
                }else{

                    if($localidad != 29 && $localidad!=18){

                        $query="SELECT TAD_importe FROM TabuladorDetalle WHERE TAB_clave = 2 AND LES_clave='".$lesionCia."'";
                        $clave = 87;
                    }   

                }
            }elseif($producto==2){ 

                if($escolaridad==1||$escolaridad==2||$escolaridad==3){

                    $query="SELECT TAD_importe FROM TabuladorDetalle WHERE TAB_clave = 3 AND LES_clave='".$lesionCia."'";
 					$clave = 46;

                }elseif($escolaridad==4||$escolaridad==5||$escolaridad==7){

                    $query="SELECT TAD_importe FROM TabuladorDetalle WHERE TAB_clave = 4 AND LES_clave='".$lesionCia."'";
  					$clave = 47;

                }
                    
            }elseif($producto==12&&($localidad == 29 || $localidad==18)){   

                    $query="SELECT TAD_importe FROM TabuladorDetalle WHERE TAB_clave = 5 AND LES_clave='".$lesionCia."'";
                    $clave = 95;
            }
        }

        $importe = DB::connection('mv')->select($query)[0]->TAD_importe;

        return Response::json(array('importe' => $importe,'claveTabulador' => $clave));

	}
}
