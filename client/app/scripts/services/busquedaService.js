//servicio que verifica sesiones de usuario
function busqueda($http, api){
    return{
        almacenes : function()
        {
            return $http.get(api + 'busquedas/almacenes');
        },
        almacenUsuario : function(usuario)
        {
            return $http.get(api + 'busquedas/almacen/'+usuario);
        },
        items : function()
        {
            return $http.get(api + 'busquedas/items');
        },
        itemsProveedor : function()
        {
            return $http.get(api + 'busquedas/items/proveedor');
        },
        tiposAlmacen : function()
        {   
            return $http.get(api + 'busquedas/tiposalmacen');
        },
        tiposItem : function()
        {   
            return $http.get(api + 'busquedas/tipositem');
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