import type { Metadata } from 'next';
import { CONTACT_EMAIL, LEGAL_UPDATED, OPERATOR_ADDRESS, OPERATOR_NAME, pending } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Aviso de privacidad',
  description: 'Qué datos guarda Aprender Náhuatl, para qué los usa y cómo puedes borrarlos.',
  alternates: { canonical: '/privacidad' },
};

export default function Page() {
  return (
    <div className="wrap py-10">
      <div className="prose-col space-y-4 [&_h2]:mt-8 [&_h2]:text-2xl [&_li]:ml-5 [&_li]:list-disc">
        <h1 className="text-4xl sm:text-5xl">Aviso de privacidad</h1>
        <p className="text-sm">Última actualización: {LEGAL_UPDATED}</p>
        <p className="rounded-xl border-2 border-dashed border-ink/60 p-3 text-sm">
          <strong>Borrador.</strong> Este aviso debe completarse y revisarse por un profesional antes de publicar el sitio.
        </p>

        <h2>Quién es responsable</h2>
        <p>
          {pending(OPERATOR_NAME, 'nombre de la persona o empresa responsable')}, con domicilio en{' '}
          {pending(OPERATOR_ADDRESS, 'domicilio')}, es responsable del tratamiento de tus datos personales. Contacto:{' '}
          {pending(CONTACT_EMAIL, 'correo de contacto')}.
        </p>

        <h2>Qué datos guardamos</h2>
        <ul>
          <li><strong>Sin cuenta:</strong> ninguno en nuestros servidores. Tu avance (lecciones terminadas, puntajes, racha y la variante que elegiste) se guarda solo en tu navegador.</li>
          <li><strong>Con cuenta:</strong> tu correo electrónico, tu nombre si entras con Google, y ese mismo avance, para que te siga entre dispositivos.</li>
          <li><strong>Lista del curso:</strong> para empezar las lecciones no se pide ningún correo. Si te uniste antes a la lista del curso, conservamos tu correo (y tu nombre, si lo diste) para avisarte cuando el curso abra. Puedes pedir que te borremos de la lista en cualquier momento escribiendo al contacto de esta página.</li>
          <li><strong>Pagos:</strong> los pagos del curso los procesa Stripe. Tus datos de tarjeta los recibe Stripe directamente; nosotros nunca los vemos ni los guardamos. Solo guardamos el identificador de cliente de Stripe y tu plan (mensual o de por vida).</li>
          <li><strong>Estadísticas de uso:</strong> usamos Google Analytics para saber cuántas personas visitan el sitio, qué páginas leen y cuántas lecciones terminan. Google Analytics usa cookies y recibe datos como tu navegador, tu dispositivo, tu ubicación aproximada (ciudad) y las páginas que visitas. No le enviamos tu nombre ni tu correo.</li>
          <li><strong>Fecha de nacimiento:</strong> la herramienta «Tu signo» hace el cálculo en tu dispositivo. La fecha no se envía ni se guarda.</li>
        </ul>

        <h2>Para qué los usamos</h2>
        <p>Para que puedas iniciar sesión y conservar tu avance, y para entender en conjunto cómo se usa el sitio y mejorarlo. No vendemos tus datos ni mostramos publicidad.</p>

        <h2>Cookies y Google Analytics</h2>
        <p>
          Usamos el «modo de consentimiento» de Google. Si aceptas en el aviso de cookies, Google Analytics guarda cookies para
          distinguir visitas. Si las rechazas o no respondes, no se guardan cookies de analítica: Google solo recibe señales
          anónimas, sin cookies ni identificadores, que permiten contar la visita (por ejemplo, la página vista, el tipo de
          navegador y la hora). Puedes cambiar tu respuesta cuando quieras con «Preferencias de cookies», al pie de cada página. También puedes bloquear
          las cookies desde tu navegador; el sitio sigue funcionando igual. Tu avance en el curso se guarda en el almacenamiento
          local de tu navegador, que es necesario para que el curso funcione y no se usa para medirte. Google trata los datos de
          analítica conforme a su propia política de privacidad.
        </p>

        <h2>Dónde se guardan</h2>
        <p>Las cuentas y el avance se almacenan con Supabase, el sitio se sirve desde Vercel, los pagos los procesa Stripe y las estadísticas las procesa Google; los cuatro actúan como encargados y pueden procesar datos fuera de México.</p>

        <h2>Tus derechos</h2>
        <p>
          Puedes acceder a tus datos, corregirlos, cancelarlos u oponerte a su uso (derechos ARCO). Para borrar tu cuenta y todo
          tu avance, entra a «Mi cuenta» y elige «Borrar mi cuenta»; el borrado es inmediato. Para cualquier otra solicitud, escribe a{' '}
          {pending(CONTACT_EMAIL, 'correo de contacto')}.
        </p>

        <h2>Menores de edad</h2>
        <p>El curso se puede usar sin cuenta. Si eres menor de edad, pide permiso a tu madre, padre o tutor antes de crear una.</p>

        <h2>Cambios</h2>
        <p>Si este aviso cambia, publicaremos aquí la nueva versión con su fecha.</p>
      </div>
    </div>
  );
}
