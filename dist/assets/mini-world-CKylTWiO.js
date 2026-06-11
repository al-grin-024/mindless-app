import{b as r,s as d,o as p,r as m}from"./index-tRm4fW5H.js";import{t as u}from"./task-card-CzmZCn6w.js";import"https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";import"https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";import"https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";const h=[{id:"food",label:"Comida",icon:"ph-cooking-pot",bg:"var(--cat-peach)",route:"/mini-world/food"},{id:"medical",label:"Salud",icon:"ph-heartbeat",bg:"var(--cat-mint)",route:"/mini-world/medical"},{id:"school",label:"Cole",icon:"ph-backpack",bg:"var(--cat-blue)",route:"/mini-world/school"},{id:"expenses",label:"Gastos",icon:"ph-piggy-bank",bg:"var(--cat-yellow)",route:"/expenses"},{id:"social",label:"Social",icon:"ph-gift",bg:"var(--cat-lilac)",route:"/mini-world/social"},{id:"calendar",label:"Agenda",icon:"ph-calendar-dots",bg:"var(--cat-pink)",route:"/calendar"},{id:"family",label:"Familia",icon:"ph-users-three",bg:"var(--cat-teal)",route:"/family"},{id:"spark",label:"Chispa",icon:"ph-heart-straight",bg:"var(--cat-rose)",route:"/mini-world/spark"}],c={food:{label:"Comida",icon:"ph-cooking-pot",bg:"var(--cat-peach)",cat:"food",intro:"Planifico el menú, la lista de la compra y hasta la merienda. Tú solo decide qué te apetece."},medical:{label:"Salud",icon:"ph-heartbeat",bg:"var(--cat-mint)",cat:"health",intro:"Vacunas, revisiones y la pediatra del centro de salud. Te aviso antes de que se te pase."},school:{label:"Cole",icon:"ph-backpack",bg:"var(--cat-blue)",cat:"school",intro:"Leo los correos del AMPA y del cole para que no se te escape ninguna excursión ni disfraz."},social:{label:"Social",icon:"ph-gift",bg:"var(--cat-lilac)",cat:"social",intro:"Cumpleaños, regalos y compromisos. Te recuerdo a quién felicitar y qué llevar."},spark:{label:"Chispa",icon:"ph-heart-straight",bg:"var(--cat-rose)",cat:"spark",intro:"Vuestro rinconcito de pareja: planes, detalles y tiempo para vosotros dos."}};async function C(a){return a&&c[a]?v(a):b()}function b(){const a=document.createElement("div");a.appendChild(r("default"));const e=document.createElement("div");e.className="view",e.innerHTML=`
    <div class="view-header" style="margin-left:0">
      <h1 class="view-header__title" style="font-size:1.75rem">Tu mini mundo</h1>
    </div>
    <p class="text-small text-muted mb-4" style="margin-top:-12px">Todo lo de casa, ordenadito por rincones.</p>
    <div class="miniworld-grid stagger" id="mw-grid"></div>
  `,a.appendChild(e);const l=e.querySelector("#mw-grid");return h.forEach(t=>{const i=document.createElement("button");i.className="miniworld-card",i.style.background=t.bg,i.innerHTML=`
      <i class="ph-duotone ${t.icon} miniworld-card__icon"></i>
      <span class="miniworld-card__label">${t.label}</span>`,i.addEventListener("click",()=>m.navigate(t.route)),l.appendChild(i)}),a}function v(a){const e=c[a],l=document.createElement("div");l.appendChild(r("default"));const t=document.createElement("div");t.className="view",t.innerHTML=`
    <div class="view-header">
      <button class="icon-btn" data-link href="/mini-world" aria-label="Atrás"><i class="ph ph-arrow-left"></i></button>
      <span class="view-header__title">${e.label}</span>
    </div>
    <div class="section-intro" style="background:${e.bg}">
      <i class="ph-duotone ${e.icon} section-intro__icon"></i>
      <div class="section-intro__text">${e.intro}</div>
    </div>
    <div class="section-title">Pendiente</div>
    <div class="task-list" id="mw-tasks"></div>
  `,l.appendChild(t);const i=t.querySelector("#mw-tasks"),s=d.state.tasks.filter(o=>o.categoryId===e.cat);if(s.length)i.classList.add("stagger"),s.forEach(o=>i.appendChild(u(o)));else{const o=document.createElement("div");o.className="empty-state",o.innerHTML=`
      <i class="ph-duotone ${e.icon} empty-state__icon"></i>
      <p class="empty-state__title">Aquí no hay líos todavía</p>
      <p class="text-small text-muted">Cuéntame y lo guardo en ${e.label}.</p>`;const n=document.createElement("button");n.className="btn btn-primary",n.innerHTML='<i class="ph ph-microphone"></i> Cuéntame',n.addEventListener("click",()=>p()),o.appendChild(n),i.appendChild(o)}return l}export{C as default};
