import{b as f,s as p}from"./index-tRm4fW5H.js";import{t as b}from"./task-card-CzmZCn6w.js";import"https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";import"https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";import"https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";const D=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],M=["L","M","X","J","V","S","D"];function v(i,a){const e=new Date(i),l=new Date(a);return e.getFullYear()===l.getFullYear()&&e.getMonth()===l.getMonth()&&e.getDate()===l.getDate()}async function S(){const i=document.createElement("div");i.appendChild(f("default"));const a=document.createElement("div");a.className="view";let e=new Date;e.setDate(1),a.innerHTML=`
    <div class="view-header">
      <button class="icon-btn" data-link href="/mini-world" aria-label="Atrás"><i class="ph ph-arrow-left"></i></button>
      <span class="view-header__title">Agenda</span>
    </div>
    <div class="card card--flush" style="padding:20px">
      <div class="cal-header">
        <button class="icon-btn" id="prev" aria-label="Mes anterior"><i class="ph ph-caret-left"></i></button>
        <span class="cal-month" id="cal-month"></span>
        <button class="icon-btn" id="next" aria-label="Mes siguiente"><i class="ph ph-caret-right"></i></button>
      </div>
      <div class="cal-grid" id="cal-grid"></div>
    </div>
    <div class="section-title mt-6">Próximos planes</div>
    <div class="task-list" id="cal-events"></div>
  `,i.appendChild(a);const l=a.querySelector("#cal-month"),o=a.querySelector("#cal-grid"),g=new Date;function m(t){return p.state.events.filter(n=>n.date&&v(n.date,t))}function r(){l.textContent=`${D[e.getMonth()]} ${e.getFullYear()}`,o.innerHTML=M.map(s=>`<div class="cal-dow">${s}</div>`).join("");const t=(new Date(e.getFullYear(),e.getMonth(),1).getDay()+6)%7,n=new Date(e.getFullYear(),e.getMonth()+1,0).getDate();for(let s=0;s<t;s++)o.insertAdjacentHTML("beforeend",'<div class="cal-cell cal-cell--empty"></div>');for(let s=1;s<=n;s++){const h=new Date(e.getFullYear(),e.getMonth(),s),d=["cal-cell"];v(h,g)&&d.push("is-today"),m(h).length&&d.push("has-event"),o.insertAdjacentHTML("beforeend",`<div class="${d.join(" ")}">${s}</div>`)}}a.querySelector("#prev").addEventListener("click",()=>{e.setMonth(e.getMonth()-1),r()}),a.querySelector("#next").addEventListener("click",()=>{e.setMonth(e.getMonth()+1),r()}),r();const c=a.querySelector("#cal-events"),u=[...p.state.events.map(t=>({...t,title:t.title,dueDate:t.date,categoryId:t.categoryId||"calendar"})),...p.state.tasks.filter(t=>t.dueDate&&t.dueDate>=Date.now()-864e5)].sort((t,n)=>(t.dueDate||0)-(n.dueDate||0)).slice(0,8);return u.length?(c.classList.add("stagger"),u.forEach(t=>c.appendChild(b(t,{showCheck:!1})))):c.innerHTML=`<div class="empty-state">
      <i class="ph-duotone ph-calendar-heart empty-state__icon"></i>
      <p class="empty-state__title">Agenda despejada</p>
      <p class="text-small text-muted">Nada a la vista. Disfrútalo.</p></div>`,i}export{S as default};
