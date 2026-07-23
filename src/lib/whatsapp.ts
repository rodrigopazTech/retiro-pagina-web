import { site } from '../data/site';
import { whatsappMessages, type WhatsAppContext } from '../data/whatsapp';

export function whatsappUrl(
  context: WhatsAppContext,
  fields: Record<string, string> = {},
) {
  const details = Object.entries(fields)
    .filter(([, value]) => value.trim())
    .map(([key, value]) => `${key}: ${value.trim()}`)
    .join('\n');

  const message = details ? `${whatsappMessages[context]}\n\n${details}` : whatsappMessages[context];
  return `https://wa.me/${site.whatsappPhone}?text=${encodeURIComponent(message)}`;
}
