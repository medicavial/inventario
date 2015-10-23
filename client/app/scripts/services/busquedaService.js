//servicio que verifica sesiones de usuario
function busqueda($http, api){
    return{
        almacenes : function()
        {
            return $http.get(api + 'busquedas/almacenes');
        },
        almacenesUsuario : function(usuario)
        {
            return $http.get(api + 'busquedas/almacenes/'+usuario);
        },
        almacenUsuario : function(usuario)
        {
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
            return $http.get(api + 'busquedas/items/existencias/' + almacen);
        },
        itemsProveedor : function()
        {
            return $http.get(api + 'busquedas/items/proveedor');
        },
        itemsUnidad : function(unidad)
        {
            return $http.get(api + 'operacion/items/unidad/' + unidad);
        },
        itemUnidad : function(item,unidad)
        {
            return $http.get(api + 'busquedas/item/unidad/' + item + '/' + unidad);
        },
        movimientos : function()
        {
            return $http.get(api + 'busquedas/movimientos');
        },
        ordenescompra : function()
        {
            return $http.get(api + 'busquedas/ordenescompra');
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
        unidades : function()
        {
            return $http.get(api + 'busquedas/unidades');
        },
        usuarios : function()
        {
            return $http.get(api + 'busquedas/usuarios');
        },
        usuariosAlmacen : function(){
            return $http.get(api + 'operacion/usuarios/almacen');
        }
    }
}

app.factory("busqueda",busqueda);