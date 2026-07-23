/**
 * Kairos — receptor de registros para Google Sheets.
 *
 * INSTRUCCIONES DE INSTALACIÓN:
 * 1. Abre tu hoja en Google Sheets.
 * 2. Ve a Extensiones > Apps Script.
 * 3. Reemplaza el contenido por este archivo.
 * 4. Cambia SHEET_NAME si tu pestaña tiene otro nombre.
 * 5. Haz clic en "Implementar" > "Nueva implementación".
 * 6. Selecciona "Aplicación web", Ejecutar como: "Tú", Acceso: "Cualquiera".
 * 7. Copia la URL generada (termina en /exec) y colócala en la variable de entorno PUBLIC_GOOGLE_SHEETS_ENDPOINT.
 */
 
const SHEET_NAME = 'Registros';

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || '{}');
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    if (!sheet) throw new Error(`No existe la pestaña "${SHEET_NAME}" en la hoja de cálculo.`);

    // Si la hoja está vacía, crea los encabezados correspondientes al formulario de registro
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Fecha de Registro',
        'Nombre completo',
        'WhatsApp',
        'Edad',
        'Dirección',
        'Enfermedades',
        'Medicamentos',
        'Alergias',
        'Contacto 1 - Nombre',
        'Contacto 1 - Teléfono',
        'Contacto 1 - Parentesco',
        'Contacto 2 - Nombre (Opcional)',
        'Contacto 2 - Teléfono (Opcional)',
        'Contacto 2 - Parentesco (Opcional)',
        'Origen'
      ]);
    }

    // Insertar la fila de datos recibidos desde el formulario web
    sheet.appendRow([
      payload.fecha ? new Date(payload.fecha) : new Date(),
      payload.nombre || '',
      payload.whatsapp || '',
      payload.edad || '',
      payload.direccion || '',
      payload.enfermedad || '',
      payload.medicamento || '',
      payload.alergias || '',
      payload.contactoEmergenciaNombre1 || payload.contactoEmergencia || '',
      payload.contactoEmergenciaTelefono1 || '',
      payload.contactoEmergenciaParentesco1 || '',
      payload.contactoEmergenciaNombre2 || '',
      payload.contactoEmergenciaTelefono2 || '',
      payload.contactoEmergenciaParentesco2 || '',
      payload.origen || 'registro'
    ]);

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) });
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
