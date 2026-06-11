/**
 * Mindless — Onboarding (conversational)
 * A warm chat-bubble flow: greeting → partner → family size → child details →
 * color vibe → summary. Speak or type. Skip always available.
 */
import { store } from '../store.js';
import { router } from '../router.js';
import { blobField } from '../components/gradient-blob.js';

const BOT_AVATAR = 'assets/bot-sitting.png';

const THEMES = [
  { id: 'warm',    label: '☀️ Cálido',  color: '#FFD6C9' },
  { id: 'vibrant', label: '🎨 Vibrante', color: '#C5DDF5' },
  { id: 'pastel',  label: '🌸 Pastel',  color: '#E8E2FF' },
  { id: 'natural', label: '🌿 Natural', color: '#CAE8C8' },
];

export default async function render() {
  const el = document.createElement('div');
  el.appendChild(blobField('default'));

  const root = document.createElement('div');
  root.className = 'onboarding';
  root.innerHTML = `
    <div class="onboarding__top">
      <div class="chat-avatar"><img src="${BOT_AVATAR}" alt="Mindless"></div>
      <button class="onboarding__skip" id="ob-skip">Saltar</button>
    </div>
    <div class="chat" id="ob-chat"></div>
    <div class="onboarding__input-area" id="ob-input"></div>
  `;
  el.appendChild(root);

  const chat = root.querySelector('#ob-chat');
  const inputArea = root.querySelector('#ob-input');
  const name = store.state.user?.givenName || store.state.user?.name || 'guapa';
  const answers = { partnerName: null, kids: 0, children: [], theme: 'warm' };

  function scroll() { chat.scrollTop = chat.scrollHeight; }

  function userBubble(text) {
    const row = document.createElement('div');
    row.className = 'chat-row chat-row--user bubble-in';
    row.innerHTML = `<div class="bubble bubble--user">${escapeHtml(text)}</div>`;
    chat.appendChild(row); scroll();
  }

  function botBubble(html) {
    return new Promise(resolve => {
      const typingRow = document.createElement('div');
      typingRow.className = 'chat-row chat-row--bot';
      typingRow.innerHTML = `
        <div class="chat-avatar"><img src="${BOT_AVATAR}" alt=""></div>
        <div class="bubble bubble--bot typing"><span></span><span></span><span></span></div>`;
      chat.appendChild(typingRow); scroll();
      setTimeout(() => {
        typingRow.remove();
        const row = document.createElement('div');
        row.className = 'chat-row chat-row--bot bubble-in';
        row.innerHTML = `
          <div class="chat-avatar"><img src="${BOT_AVATAR}" alt=""></div>
          <div class="bubble bubble--bot">${html}</div>`;
        chat.appendChild(row); scroll();
        resolve();
      }, 700);
    });
  }

  function clearInput() { inputArea.innerHTML = ''; }

  function chips(options, onPick) {
    clearInput();
    const wrap = document.createElement('div');
    wrap.className = 'chip-options';
    options.forEach(opt => {
      const c = document.createElement('button');
      c.className = 'chip';
      c.textContent = opt.label;
      c.addEventListener('click', () => { userBubble(opt.label); onPick(opt); });
      wrap.appendChild(c);
    });
    inputArea.appendChild(wrap);
  }

  function textInput(placeholder, onSend) {
    clearInput();
    const row = document.createElement('div');
    row.className = 'onboarding__type-row';
    row.innerHTML = `
      <input class="field" type="text" placeholder="${placeholder}" autocomplete="off">
      <button class="onboarding__send" aria-label="Enviar"><i class="ph ph-arrow-up"></i></button>`;
    const input = row.querySelector('input');
    const submit = () => { const v = input.value.trim(); if (!v) return; userBubble(v); onSend(v); };
    row.querySelector('button').addEventListener('click', submit);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
    inputArea.appendChild(row);
    input.focus();
  }

  function dateInput(onSend) {
    clearInput();
    const row = document.createElement('div');
    row.className = 'onboarding__type-row';
    row.innerHTML = `
      <input class="field" type="date" max="${new Date().toISOString().slice(0, 10)}">
      <button class="onboarding__send" aria-label="Enviar"><i class="ph ph-arrow-up"></i></button>`;
    const input = row.querySelector('input');
    const submit = () => {
      const value = input.value;
      if (!value) return;
      userBubble(formatDate(value));
      onSend(value);
    };
    row.querySelector('button').addEventListener('click', submit);
    input.addEventListener('keydown', (event) => { if (event.key === 'Enter') submit(); });
    inputArea.appendChild(row);
    input.focus();
  }

  // ── Flow ──
  async function start() {
    await botBubble(`¡Hola, ${escapeHtml(name)}! 👋 Soy Mindless. Voy a quitarte de la cabeza todo el lío de la casa.`);
    await botBubble('Para empezar... ¿tienes pareja con quien repartes la logística?');
    chips([{ label: 'Sí 💑', v: true }, { label: 'Qué más quisiera 🙃', v: false }], async (o) => {
      if (o.v) { await askPartnerName(); } else { await askKids(); }
    });
  }

  async function askPartnerName() {
    await botBubble('¡Genial! ¿Cómo se llama?');
    textInput('Nombre de tu pareja...', async (v) => {
      answers.partnerName = v;
      await askKids();
    });
  }

  async function askKids() {
    await botBubble('¿Cuántos peques hay en casa?');
    chips(['0', '1', '2', '3', '4+'].map(n => ({ label: n, v: n })), async (o) => {
      answers.kids = o.v === '4+' ? 4 : parseInt(o.v, 10);
      answers.children = [];
      if (answers.kids > 0) { await askChildName(0); } else { await askTheme(); }
    });
  }

  async function askChildName(index) {
    await botBubble(`¿Cómo se llama ${ordinalLabel(index + 1)} peque?`);
    textInput('Nombre del peque...', async (value) => {
      answers.children[index] = { ...(answers.children[index] || {}), name: value.trim() };
      await askChildBirthDate(index);
    });
  }

  async function askChildBirthDate(index) {
    const child = answers.children[index];
    await botBubble(`¿Cuál es la fecha de nacimiento de ${escapeHtml(child.name)}?`);
    dateInput(async (value) => {
      answers.children[index] = { ...child, birthDate: value };
      if (index + 1 < answers.kids) {
        await askChildName(index + 1);
        return;
      }
      await askTheme();
    });
  }

  async function askTheme() {
    await botBubble('Última cosa: ¿con qué colores te sientes más a gusto?');
    chips(THEMES.map(t => ({ label: t.label, v: t.id })), async (o) => {
      answers.theme = o.v;
      await finish();
    });
  }

  async function finish() {
    clearInput();
    await botBubble('Lo tengo todo apuntado. 💛 Bienvenida a tu mini mundo.');
    await persist();
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary btn-block btn-lg';
    btn.textContent = 'Entrar a mi mini mundo';
    btn.addEventListener('click', async () => {
      const completed = await store.markOnboarded();
      if (!completed) {
        await botBubble('Nos falta algun dato antes de entrar. Terminemos el onboarding y seguimos.');
        return;
      }
      router.navigate('/');
    });
    inputArea.appendChild(btn);
  }

  async function persist() {
    try {
      if (answers.partnerName) await store.updateSetting('partner', { name: answers.partnerName });
      await store.updateSetting('theme', answers.theme);
      await store.updateSetting('kids', {
        count: answers.kids,
        children: answers.children.map((child) => ({
          name: child.name,
          birthDate: child.birthDate,
        })),
      });
      const me = store.state.user;
      if (me && !store.state.familyMembers.some((member) => member.role === 'Tú')) {
        await store.addFamilyMember({ name: me.givenName || me.name, role: 'Tú', emoji: '👩' });
      }
      if (answers.partnerName && !store.state.familyMembers.some((member) => member.role === 'Pareja')) {
        await store.addFamilyMember({ name: answers.partnerName, role: 'Pareja', emoji: '🧑' });
      }
      for (const child of answers.children) {
        const alreadyExists = store.state.familyMembers.some((member) =>
          member.role === 'Peque'
          && member.name === child.name
          && member.birthDate === child.birthDate
        );
        if (!alreadyExists) {
          await store.addFamilyMember({ name: child.name, role: 'Peque', emoji: '🧒', birthDate: child.birthDate });
        }
      }
    } catch (e) { console.warn('onboarding persist', e); }
  }

  root.querySelector('#ob-skip').addEventListener('click', async () => {
    await botBubble('Antes de entrar necesito que terminemos estos datos basicos para montar tu mini mundo.');
  });

  setTimeout(start, 350);
  return el;
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function ordinalLabel(index) {
  return ['el primer', 'el segundo', 'el tercer', 'el cuarto'][index - 1] || `el peque ${index}`;
}

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}
