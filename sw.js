const V='course-v1',SHELL=['./','index.html','logo.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>0)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!='GET')return;
  const same=u.origin==location.origin;
  if(!same&&u.hostname!='cdn.jsdelivr.net'&&!u.hostname.startsWith('fonts.g'))return;
  e.respondWith(caches.open(V).then(async c=>{
    const m=await c.match(r);
    if(same){
      try{const n=await fetch(r);if(n.ok)c.put(r,n.clone());return n}
      catch(_){return m||(await c.match('index.html'))||(await c.match('./'))}
    }
    if(m)return m;
    const n=await fetch(r);if(n.ok)c.put(r,n.clone());return n;
  }))});
