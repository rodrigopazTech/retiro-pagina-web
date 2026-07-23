# 📋 Inventario Clasificado y Central de Configuración de WhatsApp

Este documento describe la relación entre **botones/tarjetas del sitio web** y los **mensajes personalizados de WhatsApp**, así como el archivo central de código donde se administran todos los mensajes.

---

## ⚙️ Archivo Central de Configuración (Código)

Todos los mensajes de WhatsApp están **centralizados en un único archivo de código**:

📍 **Ruta del Archivo:** [src/data/whatsapp.ts](file:///Users/rodrigopaz/Desktop/Retiro%20-%20Pagina%20web/src/data/whatsapp.ts)

Para cambiar el texto que envía cualquier botón o tarjeta, solo debes abrir ese archivo y modificar la propiedad `message` del contexto correspondiente. El cambio se reflejará automáticamente en todo el sitio web.

---

## 📑 Tabla de Relación: Botón / Ubicación / Mensaje de WhatsApp

| Contexto (`key`) | Etiqueta / Función | Ubicación en el Sitio | Mensaje Predeterminado Enviado a WhatsApp |
| :--- | :--- | :--- | :--- |
| **`general`** | Información General | Botón Flotante Global / CTA Final (`/`) | *"Hola, estoy navegando en la página de Kairos y quisiera recibir información general del movimiento."* |
| **`retiro`** | Información de Retiro | Hero (`/`), Bento Card 1 (`/`), Hero (`/retiro`), CTA Final (`/retiro`) | *"Hola, me interesa asistir al retiro juvenil y me gustaría recibir más detalles sobre la próxima fecha."* |
| **`integracion`** | Integración al Movimiento | Bento Card 2 (`/`) | *"Hola, me interesa formar parte de la comunidad de Kairos Corazón Vicentino. ¿Cómo puedo integrarme a sus reuniones o actividades?"* |
| **`contacto`** | Dudas Generales | Bento Card 3 (`/`) / Tarjeta en `/contacto` | *"Hola, tengo una consulta sobre Kairos Corazón Vicentino y me gustaría que me ayudaran a resolverla."* |
| **`vocacional`** | Acompañamiento Vocacional | Bento Card 4 (`/`) / Tarjeta en `/contacto` | *"Hola, estoy pasando por un proceso de inquietud vocacional y me gustaría recibir acompañamiento del equipo de Kairos."* |
| **`padres`** | Atención a Padres de Familia | Bento Card 5 (`/`) / Tarjeta en `/contacto` | *"Hola, soy padre/madre de familia y me gustaría recibir información sobre las actividades y seguridad del retiro para mi hijo(a)."* |
| **`equipo`** | Contacto con Coordinadores | Página Sobre el Movimiento (`/movimiento`) | *"Hola, me gustaría ponerme en contacto con el equipo coordinador de Kairos Corazón Vicentino."* |
| **`apoyo_economico`**| Apoyo Económico / Becas | Tarjeta de Aportación (`$1,000 MXN`) en `/retiro` | *"Hola, quisiera consultar sobre las opciones de apoyos para asistir al retiro (sé que la parte económica no es un impedimento)."* |
| **`registro`** | Confirmación de Formulario | Envío de Formulario en `/registro` | *"Hola, acabo de realizar mi registro para el retiro juvenil a través de la página web.<br><br>Nombre: [Nombre]<br>WhatsApp: [Teléfono]<br>Edad: [Edad]"* |

---

## 🔗 Botones que Redirigen a Páginas Internas (Navegación / Registro Explícito)

Únicamente los siguientes botones realizan redirección interna entre páginas (no abren WhatsApp):

- **Header / Footer**: Enlaces de navegación a `/`, `/movimiento`, `/retiro`, `/contacto`.
- **Botón "Registrarse al retiro" / "Registrarme Ahora" / "¡Quiero Unirme!"**: Redirigen a `/registro`.
- **Hero (Inicio) - Botón Secundario**: `"Conocer el movimiento"` → Redirige a `/movimiento`.
