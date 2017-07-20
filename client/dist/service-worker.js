/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["/css/style.min.css","a944d674f6ba24f78647f69c73f53fd4"],["/favicon-114.png","48491de2f2013384f01e334b874f486f"],["/favicon-120.png","a7657f2010c94253ddf4aac258fbfc14"],["/favicon-144.png","6c691c40667294cbff0d3fba6cdd57bf"],["/favicon-152.png","090f21ed87b661e0efacbd6e922eea29"],["/favicon-16.png","8dcf047201ac148178ab968513920991"],["/favicon-24.png","5ff3733395b53443cc672c803c530d03"],["/favicon-300.png","0be80aad88cb43dd3fc591e6b1eb6632"],["/favicon-32.png","799b63b6e17eab2578f1d2411d1ae812"],["/favicon-48.png","49066bf3d97e29840b4cfdd4c950c214"],["/favicon-57.png","24d0167553fb9e391e302da98d682202"],["/favicon-64.png","7e0339b945ecd0f84702f2c147a950df"],["/favicon-72.png","1b7ab22160bf1e5c29ef65cf132cc292"],["/img/banorte.jpg","ccdf4ec86c4787c222ff73aa8d2cd981"],["/img/chrome.png","f5687aad37aaffcb8c13e0f22b27818c"],["/img/gnp.jpg","952de2660991051902e150127ca474c4"],["/img/google.png","cdc8b41a35e785a1970255d5fbc6268c"],["/img/google2.png","22fd744c31c4dc26e688938179b99608"],["/img/icons/icon-128x128.png","3c7e26f7806f36666c42262e96258b7a"],["/img/icons/icon-144x144.png","4c9d1371188d3e1858f10bb427f26821"],["/img/icons/icon-152x152.png","4c9d1371188d3e1858f10bb427f26821"],["/img/icons/icon-192x192.png","4c9d1371188d3e1858f10bb427f26821"],["/img/icons/icon-384x384.png","4c9d1371188d3e1858f10bb427f26821"],["/img/icons/icon-512x512.png","4c9d1371188d3e1858f10bb427f26821"],["/img/icons/icon-72x72.png","c1547e3e2d09de6fd64ea71826975291"],["/img/icons/icon-96x96.png","941f26a31ba67b7c7f749214dda44cee"],["/img/logomv.jpg","bb80b553538ca7212f1832bbc7fa1e97"],["/img/materialbg.jpg","c7830879fcbd9a74b7756f57aaf45557"],["/img/materialbg2.jpg","7265ff778970e79519959f65afb6413f"],["/img/materialbg3.jpg","ccc12acec5f05b9824744ee1f74e7390"],["/img/user-bg.jpg","d763a43bbc4130ad09b3dda6d4b876a4"],["/img/user-bg2.jpg","bd8f9c18f712bbee609a6993b27def13"],["/img/user2.png","63f13bdc13b48c97615c175b18d3215c"],["/img/user3.png","c878c47d890a54a2381de7e8997d80eb"],["/index.html","7922248502ae668a342724a191d22f5a"],["/js/app.min.js","d1346cb240feccc290a75a292c44b79f"],["/js/vendor.min.js","2940d1e332dbfac30a58a6890ece4a89"],["/splash.jpg","27247fb6fa2e30416d30434ee7b2b615"],["/views/accionOrden.html","a21b3f3d514b661725e53ec2ffa2659e"],["/views/agranel.html","2742408b45f6f97cbf31e854a4d55df0"],["/views/almacen.html","3bffa130df0acc2c45b91ab5b71baebd"],["/views/almacenes.html","960a4c7a6f7f55c021e077d4df6b74ad"],["/views/almacenusuario.html","652452d5135cf5e0d4d5388ba92bc1d7"],["/views/altaMovimientos.html","09fd9e4cacbbffde9708fe329e202380"],["/views/altaitempro.html","724be77025371d82c33a2f0bd41bb970"],["/views/base.html","bc4ec75c7e43f0ba650b42e69290cb22"],["/views/completar.html","e85f8cc89033ac92c77d3a86d76734dc"],["/views/conexiones.html","beeb3b59018b194830b6bac50bc6311e"],["/views/configuracion.html","0e0bc90176aacf2ff7b67d3f00c04167"],["/views/correo.html","bf4ecf988a06c4eafbf0543af83defcc"],["/views/detalleOrden.html","69fb3c42799466f4f1ccd51b42a048ac"],["/views/equivalencias.html","777168788e86378315c448443c8fb212"],["/views/errorReceta.html","8077c832a5167fb9d9872d3884f4e43f"],["/views/existencias.html","b6f4c0fa363610a3570e4b7827260075"],["/views/home.html","e0a31b8e7bb81f30ee6fc484404f1a36"],["/views/importar.html","40c5823f4ddfd67e4c30cbed8d439c8d"],["/views/interactivo.html","e9a2ad21e13f5fa6a3c2660b8a132194"],["/views/item.html","0a96291a9ccd3fa98d099ff92693b986"],["/views/itemReceta.html","8e56d308963e679cb95e3c5187a63068"],["/views/itempro.html","e3e4641984645864f383f76f2c8d9952"],["/views/items.html","40311e48a341e836270b282a23814512"],["/views/login.html","6cea7bf44cd4e3aa324ef027ec9f4b8d"],["/views/loteReceta.html","8b3cdcb3ad86f8325687017c41e81ebd"],["/views/lotes.html","bbe0bdf9586b3956ec99bbbf1f0514d5"],["/views/modifica.html","4706d1918adf61d94c010a27410f2757"],["/views/movimiento.html","a7f0c2c8ad2744ca1d73fdbb509de4b8"],["/views/movimientoorden.html","c395172f28f7af0ea32988d7e6e3b3a6"],["/views/movimientos.html","dbb0a8f6d167d02e74b145254077e6e3"],["/views/opcionesReporte.html","114e3125c6245cfd1b67cfc865e68490"],["/views/ordenPaso1.html","3f77fec76366b444742b115c296d5e31"],["/views/ordenPaso2.html","81099bb2d310520eeb92286f0d8d3f10"],["/views/ordenPaso3.html","8e63ecd1e7ed4b04d9df7c5a22425c88"],["/views/ordenPaso4.html","4f3c77c14739ab7ebeb5875e9ef498c3"],["/views/ordencompra.html","699cb9547e95f7e23121b926bbfab14e"],["/views/ordenesAbiertas.html","0c66482bede5b38a9bbf4b3c0f82e220"],["/views/ordenescompra.html","af3359f9451823d2a0259cd5d7eb6689"],["/views/perfil.html","a2fa9fcf84a8369a3e7db4b589e67ba0"],["/views/perfiles.html","e5ff01c2085a83edc57da6d3c8594c65"],["/views/porCaducar.html","ad815a3e337c9eb6e1614c6d5fbf994b"],["/views/porSurtir.html","b464b8ca01b57c2a12372fac73bc3d04"],["/views/proveedor.html","6b7be393a58980dfa989f3189152ba72"],["/views/proveedores.html","20671b5473e4cdb88e6de7bca0e0e593"],["/views/prueba.html","c94f318b7858be4ab27c0fe795710e3d"],["/views/pruebaDialogo.html","cc9cd27668efa9fece3c0755e1dd83b2"],["/views/pruebaSE.html","e32a5a478716adc3f94002ec6a2aa636"],["/views/receta.html","0ad91003e0922bcd5305adb801688da4"],["/views/reporteExistencias.html","40588ca1454e760faded9b3d6223d352"],["/views/reporteItems.html","fb5b3717590f992ce193f29dd0181372"],["/views/reporteLotes.html","dc4d83ece12c9a2e23088c225848106a"],["/views/reporteMovimientos.html","d8b193635973a6aad47e8d61e78ae38f"],["/views/reporteOrdenes.html","9a4bbb0a749ae0792665aa9f6e49e4ce"],["/views/reporteTraspasos.html","84ccdefde2e19f8e093593d73cfbbdb9"],["/views/subtipoitem.html","d15501b8413774874342ddce78d18b73"],["/views/subtipositem.html","2f792eb7d50abfd2e442802563ef5edb"],["/views/surtir.html","2e936e6573a6efed0177bda8e79f91b2"],["/views/surtirPaso1.html","fa65ebac9dbe0a04ef94ba5a467a1a9b"],["/views/surtirPaso2.html","aa80e7aef28a22925de884a70c4b3931"],["/views/surtirPaso3.html","aaf3d2c1276d91945a7fe419a54a8da3"],["/views/surtirPaso4.html","fa91148764dc099b93831ec6cf762911"],["/views/tipoajuste.html","176388b9b4a57b74f22d5931d3990e3b"],["/views/tipoalmacen.html","b0eda4a3e59da5005b9ed18f3ceb7648"],["/views/tipoitem.html","a9f8efcc0a06ef606b322590f50202d6"],["/views/tipomovimiento.html","1c14ddfd78a6cc2df62f58832ae48137"],["/views/tipoorden.html","a8a5c402b7fcd12681a77af9fb48c831"],["/views/tiposajuste.html","a331338c72714fe3b4e1419798b4e0a0"],["/views/tiposalmacen.html","bd606d06693cc77f6e59b53c791dfffb"],["/views/tipositem.html","1ecd832ddfd91cbd6d68bb73f44def0b"],["/views/tiposmovimiento.html","5af5f32897ed15ada4c6721fc080f690"],["/views/tiposorden.html","0dd2ca583edc08d604b78cb5d61f98f2"],["/views/traspaso.html","5c71274549a96dc20a46a8a8b8341503"],["/views/unidad.html","1caa0a83b8764cdc699c5b4191ebdf9f"],["/views/unidades.html","5f7b01491a0cfc7d7253fe8b3d4bf991"],["/views/unidadesItem.html","80b7f3223ead3ad5c4d091f6c6a13c92"],["/views/unidaditem.html","5ac7989f0e7f3f9d07e6f65b16662e70"],["/views/usuario.html","4ff10c2b4e022ada00c621ab11c7df93"],["/views/usuarioEdicion.html","0c36a24d141f55771c100fe7ce5be299"],["/views/usuarioalmacen.html","d7502e9b28ffe526dc525d040b6efcd1"],["/views/usuarios.html","9bca6c5ccc265f60230e5a8fa92877e8"]];
var cacheName = 'sw-precache-v2--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.toString().match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              return cache.add(new Request(cacheKey, {
                credentials: 'same-origin',
                redirect: 'follow'
              }));
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameter and see if we have that URL
    // in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







