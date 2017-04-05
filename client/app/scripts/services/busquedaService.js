//servicio que verifica sesiones de usuario
(function(){

    'use strict';

    angular.module('app')
    .factory('busqueda',busqueda);

    function busqueda($http, api){
        return{
            almacenes : function()
            {
                //consulta de almacenes general
                return $http.get(api + 'busquedas/almacenes');
            },
            almacenesUsuario : function(usuario)
            {
                // busca los almacenes de un usuario
                return $http.get(api + 'busquedas/almacenes/'+usuario);
            },
            almacenUsuario : function(usuario)
            {
                //
                return $http.get(api + 'busquedas/almacen/'+usuario);
            },
            almacenesUnidad : function(unidad)
            {
                return $http.get(api + 'busquedas/almacenes/unidad/'+unidad);
            },
            configuracion : function(unidad)
            {
                return $http.get(api + 'operacion/configuracion/unidad/'+unidad);
            },
            existencias : function(usuario)
            {
                return $http.get(api + 'busquedas/existencias/'+ usuario);
            },
            items : function()
            {
                return $http.get(api + 'busquedas/items');
            },
            itemsAlmacen : function(almacen)
            {
                // consulta los items existentes en el almacen
                return $http.get(api + 'busquedas/items/existencias/' + almacen);
            },
            itemsAlmacenReceta : function(almacen)
            {
                // consulta los items existentes en el almacen disponibles para agregar en receta MV
                return $http.get(api + 'busquedas/items/existencias/' + almacen);
            },
            itemsProveedor : function()
            {
                return $http.get(api + 'busquedas/items/proveedor');
            },
            itemsReceta : function(){
                return $http.get(api + 'busquedas/items/receta');
            },
            itemsRecetaSurtidas : function(receta){
                return $http.get(api + 'busquedas/items/receta/' + receta);
            },
            itemsUnidad : function(unidad)
            {
                return $http.get(api + 'operacion/items/unidad/' + unidad);
            },
            itemsAgranel : function(){
                return $http.get(api + 'busquedas/items/agranel');
            },
            itemAlmacen : function(almacen,item)
            {
                //busca la existencia de un item en un almacen
                return $http.get(api + 'busquedas/item/existencia/' + almacen + '/' + item);
            },
            itemUnidad : function(item,unidad)
            {
                return $http.get(api + 'busquedas/item/unidad/' + item + '/' + unidad);
            },
            lote : function(lote)
            {
                return $http.get(api + 'busquedas/lote/'+lote);
            },
            lotesAlmacenXitem : function(almacen,item)
            {
                return $http.get(api + 'busquedas/lotes/almacen/'+ almacen + '/item/' + item);
            },
            lotesUnidadXitem : function(unidad,item)
            {
                return $http.get(api + 'busquedas/lotes/unidad/'+ unidad + '/item/' + item);
            },
            movimientos : function()
            {
                return $http.get(api + 'busquedas/movimientos');
            },
            movimientosAgranel : function()
            {
                return $http.get(api + 'busquedas/movimientos/agranel');
            },
            ordenescompra : function(unidades)
            {
                return $http.get(api + 'busquedas/ordenescompra/'+unidades);
            },
            detalleOrdenCompra : function(id)
            {
                return $http.get(api + 'busquedas/ordencompra/'+id);
            },
            tiposAjuste : function()
            {
                return $http.get(api + 'busquedas/tiposajuste');
            },
            tiposAlmacen : function()
            {
                return $http.get(api + 'busquedas/tiposalmacen');
            },
            tiposItem : function()
            {
                return $http.get(api + 'busquedas/tipositem');
            },
            tiposMovimiento : function()
            {
                return $http.get(api + 'busquedas/tiposmovimiento');
            },
            SubTiposItem : function()
            {
                return $http.get(api + 'busquedas/subtipositem');
            },
            perfiles : function()
            {
                return $http.get(api + 'busquedas/permisos');
            },
            presentaciones : function()
            {
                return $http.get(api + 'busquedas/presentaciones');
            },
            proveedores : function()
            {
                return $http.get(api + 'busquedas/proveedores');
            },
            proveedoresItems : function(items)
            {
                return $http.post(api + 'operacion/proveedores/items',items);
            },
            receta : function(receta)
            {
                return $http.get(api + 'busquedas/receta/'+receta);
            },
            unidades : function()
            {
                return $http.get(api + 'busquedas/unidades');
            },
            usuarios : function()
            {
                return $http.get(api + 'busquedas/usuarios');
            },
            unidadesItem : function(){
                return $http.get(api + 'busquedas/unidadesItem');
            },
            unidadesUsuario : function(usuario){
                return $http.get(api + 'busquedas/unidades/usuario/' + usuario);
            },
            usuariosAlmacen : function(){
                return $http.get(api + 'operacion/usuarios/almacen');
            },
            consultaPrueba : function(){
                return $http.get(api + 'busquedas/proveedores');
            },
            consultaPrueba : function(){
                return $http.get(api + 'busquedas/caducidad');
            },
            prueba2 : function(){
                return $http.get(api + 'segundaprueba');
            },
            inicial : function(unidades){
                return $http.get(api + 'busquedas/inicial/'+unidades);
            },
            cunsultaCaducados : function(unidades){
                return $http.get(api + 'busquedas/inicial/porCaducar/'+unidades);
            },
            cunsultaApartados : function(unidades){
                return $http.get(api + 'busquedas/inicial/porSurtir/'+unidades);
            }
            // ,
            // traspasos : function(){
            //     return $http.get(api + 'busquedas/traspasos');
            // }
        }
    }

})();
