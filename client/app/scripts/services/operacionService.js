(function(){

    "use strict"
    
    angular
    .module('app')
    .factory("operacion",operacion);

    function operacion($http, api,$q,busqueda,$rootScope,$filter,pdf){
        return{
            altaAlmacenes : function(datos){
                return $http.post(api + 'operacion/usuario/almacenes',datos);
            },
            actualizaConfiguracion : function(id,datos){
                return $http.put(api + 'operacion/configuraciones/'+id,datos);
            },
            altaConfiguracion : function(datos){
                return $http.post(api + 'operacion/configuraciones',datos);
            },
            altaItempro :function(datos){
                return $http.post(api + 'operacion/item/proveedor',datos);
            },
            altaMovimiento :function(datos){
                return $http.post(api + 'operacion/movimiento',datos);
            },
            altaTraspaso :function(datos){
                return $http.post(api + 'operacion/traspaso',datos);
            },
            bajaAlmacen : function(almacen,usuario){
                return $http.get(api + 'operacion/elimina/almacen/'+almacen+'/'+usuario);
            },
            cambiaItem: function(datos){
                var defer   = $q.defer(),
                    reserva = datos.reserva,
                    item    = datos.item,
                    almacen = datos.almacen;

                $http.get(api + 'busquedas/item/existencia/' + almacen + '/' + item)
                .then(function (data){

                    var existenciaItem = data.data;

                    if (existenciaItem.EXI_cantidad == 0 || existenciaItem.length == 0) {
                        defer.reject('No hay Stock disponible de este item intenta generar traspasos del almacen principal');
                    }else{
                        defer.resolve(existenciaItem);
                    }

                })
                .catch(function (error){
                    defer.reject('Existio un error de conexion intentalo nuevamente');
                });
                
                return defer.promise;

            },
            cerrarOrden : function(orden){
                return $http.get(api+'operacion/cerrarorden/'+orden);
            },
            cambioXproveedor :function(poveedor,item,items){

                var promesa = $q.defer(),
                    respuesta = [],
                    totalActual = 0,
                    datos;

                datos = $filter('filter')(items, item);

                //generamos datos de los filtrados
                var cantidad = datos[0].porsurtir, //cantidad total disponible por surtir
                    proveedorCambio =  datos.indexOf(poveedor); //obtenemos el indice del proveedor que genero cambio

                angular.forEach(datos, function(value, key) {

                    respuesta.push(value);
                    totalActual += value.cantidad;

                });

                $q.when(respuesta).then(function (data){
                    if (totalActual > cantidad) {
                        alert('Te pasaste de la cantidad a surtir');
                        var valorDeMas = totalActual - cantidad,
                            valorActual = items[proveedorCambio].cantidad;

                        items[proveedorCambio].cantidad = valorActual - valorDeMas;

                    }else{
                        promesa.resolve(items);
                    }
                });

                return promesa.promise;
            },
            correo: function(datos){
                return $http.post(api + 'operacion/correo',datos);
            },
            completaOrden : function(datos){
                return $http.post(api + 'operacion/completa/orden',datos);
            },
            economicoXitem :function(item,items){

                var promesa = $q.defer(),
                    respuesta = [],
                    datos;

                datos = $filter('filter')(items, item);

                //generamos datos de los filtrados
                var cantidad = datos[0].porsurtir;
                    proveedores = datos.length;

                angular.forEach(datos, function(value, key) {


                    var id = items.indexOf(value);

                    if (key == 0) {
                        items[id].cantidad = cantidad;
                    }else{
                        items[id].cantidad = 0;
                    }

                    respuesta.push(id);

                });

                $q.when(respuesta).then(function (data){
                    promesa.resolve(items);
                });

                return promesa.promise;
                
            },
            eliminaOrden : function(proveedor,catalogo){

                var promesa = $q.defer(),
                    ordenes   = [],
                    items;

                items = $filter('filter')(catalogo, proveedor);

                angular.forEach(items, function(value, key) {
                    
                    var id = catalogo.indexOf(value);
                    catalogo.splice(id, 1);
                    
                });

            },
            generaCantidades : function(items){
                
                var promesa = $q.defer(),
                    seleccionOrden = [];

                angular.forEach(items, function(value, key) {

                    var cantidad = value.Cantidad;
                        proveedores = value.proveedores.length;


                    //calculamos la cantidad que debe ser proporcional segun el numero de proveedores
                    //y la redondeamos 
                    var cantidadProporcionada = parseInt(cantidad/proveedores);

                    // esta multiplicacion es necesaria para saber si quedo menor o igual el numero de veces al total  
                    var cantidadSegunProporcion = cantidadProporcionada * proveedores;

                    //se genera una diferencia para que esa cantidad sea para el item mas barato 
                    var diferencia = cantidad - cantidadSegunProporcion;


                    angular.forEach(value.proveedores, function(value, key) {

                        if (key == 0) {
                            value.cantidad = cantidadProporcionada + diferencia;
                        }else{
                            value.cantidad = cantidadProporcionada;
                        }
                        seleccionOrden.push(value);
                    
                    });

                });

                $q.when(seleccionOrden).then(function (data){
                    promesa.resolve(data);
                });


                return promesa.promise;

            },
            generaMasBarato : function(items){

                var promesa = $q.defer(),
                    seleccionOrden = [];

                angular.forEach(items, function(value, key) {

                    var cantidad = value.Cantidad;

                    angular.forEach(value.proveedores, function(value, key) {

                        if (key == 0) {
                            value.cantidad = cantidad;
                            seleccionOrden.push(value);
                        }else{
                            value.cantidad = 0;
                            seleccionOrden.push(value);
                        }
                    
                    });

                });

                $q.when(seleccionOrden).then(function (data){
                    promesa.resolve(data);
                });


                return promesa.promise;

            },
            ordenXproveedor : function(proveedor,unidad,almacenes,catalogo){

                var promesa = $q.defer(),
                    ordenes   = [],
                    items;

                items = $filter('filter')(catalogo, proveedor);

                var proveedor = items[0].PRO_clave, //obtenemos el la vlave del proveedor que debe ser la misma para todos
                    total = 0, //preparamos el total de esta orden
                    itemsproveedor = []; //items de a orden

                angular.forEach(items, function(value, key) {

                    //generamos la multiplicacion para saber su costo total del item
                    var cantidad = value.cantidad * value.IPR_ultimoCosto;
                    //y los sumamos a la cantidad anterior
                    total += cantidad;
                    // agregamos item al arreglo
                    itemsproveedor.push(value);
                    
                    var id = catalogo.indexOf(value);
                    catalogo.splice(id, 1);

                    
                });

                $q.when(itemsproveedor).then(function (data){

                    //preparamos el arreglo que se mandara 
                    var preorden = {
                            proveedor:proveedor,
                            items:itemsproveedor,
                            total:total,
                            tipo:1,
                            usuario:$rootScope.id,
                            unidad:unidad,
                            almacenes:almacenes
                    }

                    //agregamos al arreglo ordenes que mandara cada orden individual del proveedor para ocupar la misma peticion como si fueran varias
                    ordenes.push(preorden);

                    $http.post(api + 'operacion/ordencompra',ordenes).success(function (datos){
                        promesa.resolve(datos);
                    }).error(function (data){
                        promesa.reject('Se encontro un error intentalo nuevamente');
                    });

                    
                });

                return promesa.promise;

            },
            generarOrden : function(datos){
                return $http.post(api + 'operacion/ordencompra',datos);
            },
            generaOrdenes : function(items,proveedores,unidad,almacenes){
                
                var promesa = $q.defer(),
                    ordenes   = [];

                //aqui generamos las ordenes de compra independientes por proveedor
                angular.forEach(proveedores, function(value, key) {

                    var proveedor = value,
                        total = 0,
                        itemsproveedor = [];

                    //verificamos item x item 
                    angular.forEach(items, function(value, key) {

                        //si equivale al proveedor lo agregamos al arreglo de items por proveedor
                        if (proveedor == value.PRO_clave) {

                            //generamos la multiplicacion para saber su costo total del item
                            var cantidad = value.cantidad * value.IPR_ultimoCosto;
                            //y los sumamos a la cantidad anterior
                            total += cantidad;
                            // agregamos item al arreglo
                            itemsproveedor.push(value);
                        };
                    });

                    // si tenemos items de ese proveedor significa que si tiene registro de items para ese proveedor
                    if (itemsproveedor.length > 0) {
                        //preparamos el objeto json para mandar al servidor el tipo es 1 debido a que es manual 
                        var preorden = {
                                proveedor:proveedor,
                                items:itemsproveedor,
                                total:total,
                                tipo:1,
                                usuario:$rootScope.id,
                                unidad:unidad,
                                almacenes:almacenes
                        }

                        //agregamos al arreglo ordenes que mandara cada orden individual del proveedor
                        ordenes.push(preorden);

                    };


                });

                $q.when(ordenes).then(function (data){


                    $http.post(api + 'operacion/ordencompra',data).success(function (datos){
                        promesa.resolve(datos);
                    }).error(function (data){
                        promesa.reject('Se encontro un error intentalo nuevamente');
                    })
                });


                return promesa.promise;

            },
            generaTotales : function(items,proveedor){
                
                var promesa = $q.defer(),
                    seleccionOrden = [],
                    total = 0;

                angular.forEach(items, function(value, key) {

                    var cantidad = value.cantidad;

                    if (value.PRO_nombre == proveedor) {

                        seleccionOrden.push(value);

                        total += cantidad;

                    };

                });

                $q.when(seleccionOrden).then(function (data){
                    promesa.resolve(total);
                });


                return promesa.promise;

            },
            generaDetalleOrdenes : function(ordenes){
                var promesa = $q.defer(),
                    promesas = [];

                angular.forEach(ordenes,function(value,key){

                    var dato = busqueda.detalleOrdenCompra(value);
                    promesas.push(dato);

                });

                $q.all(promesas).then(function (datos){
                    // console.log(datos);
                    promesa.resolve(datos);
                });

                return promesa.promise;

            },
            itemsAlmacenes : function(unidad,almacenes){
                return $http.post(api + 'operacion/items/almacenes/' + unidad,almacenes);
            },
            infoUnidad : function(unidad){

                var promesa   = $q.defer(),
                    almacenes = busqueda.almacenesUnidad(unidad),
                    items     = busqueda.itemsUnidad(unidad);

                $q.all([almacenes,items]).then( 
                    function (data){
                        promesa.resolve(data);
                    },
                    function (error){
                        promesa.reject('Hubo un problema favor de reintentarlo');
                    }
                );

                return promesa.promise;

            },
            preparaOrden : function(items){

                var promesa = $q.defer(),
                    proveedores = [],
                    seleccionOrden = [];

                $http.post(api + 'operacion/proveedores/items',items).success(function (data){

                    var info = data;
                    angular.forEach(data, function(value, key) {
                        var cantidad = value.Cantidad,
                            nivelcompra = value.CON_nivelCompra,
                            existenciaitem = value.EXI_cantidad;

                        angular.forEach(value.proveedores, function(value, key) {

                            var existencia = proveedores.indexOf(value.PRO_clave);
                            if (existencia == -1) proveedores.push(value.PRO_clave);

                            value.porsurtir = cantidad;
                            value.nivelcompra = nivelcompra;
                            value.existencia = existenciaitem;

                            if (key == 0) {
                                value.cantidad = cantidad;
                                seleccionOrden.push(value);
                            }else{
                                value.cantidad = 0;
                                seleccionOrden.push(value);
                            }
                        });
                    });

                    $q.when(seleccionOrden).then(function (data){
                        var respuesta = {
                            info:info,
                            datos:data,
                            proveedores:proveedores
                        };

                        promesa.resolve(respuesta);
                    });

                })

                return promesa.promise;

            },
            proporcionalXitem : function(item,items){

                var promesa = $q.defer(),
                    respuesta = [],
                    datos;

                datos = $filter('filter')(items, item);

                //generamos datos de los filtrados
                var cantidad = datos[0].porsurtir;
                    proveedores = datos.length;

                angular.forEach(datos, function(value, key) {

                    //calculamos la cantidad que debe ser proporcional segun el numero de proveedores
                    //y la redondeamos 
                    var cantidadProporcionada = parseInt(cantidad/proveedores);

                    // esta multiplicacion es necesaria para saber si quedo menor o igual el numero de veces al total  
                    var cantidadSegunProporcion = cantidadProporcionada * proveedores;

                    //se genera una diferencia para que esa cantidad sea para el item mas barato 
                    var diferencia = cantidad - cantidadSegunProporcion;

                    var id = items.indexOf(value);

                    if (key == 0) {
                        items[id].cantidad = cantidadProporcionada + diferencia;
                    }else{
                        items[id].cantidad = cantidadProporcionada;
                    }

                    respuesta.push(id);

                });

                $q.when(respuesta).then(function (data){
                    promesa.resolve(items);
                });

                return promesa.promise;

            },
            proveedoresItems : function(items){
                return $http.post(api + 'operacion/proveedores/items',items);
            },
            surtirItem : function(datos){
                return $http.post(api + 'operacion/surtir/item/' + $rootScope.id,datos);
            },
            surtirOrden : function(datos){
                return $http.post(api + 'operacion/surtir/orden',datos);
            },
            verificaFaltantes : function(orden){
                return $http.get(api + 'operacion/completa/orden/' + orden);
            },
            verificaItems : function(items){

                var promesa = $q.defer(),
                    validos = [];

                angular.forEach(items, function(value, key) {

                    if (value.cantidad > 0) {
                        validos.push(value);
                    };

                });

                $q.when(validos).then(function (data){
                    promesa.resolve(data);
                });


                return promesa.promise;

            }
        }

    }

})();
