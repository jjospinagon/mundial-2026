/* Service Worker — Mundial 2026
   Habilita notificaciones del sistema (goles) y preparado para Web Push futuro. */
self.addEventListener("install", function(e){ self.skipWaiting(); });
self.addEventListener("activate", function(e){ e.waitUntil(self.clients.claim()); });

/* Al tocar la notificación: enfoca la app o la abre. */
self.addEventListener("notificationclick", function(e){
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type:"window", includeUncontrolled:true }).then(function(cls){
      for(var i=0;i<cls.length;i++){ if("focus" in cls[i]) return cls[i].focus(); }
      if(self.clients.openWindow) return self.clients.openWindow("./");
    })
  );
});

/* Soporte para Web Push (si en el futuro se conecta un servidor con VAPID). */
self.addEventListener("push", function(e){
  var d={ title:"⚽ ¡GOL!", body:"" };
  try{ d=e.data.json(); }catch(err){ try{ d.body=e.data.text(); }catch(_){} }
  e.waitUntil(self.registration.showNotification(d.title||"⚽ ¡GOL!", {
    body:d.body||"", icon:"icon-192.png", badge:"icon-192.png", vibrate:[90,40,90], tag:d.tag||"gol", renotify:true
  }));
});
