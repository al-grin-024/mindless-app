import{b as v,s as u,o as h,r as y}from"./index-tRm4fW5H.js";import{t as f}from"./task-card-CzmZCn6w.js";import"https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";import"https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";import"https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";const D=["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];function k(){const a=new Date().getHours();return a<6?"Buenas noches":a<14?"Buenos días":a<21?"Buenas tardes":"Buenas noches"}function b(a){const t=new Date(a),s=(t.getDay()+6)%7;return t.setDate(t.getDate()-s),t.setHours(0,0,0,0),t}function p(a,t){const s=new Date(a),r=new Date(t);return s.getFullYear()===r.getFullYear()&&s.getMonth()===r.getMonth()&&s.getDate()===r.getDate()}async function E(){const a=document.createElement("div");a.appendChild(v("default"));const t=document.createElement("div");t.className="view";const s=u.state.user||{},r=s.givenName||(s.name||"").split(" ")[0]||"",m=s.photoUrl?`<img class="dash-avatar" src="${s.photoUrl}" alt="${r}" referrerpolicy="no-referrer">`:`<div class="dash-avatar avatar-fallback">${(r[0]||"M").toUpperCase()}</div>`,o=new Date,d=b(o);let l="";for(let e=0;e<7;e++){const n=new Date(d);n.setDate(d.getDate()+e);const g=p(n,o)?" is-today":"";l+=`
      <div class="week-day${g}">
        <span class="week-day__name">${D[e]}</span>
        <span class="week-day__num">${n.getDate()}</span>
      </div>`}t.innerHTML=`
    <div class="dash-header">
      <div>
        <div class="dash-greeting">${k()},<br>${w(r)||"guapa"} 👋</div>
        <div class="dash-subgreeting">Esto es lo de hoy. Yo me encargo del resto.</div>
      </div>
      <button data-link href="/profile" aria-label="Perfil" style="background:none">${m}</button>
    </div>
    <div class="week-strip">${l}</div>
    <div class="section-title">Hoy</div>
    <div class="task-list" id="dash-tasks"></div>
  `,a.appendChild(t);const i=t.querySelector("#dash-tasks"),c=u.state.tasks.filter(e=>!e.dueDate||p(e.dueDate,o)).sort((e,n)=>(e.dueDate||0)-(n.dueDate||0));if(c.length)i.classList.add("stagger"),c.forEach(e=>i.appendChild(f(e,{onClick:()=>y.navigate("/tasks")})));else{const e=document.createElement("div");e.className="empty-state",e.innerHTML=`
      <i class="ph-duotone ph-cloud-sun empty-state__icon"></i>
      <p class="empty-state__title">Hoy estás libre de líos</p>
      <p class="text-small text-muted">Cuéntame algo y yo lo organizo por ti.</p>
    `;const n=document.createElement("button");n.className="btn btn-primary",n.innerHTML='<i class="ph ph-microphone"></i> Cuéntame',n.addEventListener("click",()=>h()),e.appendChild(n),i.appendChild(e)}return a}function w(a){return String(a??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}export{E as default};
