import{b as v,s as r}from"./index-tRm4fW5H.js";import"https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";import"https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";import"https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";const g={food:"ph-cooking-pot",school:"ph-backpack",health:"ph-heartbeat",home:"ph-house",social:"ph-gift",shopping:"ph-shopping-bag"};function d(a){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(a||0)}async function y(){const a=document.createElement("div");a.appendChild(v("default"));const s=document.createElement("div");s.className="view";const l=new Date,i=r.state.expenses.filter(e=>{const t=new Date(e.date);return t.getMonth()===l.getMonth()&&t.getFullYear()===l.getFullYear()}),m=i.reduce((e,t)=>e+(Number(t.amount)||0),0),u=r.state.settings.financeSplit||"50/50";s.innerHTML=`
    <div class="view-header">
      <button class="icon-btn" data-link href="/mini-world" aria-label="Atrás"><i class="ph ph-arrow-left"></i></button>
      <span class="view-header__title">Gastos</span>
    </div>
    <div class="expense-summary">
      <div class="expense-summary__label">Este mes</div>
      <div class="expense-summary__amount">${d(m)}</div>
      <div class="expense-summary__split">Repartido ${u} con tu pareja</div>
    </div>
    <div class="section-title">Movimientos</div>
    <div class="expense-list" id="exp-list"></div>
  `,a.appendChild(s);const o=s.querySelector("#exp-list");i.length?(o.classList.add("stagger"),i.sort((e,t)=>t.date-e.date).forEach(e=>{const t=document.createElement("div");t.className="expense-card",t.style.background="var(--cat-yellow)";const c=g[e.categoryId]||"ph-receipt",h=new Date(e.date).toLocaleDateString("es-ES",{day:"numeric",month:"short"});t.innerHTML=`
          <div class="expense-card__icon"><i class="ph ${c}"></i></div>
          <div class="expense-card__body">
            <div class="expense-card__title">${p(e.title||"Gasto")}</div>
            <div class="expense-card__meta">${h}${e.paidBy?" · "+p(e.paidBy):""}</div>
          </div>
          <div class="expense-card__amount">${d(e.amount)}</div>`,o.appendChild(t)})):o.innerHTML=`<div class="empty-state">
      <i class="ph-duotone ph-piggy-bank empty-state__icon"></i>
      <p class="empty-state__title">Sin gastos este mes</p>
      <p class="text-small text-muted">Cuéntame un gasto y lo reparto por ti.</p></div>`;const n=document.createElement("button");return n.className="fab",n.setAttribute("aria-label","Añadir gasto"),n.innerHTML='<i class="ph ph-plus"></i>',n.addEventListener("click",async()=>{const e=prompt("¿Qué gasto?");if(!e)return;const t=parseFloat((prompt("¿Cuánto? (€)")||"").replace(",","."));isNaN(t)||(await r.addExpense({title:e.trim(),amount:t,categoryId:"home",date:Date.now()}),y().then(c=>{a.replaceWith(c)}))}),a.appendChild(n),a}function p(a){return String(a??"").replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[s])}export{y as default};
