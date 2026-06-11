import{b as p,s as r,o as m}from"./index-tRm4fW5H.js";import{t as c}from"./task-card-CzmZCn6w.js";import"https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";import"https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";import"https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";async function w(){const n=document.createElement("div");n.appendChild(p("default"));const t=document.createElement("div");t.className="view",t.innerHTML=`
    <div class="view-header">
      <button class="icon-btn" data-link href="/mini-world" aria-label="Atrás"><i class="ph ph-arrow-left"></i></button>
      <span class="view-header__title">Tareas</span>
    </div>
    <div id="pending-wrap"></div>
    <div id="done-wrap"></div>
  `,n.appendChild(t);const l=r.state.tasks.filter(e=>e.status!=="done"),i=r.state.tasks.filter(e=>e.status==="done"),d=t.querySelector("#pending-wrap");if(!l.length&&!i.length)d.innerHTML=`<div class="empty-state">
      <i class="ph-duotone ph-checks empty-state__icon"></i>
      <p class="empty-state__title">Ni una tarea pendiente</p>
      <p class="text-small text-muted">Cuéntame y la apunto al vuelo.</p></div>`;else{d.innerHTML=`<div class="section-title">Pendiente (${l.length})</div>`;const e=document.createElement("div");e.className="task-list stagger",l.forEach(s=>e.appendChild(c(s))),d.appendChild(e)}if(i.length){const e=t.querySelector("#done-wrap");e.innerHTML=`<div class="section-title mt-6">Hechas (${i.length})</div>`;const s=document.createElement("div");s.className="task-list",i.forEach(o=>s.appendChild(c(o))),e.appendChild(s)}const a=document.createElement("button");return a.className="fab",a.setAttribute("aria-label","Añadir"),a.innerHTML='<i class="ph ph-plus"></i>',a.addEventListener("click",()=>m()),n.appendChild(a),n}export{w as default};
