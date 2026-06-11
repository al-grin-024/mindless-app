const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-tRm4fW5H.js","assets/index-DQqQX8YO.css"])))=>i.map(i=>d[i]);
import{s,b as $,a as k,r as y,_}from"./index-tRm4fW5H.js";import"https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";import"https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";import"https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";const E={isSupported:"Notification"in window&&"serviceWorker"in navigator,async requestPermission(){return this.isSupported?Notification.permission==="granted"?!0:await Notification.requestPermission()==="granted":!1},async showLocal(t,e={}){if(!this.isSupported||Notification.permission!=="granted")return;(await navigator.serviceWorker.ready).showNotification(t,{icon:"icons/icon-192x192.svg",...e})}};let f=!1;function x(){const t=location.origin+location.pathname.replace(/[^/]*$/,"");let e=s.state.settings.partnerInviteToken;return e||(e=crypto.randomUUID&&crypto.randomUUID().slice(0,8)||Math.random().toString(36).slice(2,10),s.updateSetting("partnerInviteToken",e).catch(()=>{})),t+"?invite="+e}function S(){if(f)return;f=!0;const t=document.createElement("div");t.className="sheet-backdrop";const e=document.createElement("div");e.className="sheet";const o=s.state.settings.partnerInvite,r=s.state.user?.givenName||s.state.user?.name||"tu pareja",c=x();e.innerHTML=`
    <div class="sheet__handle"></div>
    <div class="sheet__title">Invita a tu pareja</div>
    <div class="sheet__hint">Mindless va mejor en equipo. Mándale una invitación y repartís el lío de casa. 💛</div>

    <label class="field-label">Su email</label>
    <input class="field" id="inv-email" type="email" inputmode="email" autocomplete="email"
           placeholder="pareja@email.com" value="${o?.email||""}">

    <button class="btn btn-primary btn-block mt-4" id="inv-send">
      <i class="ph ph-paper-plane-tilt"></i> Enviar invitación
    </button>
    <button class="btn btn-ghost btn-block mt-2" id="inv-copy">
      <i class="ph ph-link-simple"></i> Copiar enlace
    </button>
    ${navigator.share?'<button class="btn btn-ghost btn-block mt-2" id="inv-share"><i class="ph ph-share-network"></i> Compartir</button>':""}

    <div id="inv-status" class="text-small text-center mt-4"></div>
  `,document.body.appendChild(t),document.body.appendChild(e);const p=e.querySelector("#inv-email"),u=e.querySelector("#inv-status");function i(n,m=!0){u.textContent=n,u.style.color=m?"var(--cat-mint-ink)":"var(--cat-rose-ink)"}function l(n){s.updateSetting("partnerInvite",{email:n||"",status:"pending",sentAt:Date.now()}).catch(()=>{})}function v(){f&&(f=!1,e.classList.add("is-closing"),t.classList.add("is-closing"),setTimeout(()=>{e.remove(),t.remove()},280))}const a=`¡Hola! Te invito a organizar nuestra casa conmigo en Mindless, nuestro segundo cerebro para no olvidarnos de nada. Únete aquí: ${c} — ${r} 💛`;e.querySelector("#inv-send").addEventListener("click",()=>{const n=(p.value||"").trim();if(n&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(n)){i("Ese email no tiene buena pinta 🤔",!1);return}l(n);const m=encodeURIComponent("Te invito a Mindless 💛"),w=encodeURIComponent(a);window.location.href=`mailto:${n}?subject=${m}&body=${w}`,i("Invitación preparada en tu correo ✉️"),setTimeout(v,1200)}),e.querySelector("#inv-copy").addEventListener("click",async()=>{l((p.value||"").trim());try{await navigator.clipboard.writeText(c),i("Enlace copiado. ¡Pégaselo donde quieras! 🔗")}catch{i(c,!0)}});const g=e.querySelector("#inv-share");g&&g.addEventListener("click",async()=>{l((p.value||"").trim());try{await navigator.share({title:"Mindless",text:a,url:c}),i("¡Compartido! 💛")}catch{}}),t.addEventListener("click",v)}function d({icon:t,iconBg:e,label:o,value:r="",toggle:c=!1,on:p=!1,chev:u=!0,id:i=""}){return`
    <div class="settings-row" ${i?`data-row="${i}"`:""}>
      <div class="settings-row__icon" style="background:${e}"><i class="ph ${t}"></i></div>
      <div class="settings-row__label">${o}</div>
      ${r?`<div class="settings-row__value">${r}</div>`:""}
      ${c?`<div class="toggle ${p?"on":""}" data-toggle></div>`:u?'<i class="ph ph-caret-right settings-row__chev"></i>':""}
    </div>`}async function q(){const t=document.createElement("div");t.appendChild($("default"));const e=document.createElement("div");e.className="view";const o=s.state.user||{},r=o.name||"Tu perfil",c=o.email||"",p=o.photoUrl?`<img class="profile-avatar" src="${o.photoUrl}" alt="${r}" referrerpolicy="no-referrer">`:`<div class="profile-avatar avatar-fallback profile-avatar-fb">${(r[0]||"M").toUpperCase()}</div>`,u=Notification&&Notification.permission==="granted",i=s.state.settings.partnerInvite?.email||s.state.settings.partner?.name||s.state.partner?.name;e.innerHTML=`
    <div class="profile-head">
      ${p}
      <div class="profile-name">${h(r)}</div>
      <div class="profile-email">${h(c)}</div>
      <button class="profile-edit" id="edit-btn">Editar</button>
    </div>

    <div class="settings-group">
      <div class="settings-group__label">Cuenta</div>
      <div class="settings-card">
        ${d({icon:"ph-translate",iconBg:"var(--cat-blue)",label:"Idioma",value:"Español"})}
        ${d({icon:"ph-bell",iconBg:"var(--cat-peach)",label:"Notificaciones",toggle:!0,on:u,id:"notif"})}
        ${d({icon:"ph-user-plus",iconBg:"var(--cat-teal)",label:"Invitar a tu pareja",value:i?h(i):"",id:"partner"})}
      </div>
    </div>

    <div class="settings-group">
      <div class="settings-group__label">Preferencias</div>
      <div class="settings-card">
        ${d({icon:"ph-palette",iconBg:"var(--cat-lilac)",label:"Colores y tema",id:"theme"})}
        ${d({icon:"ph-cooking-pot",iconBg:"var(--cat-peach)",label:"Comida",id:"food"})}
        ${d({icon:"ph-microphone",iconBg:"var(--cat-rose)",label:"Voz",id:"voice"})}
      </div>
    </div>

    <div class="settings-group">
      <div class="settings-group__label">Legal</div>
      <div class="settings-card">
        ${d({icon:"ph-lock-simple",iconBg:"var(--cat-mint)",label:"Política de privacidad",id:"privacy"})}
        ${d({icon:"ph-scroll",iconBg:"var(--cat-yellow)",label:"Términos del servicio",id:"terms"})}
      </div>
    </div>

    <button class="btn btn-secondary btn-block" id="signout-btn">
      <i class="ph ph-sign-out"></i> Cerrar sesión
    </button>

    <div class="profile-footer">
      Mindless v1.0 — Mindless S.L.<br>
      CIF: ES5318573B
    </div>
  `,t.appendChild(e),e.querySelector("#signout-btn").addEventListener("click",()=>k.signOut()),e.querySelector("#edit-btn").addEventListener("click",()=>b("La edición de perfil llega muy pronto 💛")),e.querySelectorAll("[data-row]").forEach(v=>{const a=v.getAttribute("data-row");v.addEventListener("click",async g=>{g.target.closest("[data-toggle]")||(a==="privacy"?y.navigate("/privacy-policy"):a==="terms"?y.navigate("/terms"):a==="partner"?S():a==="voice"?(await _(async()=>{const{openTellMe:n}=await import("./index-tRm4fW5H.js").then(m=>m.t);return{openTellMe:n}},__vite__mapDeps([0,1]))).openTellMe():b("En camino 🚧"))})});const l=e.querySelector('[data-row="notif"] [data-toggle]');return l&&l.addEventListener("click",async v=>{if(v.stopPropagation(),l.classList.contains("on")){b("Desactívalas desde los ajustes del navegador.");return}const a=await E.requestPermission();l.classList.toggle("on",a),b(a?"Te avisaré de lo importante 🔔":"Sin permiso no puedo avisarte 😢")}),t}function b(t){const e=document.createElement("div");e.textContent=t,e.style.cssText="position:fixed;left:50%;bottom:calc(var(--nav-height) + 24px);transform:translateX(-50%);background:#2D2D2D;color:#fff;padding:12px 20px;border-radius:100px;font-size:0.875rem;font-weight:600;z-index:200;box-shadow:0 6px 20px rgba(0,0,0,0.25);animation:fadeUp 300ms ease-out both;max-width:90vw;text-align:center",document.body.appendChild(e),setTimeout(()=>{e.style.animation="fadeOut 300ms ease-out both",setTimeout(()=>e.remove(),300)},2200)}function h(t){return String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}export{q as default};
