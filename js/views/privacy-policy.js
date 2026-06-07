/**
 * Mindless — Privacy Policy (GDPR)
 */
import { store } from '../store.js';
import { router } from '../router.js';

function back() {
  router.navigate(store.state.isAuthenticated ? '/profile' : '/welcome');
}

export default async function render() {
  const view = document.createElement('div');
  view.className = 'view legal';
  view.innerHTML = `
    <div class="view-header">
      <button class="icon-btn" id="back" aria-label="Atrás"><i class="ph ph-arrow-left"></i></button>
      <span class="view-header__title">Privacidad</span>
    </div>

    <h2>Política de Privacidad</h2>
    <p class="legal__updated">Última actualización: junio de 2026</p>

    <div class="legal__box">
      <p style="margin:0"><strong>Responsable del tratamiento</strong><br>
      Mindless S.L. · CIF: ES5318573B<br>
      Madrid, España<br>
      Contacto: <a href="mailto:hello@mindless.app">hello@mindless.app</a></p>
    </div>

    <p>En Mindless nos tomamos tu privacidad muy en serio. Esta política explica qué datos
    tratamos, con qué finalidad y qué derechos tienes, conforme al Reglamento General de
    Protección de Datos (RGPD) y a la Ley Orgánica 3/2018 (LOPDGDD).</p>

    <h3>1. Datos que recogemos</h3>
    <ul>
      <li><strong>Perfil de Google:</strong> nombre, dirección de correo y foto.</li>
      <li><strong>Mensajes de Gmail:</strong> en modo solo lectura y únicamente los relacionados con el colegio, citas y recordatorios de facturas.</li>
      <li><strong>Eventos de Google Calendar:</strong> para organizar la agenda familiar.</li>
      <li><strong>Datos familiares:</strong> miembros de la familia, edades de los peques y preferencias.</li>
      <li><strong>Registros de gastos:</strong> los importes y categorías que tú añades.</li>
    </ul>

    <h3>2. Finalidad</h3>
    <p>Automatizar la gestión del hogar: crear recordatorios, planificar comidas, organizar la
    agenda y llevar el control de gastos para reducir tu carga mental.</p>

    <h3>3. Base legal</h3>
    <p>El tratamiento se basa en tu <strong>consentimiento explícito</strong>
    (art. 6.1.a del RGPD), que puedes retirar en cualquier momento.</p>

    <h3>4. Acceso a Gmail (transparencia)</h3>
    <p>Solo leemos correos para extraer comunicaciones del colegio, avisos de citas y
    recordatorios de facturas. <strong>Nunca leemos tus mensajes personales</strong>, ni los
    almacenamos más allá de lo necesario para crear el recordatorio. Puedes revocar el acceso
    cuando quieras desde tu cuenta de Google o escribiéndonos.</p>

    <h3>5. Almacenamiento</h3>
    <p>Tus datos se guardan en Firebase (Google Cloud), en la región de la
    <strong>Unión Europea (europe-west1)</strong>. En tu dispositivo usamos LocalStorage e
    IndexedDB para que la app funcione sin conexión.</p>

    <h3>6. Terceros</h3>
    <ul>
      <li>Google Identity Services (inicio de sesión)</li>
      <li>Firebase (almacenamiento y sincronización)</li>
      <li>Google Vision API (OCR de documentos que tú subes)</li>
    </ul>

    <h3>7. Conservación</h3>
    <p>Conservamos tus datos hasta que elimines tu cuenta. Tras la eliminación, se borran de
    forma permanente.</p>

    <h3>8. Tus derechos (RGPD)</h3>
    <ul>
      <li>Acceso, rectificación y supresión</li>
      <li>Portabilidad de tus datos</li>
      <li>Oposición y limitación del tratamiento</li>
      <li>Retirar el consentimiento en cualquier momento</li>
    </ul>
    <p>Para ejercerlos, escríbenos a
    <a href="mailto:hello@mindless.app">hello@mindless.app</a>. También puedes presentar una
    reclamación ante la Agencia Española de Protección de Datos (AEPD,
    <a href="https://www.aepd.es" target="_blank" rel="noopener">www.aepd.es</a>).</p>

    <h3>9. Cookies y almacenamiento local</h3>
    <p>No usamos cookies publicitarias. Empleamos LocalStorage e IndexedDB únicamente para el
    funcionamiento offline de la aplicación.</p>

    <h3>10. Contacto</h3>
    <p>Para cualquier duda sobre privacidad:
    <a href="mailto:hello@mindless.app">hello@mindless.app</a>.</p>
  `;
  view.querySelector('#back').addEventListener('click', back);
  return view;
}
