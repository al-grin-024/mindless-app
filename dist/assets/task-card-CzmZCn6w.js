import{s as g}from"./index-tRm4fW5H.js";const u={food:{bg:"var(--cat-peach)",label:"Comida"},health:{bg:"var(--cat-mint)",label:"Salud"},school:{bg:"var(--cat-blue)",label:"Cole"},finance:{bg:"var(--cat-yellow)",label:"Gastos"},expenses:{bg:"var(--cat-yellow)",label:"Gastos"},social:{bg:"var(--cat-lilac)",label:"Social"},calendar:{bg:"var(--cat-pink)",label:"Agenda"},family:{bg:"var(--cat-teal)",label:"Familia"},spark:{bg:"var(--cat-rose)",label:"Chispa"},home:{bg:"var(--cat-blue)",label:"Casa"}};function v(a){return u[a]||{bg:"var(--cat-blue)",label:"Tarea"}}function m(a){if(!a)return"·";const t=new Date(a);return isNaN(t)?"·":t.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:!1})}function h(a,t={}){const{showCheck:c=!0,onToggle:s,onClick:i,showCat:d=!0}=t,n=v(a.categoryId),o=a.status==="done",e=document.createElement("div");return e.className="task-card"+(o?" is-done":""),e.style.background=n.bg,e.innerHTML=`
    <div class="task-card__time">${a.time||m(a.dueDate)}</div>
    <div class="task-card__body">
      <div class="task-card__title">${r(a.title)}</div>
      ${a.assignee||a.meta?`<div class="task-card__meta">${r(a.assignee||a.meta)}</div>`:""}
    </div>
    ${d?`<span class="task-card__cat">${n.label}</span>`:""}
    ${c?'<button class="task-card__check" aria-label="Hecho"><i class="ph ph-check"></i></button>':""}
  `,c&&e.querySelector(".task-card__check").addEventListener("click",async b=>{b.stopPropagation();const l=o?"pending":"done";e.classList.toggle("is-done",l==="done"),await g.updateTask(a.id,{status:l}),s&&s(l)}),i&&e.addEventListener("click",()=>i(a)),e}function r(a){return String(a??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}export{h as t};
