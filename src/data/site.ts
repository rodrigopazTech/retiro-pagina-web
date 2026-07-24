export const site = {
  name: 'Kairós',
  fullName: 'Kairós Corazón Vicentino',
  tagline: 'Un espacio para encontrarte, crecer y vivir tu fe.',
  description:
    'Movimiento juvenil vicentino para caminar juntos en comunidad, espiritualidad y servicio.',
  whatsappPhone: import.meta.env.PUBLIC_WHATSAPP_PHONE || '521XXXXXXXXXX',
  sheetsEndpoint: import.meta.env.PUBLIC_GOOGLE_SHEETS_ENDPOINT || '',
};

export const navigation = [
  { label: 'Inicio', href: '/' },
  { label: 'Sobre el movimiento', href: '/movimiento' },
  { label: 'Retiro', href: '/retiro' },
  { label: 'Contacto', href: '/contacto' },
];
