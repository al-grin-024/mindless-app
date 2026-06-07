/**
 * Mindless — Terms of Service
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
      <span class="view-header__title">Términos</span>
    </div>

    <h2>Términos del Servicio</h2>
    <p class="legal__updated">Última actualización: junio de 2026</p>

    <div class="legal__box">
      <p style="margin:0"><strong>Titular</strong><br>
      Mindless S.L. · CIF: ES5318573B<br>
      Madrid, España<br>
      Contacto: <a href="mailto:hello@mindless.app">hello@mindless.app</a></p>
    </div>

    <h3>1. Aceptación</h3>
    <p>Al usar Mindless aceptas estos Términos del Servicio. Si no estás de acuerdo, por favor no
    utilices la aplicación.</p>

    <h3>2. Descripción del servicio</h3>
    <p>Mindless es una aplicación web progresiva (PWA) para la gestión del hogar familiar:
    organiza tareas, comidas, salud, colegio, gastos y agenda, ayudándote a reducir la carga
    mental del día a día.</p>

    <h3>3. Requisitos de la cuenta</h3>
    <p>Para usar Mindless necesitas una cuenta de Google y ser mayor de 18 años. Eres
    responsable de mantener la confidencialidad de tu cuenta.</p>

    <h3>4. Responsabilidades del usuario</h3>
    <ul>
      <li>Proporcionar información veraz.</li>
      <li>Usar la aplicación de forma lícita y conforme a estos términos.</li>
      <li>No intentar acceder a datos de otras personas sin autorización.</li>
    </ul>

    <h3>5. Privacidad</h3>
    <p>El tratamiento de tus datos se rige por nuestra
    <a href="/privacy-policy" data-link>Política de Privacidad</a>.</p>

    <h3>6. Propiedad intelectual</h3>
    <p>La aplicación, su diseño, código y marca son propiedad de Mindless S.L. Se concede una
    licencia de uso personal, no exclusiva e intransferible.</p>

    <h3>7. Exención de responsabilidad</h3>
    <p>Mindless es una herramienta de organización. <strong>No constituye asesoramiento médico,
    legal ni financiero.</strong> Las decisiones importantes deben consultarse con un
    profesional cualificado.</p>

    <h3>8. Limitación de responsabilidad</h3>
    <p>En la medida permitida por la ley, Mindless S.L. no se hace responsable de daños
    indirectos o de la pérdida de datos derivada del uso del servicio. La aplicación se ofrece
    "tal cual", sin garantías de disponibilidad ininterrumpida.</p>

    <h3>9. Ley aplicable y jurisdicción</h3>
    <p>Estos términos se rigen por la legislación española. Para cualquier controversia, las
    partes se someten a los Juzgados y Tribunales de Madrid.</p>

    <h3>10. Modificaciones</h3>
    <p>Podemos actualizar estos términos. Te avisaremos de los cambios relevantes a través de la
    aplicación o por correo.</p>

    <h3>11. Contacto</h3>
    <p>Para cualquier duda: <a href="mailto:hello@mindless.app">hello@mindless.app</a>.</p>
  `;
  view.querySelector('#back').addEventListener('click', back);
  return view;
}
