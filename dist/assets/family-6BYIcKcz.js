import{b as p,s as n}from"./index-tRm4fW5H.js";import"https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";import"https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";import"https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";const c=["var(--cat-teal)","var(--cat-peach)","var(--cat-blue)","var(--cat-lilac)","var(--cat-rose)","var(--cat-mint)"];async function g(){const e=document.createElement("div");e.appendChild(p("default"));const a=document.createElement("div");a.className="view",a.innerHTML=`
    <div class="view-header">
      <button class="icon-btn" data-link href="/mini-world" aria-label="Atrás"><i class="ph ph-arrow-left"></i></button>
      <span class="view-header__title">Familia</span>
    </div>
    <div class="family-list" id="fam-list"></div>
    <button class="btn btn-secondary btn-block mt-6" id="add-member">
      <i class="ph ph-user-plus"></i> Añadir a alguien
    </button>
  `,e.appendChild(a);const r=a.querySelector("#fam-list");function l(){r.innerHTML="";const i=n.state.familyMembers;if(!i.length){r.innerHTML=`<div class="empty-state">
        <i class="ph-duotone ph-users-three empty-state__icon"></i>
        <p class="empty-state__title">Tu familia, en un sitio</p>
        <p class="text-small text-muted">Añade a tu pareja y a los peques.</p></div>`;return}r.classList.add("stagger"),i.forEach((t,d)=>{const s=document.createElement("div");s.className="family-card",s.style.background=c[d%c.length];const m=(t.name||"?")[0].toUpperCase(),u=[t.role||"Familia",t.birthDate?v(t.birthDate):""].filter(Boolean).join(" · ");s.innerHTML=`
	        <div class="avatar-fallback family-card__avatar" style="background:rgba(255,255,255,0.55)">${t.emoji||m}</div>
	        <div class="flex-1">
	          <div class="family-card__name">${o(t.name)}</div>
	          <div class="family-card__role">${o(u)}</div>
	        </div>`,r.appendChild(s)})}return l(),a.querySelector("#add-member").addEventListener("click",async()=>{const i=prompt("¿Cómo se llama?");if(!i)return;const t=prompt("¿Quién es? (Pareja, Peque, Abuela...)")||"Familia";await n.addFamilyMember({name:i.trim(),role:t.trim(),emoji:""}),l()}),e}function o(e){return String(e??"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}function v(e){const a=new Date(`${e}T00:00:00`);return Number.isNaN(a.getTime())?e:a.toLocaleDateString("es-ES",{day:"numeric",month:"short",year:"numeric"})}export{g as default};
