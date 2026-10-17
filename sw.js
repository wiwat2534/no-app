/* แคชไฟล์ของแอปไว้ในเครื่อง เพื่อให้เปิดได้แม้ไม่มีอินเทอร์เน็ต */
const V="bp-0d0b7cfb70", CORE=["./", "index.html", "manifest.webmanifest", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "vendor/exceljs.min.js", "vendor/jspdf.umd.min.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!=="bp-fonts").map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url); if(e.request.method!=="GET") return;
  if(u.hostname==="fonts.googleapis.com"||u.hostname==="fonts.gstatic.com"){
    e.respondWith(caches.open("bp-fonts").then(async c=>{const hit=await c.match(e.request);
      const net=fetch(e.request).then(r=>{c.put(e.request,r.clone());return r;}).catch(()=>hit);
      return hit||net;}));
    return;
  }
  if(u.origin!==location.origin) return;
  if(e.request.mode==="navigate"){
    e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(V).then(c=>c.put("index.html",cp));return r;}).catch(()=>caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||fetch(e.request)));
});
