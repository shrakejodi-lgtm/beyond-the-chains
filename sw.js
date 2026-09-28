const CACHE="btc-v2";

const ASSETS=[
  "./",
  "./index.html",
  "./manifest.json",
  "./sw.js",
  "./file_0000000069f4822fa3dbc47f5a5b266f.png"
];

self.addEventListener("install",e=>
  e.waitUntil(
    caches.open(CACHE)
      .then(c=>c.addAll(ASSETS))
      .then(()=>self.skipWaiting())
  )
);

self.addEventListener("activate",e=>
  e.waitUntil(
    self.clients.claim()
  )
);

self.addEventListener("fetch",e=>{

  if(e.request.method!=="GET") return;

  e.respondWith(

    caches.match(e.request)

      .then(cached=>
        cached ||
        fetch(e.request)
          .then(r=>{

            const copy=r.clone();

            caches.open(CACHE)
              .then(c=>c.put(e.request,copy));

            return r;

          })
          .catch(()=>
            caches.match("./index.html")
          )
      )

  );

});
