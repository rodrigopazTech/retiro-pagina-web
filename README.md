# Kairos Corazón Vicentino

Portal web construido con Astro, TypeScript y CSS modular. Las páginas informativas se generan como contenido estático y el registro se conecta con Google Sheets mediante Google Apps Script.

## Inicio local

```bash
npm install
cp .env.example .env
npm run dev
```

## Configuración

Edita `.env`:

```env
PUBLIC_WHATSAPP_PHONE=521XXXXXXXXXX
PUBLIC_GOOGLE_SHEETS_ENDPOINT=https://script.google.com/macros/s/TU_ID/exec
```

El número de WhatsApp debe estar en formato internacional, sin `+`, espacios ni guiones.

## Google Sheets

1. Crea una hoja de cálculo y una pestaña llamada `Registros`.
2. Abre `Extensiones > Apps Script`.
3. Copia el contenido de `backend/google-apps-script/Code.gs`.
4. Implementa como aplicación web ejecutada por tu cuenta y con acceso para cualquiera.
5. Copia la URL que termina en `/exec` a `.env`.

El formulario guarda primero el registro y después abre WhatsApp con un mensaje personalizado. Si la URL de Apps Script no está configurada, el flujo muestra un aviso para evitar asumir que el registro quedó guardado.

## Rutas

- `/` — inicio
- `/movimiento` — identidad, historia y valores
- `/retiro` — información del retiro
- `/registro` — formulario
- `/contacto` — contacto directo

## Siguiente configuración necesaria

- Número oficial de WhatsApp.
- URL publicada de Google Apps Script.
- Logo e imágenes definitivas.
- Fechas, lugar, cupo y aportación confirmados del retiro.
