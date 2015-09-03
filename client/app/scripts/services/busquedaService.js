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
        existencias : function(usuario)
        {
            return $http.get(api + 'busquedas/existencias/'+ usuario);
        },
        items : function()
        {
            return $http.get(api + 'busquedas/items');
        },
        itemsProveedor : function()
        {
            return $http.get(api + 'busquedas/items/proveedor');
        },
        movimientos : function()
        {
            return $http.get(api + 'busquedas/movimientos');
        },
        ordenescompra : function()
        {
            return $http.get(api + 'busquedas/ordenescompra');
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
        proveedores : function()
        {
            return $http.get(api + 'busquedas/proveedores');
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