
(function(){

    "use strict"
    
    angular.module('app')
    .factory('imagenes',imagenes)
    .factory('pdf',pdf);

	function imagenes($q){
	    return{
	        convierte:function(imagenes){

	            var respuesta = $q.defer();

	            var convertidas = imagenes.map(function (imagen){

	                var promesa = $q.defer();

	                var img = new Image(), data, ret = {
	                    data: null,
	                    pending: true
	                };

	                img.onError = function() {
	                    throw new Error('Cannot load image: "'+image+'"');
	                };

	                img.onload = function(){

	                    var canvas = document.createElement('canvas');
	                    document.body.appendChild(canvas);
	                    canvas.width = img.width;
	                    canvas.height = img.height;

	                    var ctx = canvas.getContext('2d');
	                    ctx.drawImage(img, 0, 0);
	                    // Grab the image as a jpeg encoded in base64, but only the data
	                    data = canvas.toDataURL('image/jpeg').slice('data:image/jpeg;base64,'.length);
	                    // Convert the data to binary form
	                    data = atob(data);
	                    document.body.removeChild(canvas);

	                    ret['data'] = data;
	                    ret['pending'] = false;

	                    promesa.resolve(data);

	                };

	                img.src = imagen;
	                img.setAttribute('crossOrigin', 'anonymous');

	                return promesa.promise;

	            });

	            $q.all(convertidas).then(function (data){
	                respuesta.resolve(data);
	            });

	            return respuesta.promise;

	        }
	    }
	}

	//genera el pdf de la orden de compra
	function pdf($http,busqueda,$q,imagenes,Upload,api){
	    return{

	    	enviaOrden:function(orden){

	    			// console.log(orden);
	                return $http.get(api+'operacion/envia/orden/'+orden);

	   		},
	   		imprimeOrden:function(id){

	   			var promesa = $q.defer(),
		   			datos = ['img/logomv.jpg'];

	            var imagenTodo = imagenes.convierte(datos),
	            	detalle    = busqueda.detalleOrdenCompra(id);

	            $q.all([imagenTodo,detalle]).then(function (data){

	            	var imgData = data[0][0],
	            		orden   = data[1].data;

		   			var doc = new jsPDF();

					doc.addImage(imgData, 'JPEG', 10, 8, 40, 20);

					doc.setFontSize(10);
					doc.setFontType("normal");
					doc.text(180,10, FechaAct); 

					doc.setFontSize(12);
					doc.setFont("helvetica");
					doc.setFontType("bold");
					doc.text(145,25, 'Orden de Compra No.' + String(orden.OCM_clave)); 

					doc.setDrawColor(29, 79, 232);
					doc.setLineWidth(1);
					doc.line(10, 30, 200, 30);

					doc.setFontSize(9);
					doc.setFontType("normal");

					doc.text(10,40, 'Proveedor:'); 
					doc.text(32,40, doc.splitTextToSize(orden.PRO_razonSocial, 166));

					doc.text(10,50, 'Facturar a:'); 
					doc.text(32,50, doc.splitTextToSize('MEDICAVIAL, SA DE CV, RFC: MED011012TD4 Av. Alvaro Obregón, 151, Piso 9 Roma, Del. Cuauhtémoc, México, México DF Distrito Federal, 06700.', 166));

					doc.text(10,60, 'Entregar en:'); 
					doc.text(32,60, doc.splitTextToSize(orden.UNI_direccion + ' horarios de entrega: ' + orden.UNI_horaentrega, 166));

					doc.text(10,80, 'Clave'); 

					doc.text(30,80, 'Cant.'); 

					doc.text(50,80, 'Nombre'); 

					doc.text(148,80, 'Costo'); 

					doc.text(168,80, 'Desc.'); 

					doc.text(190,80, 'Total'); 

					doc.setDrawColor(29, 79, 232);
					doc.setLineWidth(0.5);
					doc.line(10, 82, 200, 82);

					//aqui van los items

					// posiciones iniciales en y 

	                var x = 90; //para la linea que divide cada receta
	                var cantidades = 0;


					angular.forEach(orden.items,function (value,key){

						doc.text(10,x, value.ITE_codigo); 

						doc.text(30,x, String(value.OIT_cantidadPedida)); 

						doc.text(50,x, doc.splitTextToSize(value.ITE_nombre,94)); 

						doc.text(145,x, '$ ' + value.OIT_precioEsperado); 

						doc.text(168,x, '% 0'); 

						doc.text(185,x, '$ '+ String(value.OIT_precioEsperado * value.OIT_cantidadPedida)); 

						x += 10;
						
					});
					

					//aqui va el total

					doc.setDrawColor(29, 79, 232);
					doc.setLineWidth(0.3);
					doc.line(10, 110, 200, 110);

					doc.text(160,116, 'Total:'); 
					doc.text(185,116, '$ '+ orden.OCM_importeEsperado); 

					doc.setDrawColor(29, 79, 232);
					doc.setLineWidth(0.3);
					doc.line(10, 120, 200, 120);


					doc.line(10, 270, 200, 270);
					doc.text(10,275, orden.OCM_fechaReg); 
					doc.text(50,275, 'Tel. 55-14-47-00'); 
					doc.text(80,275,  'Responsable: ' + orden.UNI_responsable); 

					doc.save('orden_compra_' + orden.OCM_clave);


	            });

	   		},
	   		ordenCompra:function(orden){

	   			var promesa = $q.defer(),
		   			datos = ['img/logomv.jpg'];

	            var imagenTodo = imagenes.convierte(datos);

	            $q.when(imagenTodo).then(function (data){

	            	console.log(orden);

	            	var imgData = data[0];


		   			var doc = new jsPDF();

					doc.addImage(imgData, 'JPEG', 10, 8, 40, 20);

					doc.setFontSize(10);
					doc.setFontType("normal");
					doc.text(180,10, '10/10/2015'); 

					doc.setFontSize(12);
					doc.setFont("helvetica");
					doc.setFontType("bold");
					doc.text(145,25, 'Orden de Compra No.' + String(orden.OCM_clave)); 

					doc.setDrawColor(29, 79, 232);
					doc.setLineWidth(1);
					doc.line(10, 30, 200, 30);

					doc.setFontSize(9);
					doc.setFontType("normal");

					doc.text(10,40, 'Proveedor:'); 
					doc.text(32,40, doc.splitTextToSize(orden.PRO_razonSocial, 166));

					doc.text(10,50, 'Facturar a:'); 
					doc.text(32,50, doc.splitTextToSize('MEDICAVIAL, SA DE CV, RFC: MED011012TD4 Av. Alvaro Obregón, 151, Piso 9 Roma, Del. Cuauhtémoc, México, México DF Distrito Federal, 06700.', 166));

					doc.text(10,60, 'Entregar en:'); 
					doc.text(35,60, doc.splitTextToSize(orden.UNI_nombre, 166));

					doc.text(10,80, 'Clave'); 

					doc.text(30,80, 'Cant.'); 

					doc.text(50,80, 'Nombre'); 

					doc.text(148,80, 'Costo'); 

					doc.text(168,80, 'Desc.'); 

					doc.text(190,80, 'Total'); 

					doc.setDrawColor(29, 79, 232);
					doc.setLineWidth(0.5);
					doc.line(10, 82, 200, 82);

					//aqui van los items

					// posiciones iniciales en y 

	                var x = 90; //para la linea que divide cada receta
	                var cantidades = 0;


					angular.forEach(orden.items,function (value,key){

						doc.text(10,x, value.ITE_codigo); 

						doc.text(30,x, String(value.OIT_cantidadPedida)); 

						doc.text(50,x, doc.splitTextToSize(value.ITE_nombre,94)); 

						doc.text(145,x, '$ ' + value.OIT_precioEsperado); 

						doc.text(168,x, '% 0'); 

						doc.text(185,x, '$ '+ String(value.OIT_precioEsperado * value.OIT_cantidadPedida)); 

						x += 10;
						
					});
					

					//aqui va el total

					doc.setDrawColor(29, 79, 232);
					doc.setLineWidth(0.3);
					doc.line(10, 110, 200, 110);

					doc.text(160,116, 'Total:'); 
					doc.text(185,116, '$ '+ orden.OCM_importeEsperado); 

					doc.setDrawColor(29, 79, 232);
					doc.setLineWidth(0.3);
					doc.line(10, 120, 200, 120);

	                doc.save('orden_compra_' + orden.OCM_clave);

	            });

	   		}
	   		
	    }
	}


})();