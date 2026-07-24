export type WhatsAppContext =
  | 'general'
  | 'retiro'
  | 'registro'
  | 'contacto'
  | 'vocacional'
  | 'padres'
  | 'integracion'
  | 'equipo'
  | 'apoyo_economico';

export interface WhatsAppMessageConfig {
  label: string;
  location: string;
  message: string;
}

/**
 * ARCHIVO CENTRAL DE CONFIGURACIÓN DE WHATSAPP
 *
 * Para modificar el mensaje de WhatsApp que envía cualquier botón o tarjeta del sitio,
 * solo cambia la propiedad `message` en la clave correspondiente abajo.
 */
export const whatsappConfig: Record<WhatsAppContext, WhatsAppMessageConfig> = {
  general: {
    label: 'Información General',
    location: 'Botón Flotante Global / CTA Final (Inicio)',
    message: 'Hola, estoy navegando en la página de Kairós y quisiera recibir información general del movimiento.',
  },
  retiro: {
    label: 'Información de Retiro',
    location: 'Hero (Inicio), Bento Card 1 (Inicio), Hero (Retiro) y CTA Final (Retiro)',
    message: 'Hola, me interesa asistir al retiro juvenil y me gustaría recibir más detalles sobre la próxima fecha.',
  },
  registro: {
    label: 'Confirmación de Registro',
    location: 'Envío de Formulario de Registro (/registro)',
    message: 'Hola, acabo de realizar mi registro para el retiro juvenil a través de la página web.',
  },
  contacto: {
    label: 'Dudas Generales',
    location: 'Bento Card 3 (Inicio) / Tarjeta en Página de Contacto',
    message: 'Hola, tengo una consulta sobre Kairós Corazón Vicentino y me gustaría que me ayudaran a resolverla.',
  },
  vocacional: {
    label: 'Acompañamiento Vocacional',
    location: 'Bento Card 4 (Inicio) / Tarjeta en Página de Contacto',
    message: 'Hola, estoy pasando por un proceso de inquietud vocacional y me gustaría recibir acompañamiento del equipo de Kairós.',
  },
  padres: {
    label: 'Atención a Padres de Familia',
    location: 'Bento Card 5 (Inicio) / Tarjeta en Página de Contacto',
    message: 'Hola, soy padre/madre de familia y me gustaría recibir información sobre las actividades y seguridad del retiro para mi hijo(a).',
  },
  integracion: {
    label: 'Integración al Movimiento',
    location: 'Bento Card 2 (Inicio)',
    message: 'Hola, me interesa formar parte de la comunidad de Kairós Corazón Vicentino. ¿Cómo puedo integrarme a sus reuniones o actividades?',
  },
  equipo: {
    label: 'Contacto con Coordinadores',
    location: 'Página Sobre el Movimiento (/movimiento)',
    message: 'Hola, me gustaría ponerme en contacto con el equipo coordinador de Kairós Corazón Vicentino.',
  },
  apoyo_economico: {
    label: 'Consulta de Apoyo Económico / Becas',
    location: 'Tarjeta de Aportación ($1,000 MXN) en /retiro',
    message: 'Hola, quisiera consultar sobre las opciones de apoyos para asistir al retiro (sé que la parte económica no es un impedimento).',
  },
};

/**
 * Mapa simplificado de mensajes para la generación de URLs de WhatsApp.
 */
export const whatsappMessages: Record<WhatsAppContext, string> = Object.fromEntries(
  Object.entries(whatsappConfig).map(([key, config]) => [key, config.message]),
) as Record<WhatsAppContext, string>;
