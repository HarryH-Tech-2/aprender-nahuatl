import type { Metadata } from 'next';
import { CONTACT_EMAIL, LEGAL_UPDATED, OPERATOR_ADDRESS, OPERATOR_NAME, pending } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Términos de uso',
  description: 'Las condiciones para usar Aprender Náhuatl.',
  alternates: { canonical: '/terminos' },
};

export default function Page() {
  return (
    <div className="wrap py-10">
      <div className="prose-col space-y-4 [&_h2]:mt-8 [&_h2]:text-2xl">
        <h1 className="text-4xl sm:text-5xl">Términos de uso</h1>
        <p className="text-sm">Última actualización: {LEGAL_UPDATED}</p>
        <p className="rounded-xl border-2 border-dashed border-ink/60 p-3 text-sm">
          <strong>Borrador.</strong> Estos términos deben completarse y revisarse por un profesional antes de publicar el sitio.
        </p>

        <h2>El servicio</h2>
        <p>
          Aprender Náhuatl es un sitio educativo operado por {pending(OPERATOR_NAME, 'nombre de la persona o empresa responsable')}.
          La lección 1, las herramientas, las frases y los juegos son gratis. El curso completo, con todas las lecciones, es de pago,
          como se explica en «Precios y pagos».
        </p>

        <h2>Precios y pagos</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li><strong>Plan mensual:</strong> MXN $89 al mes, IVA incluido. Se renueva cada mes hasta que lo canceles desde «Mi cuenta»; al cancelar conservas el acceso hasta el final del periodo ya pagado.</li>
          <li><strong>De por vida:</strong> MXN $299, pago único, IVA incluido. Da acceso a las lecciones actuales y a las que se agreguen en el futuro, mientras el sitio exista.</li>
          <li><strong>Pasar de mensual a de por vida:</strong> al comprar el plan de por vida se cancela la suscripción mensual. No se reembolsan los meses ya pagados.</li>
          <li><strong>Formas de pago:</strong> tarjeta (incluye Apple Pay y Google Pay) y Link. Los pagos los procesa Stripe.</li>
          <li><strong>Reembolsos:</strong> {pending('', 'política de reembolsos')}</li>
          <li><strong>Vendedor:</strong> {pending(OPERATOR_NAME, 'nombre y dirección del vendedor')}{OPERATOR_ADDRESS ? `, ${OPERATOR_ADDRESS}` : ''}</li>
        </ul>

        <h2>Contenido en revisión</h2>
        <p>
          El material se ofrece con fines educativos y «tal cual». Todavía no ha sido revisado por hablantes nativos y puede
          contener errores. No lo uses como única fuente para traducciones oficiales, trabajos académicos o tatuajes.
        </p>

        <h2>Tu cuenta</h2>
        <p>Crear una cuenta es opcional. Eres responsable de lo que se haga con ella. Puedes borrarla cuando quieras desde «Mi cuenta».</p>

        <h2>Uso permitido</h2>
        <p>
          Puedes usar el sitio para aprender y enseñar, también en un salón de clases. No está permitido copiar el curso completo
          para republicarlo, ni usar medios automáticos que afecten el funcionamiento del sitio.
        </p>

        <h2>Propiedad intelectual</h2>
        <p>
          Los textos, ejercicios e ilustraciones del sitio pertenecen a su operador. La lengua náhuatl y su patrimonio cultural
          pertenecen a los pueblos que la hablan.
        </p>

        <h2>Contacto</h2>
        <p>{pending(CONTACT_EMAIL, 'correo de contacto')}</p>
      </div>
    </div>
  );
}
