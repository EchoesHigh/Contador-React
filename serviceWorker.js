console.log("Registrado");
const CACHE_ELEMENTS = [
    "./",
    "https://unpkg.com/react@17/umd/react.production.min.js",
    "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js",
    "https://unpkg.com/@babel/standalone/babel.min.js",
    "./style.css",
    "./components/Contador.js",
    "./register.js",
    "./index.js",
    "./favicon.png"
];

const CACHE_NAME = "v1_cache_contador_react";

//Ciclo de vida de un servicework: install, activate y fetch

//Install:  se instala o se genera el cache bajo el nombre/versión de CACHE_NAME, y se incluyen los archivos y extensiones incluidos en el array CACHE_ELEMENTS
//          este evento solo sucede una vez
self.addEventListener("install", (e) => {
    //console.log(e);
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {     //Se crea el nuevo cache bajo el nombre de CACHE_NAME
            cache.addAll(CACHE_ELEMENTS).then( () => {
                self.skipWaiting(); //Hace que se active el proceso de trabajo
            }).catch(err => console.log(err));   //se podría .catch(console.log), ya que el error que reciba es el que va a imprimir
        })
    );
});

//Activate: Borra cualquier cache que no se encuentre dentro de cacheWhitelist, cuando se actualiza de versión la cache principal, se encarga de borrar la versión anterior
//          en caso que si se encuentre dentro de cacheWhitelist lo manda a llamar
self.addEventListener("activate", (e) => {
    const cacheWhitelist = [CACHE_NAME];    //Se asigna la nueva versión a la variable cacheWhitelist
    e.waitUntil(
        caches.keys().then((cacheNames) => {    //Se vacían las caches (sus nombres de archivos y de cache) en cacheNames
            //console.log(cacheNames);
            return Promise.all(cacheNames.map(cacheName => {    //Se mapea a través de cacheNames
                cacheWhitelist.indexOf(cacheName) === -1 && caches.delete(cacheName)    //Si al estar mapeando se retorna un -1 (que es que no existe el cacheName dentro de la cacheWhitelist) se elimina el cacheName
            }));
        }).then(() => self.clients.claim())     //Se reclama el cache (en caso de que si exista cacheName dentro de la cacheWhitelist lo manda a llamar)
    );
});

//Fetch: Este evento se dispara cada que abramos un archivo, busca nuevas versiones de los archivos y retorna las respuestas que se tengan cacheadas, en caso de cachear una
//      nueva respuesta hará la petición y responderá algo nuevo (básicamente si algún requerimiento ya existe en nuestra cache se usa el de cache, si es nuevo se solicita)
self.addEventListener("fetch", (e) => {
    // console.log(e.request);
    e.respondWith( 
        caches.match(e.request).then((res) => //(res ? res : fetch(e.request)));  //En caso de que la respuesta ya exista (en cache) la va a retornar, en caso contrario la va a salicitar (e.request)
    //     Se puede utilizar un if
           {
                if (res) {
                    return res;
            }
            return fetch(e.request);
        })
    // });
    );
    });