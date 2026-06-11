import{b as a,r as i}from"./index-tRm4fW5H.js";import"https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";import"https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";import"https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";async function m(){const e=document.createElement("div");e.className="confirm",e.appendChild(a("confirm"));const t=document.createElement("div");t.className="confirm__inner",t.innerHTML=`
    <div class="confirm__done">Done.</div>
    <div class="confirm__line1">It's out of your head.</div>
    <div class="confirm__line2">Enjoy.</div>
  `,e.appendChild(t);const n=document.createElement("button");n.className="confirm__back",n.textContent="Volver a casa",n.addEventListener("click",()=>i.navigate("/")),e.appendChild(n);const o=setTimeout(()=>i.navigate("/"),3500);return n.addEventListener("click",()=>clearTimeout(o)),e}export{m as default};
