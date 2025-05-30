const express = require('express');
const app = express();
const port = 3000;
const Resend = require('resend').Resend;
const resend = new Resend('re_RKrBQgY4_ChCVZkUPHZ6oVuAsazo3Qy3q');
const bodyParser = require('body-parser');
const sanitizeHtml = require('sanitize-html');

// Servir archivos estáticos desde el directorio actual
app.use(express.static('./'));

app.use(bodyParser.json());

const rateLimit = {};

function sanitize(str) {
  return String(str)
    .replace(/[<>]/g, '')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isValidName(nombre) {
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,}$/.test(nombre);
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidMessage(msg) {
  return typeof msg === 'string' && msg.trim().length >= 10 && msg.length <= 1000;
}

app.post('/enviar-email', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  rateLimit[ip] = rateLimit[ip] || { count: 0, last: Date.now() };
  if (Date.now() - rateLimit[ip].last > 60 * 1000) {
    rateLimit[ip] = { count: 0, last: Date.now() };
  }
  rateLimit[ip].count++;
  if (rateLimit[ip].count > 5) {
    return res.status(429).json({ success: false, error: 'Demasiados envíos. Intenta más tarde.' });
  }

  const { to, subject, html } = req.body;

  // Extraer datos del HTML para validar y sanitizar
  const nombreMatch = html.match(/<td[^>]*>Nombre:<\/td>\s*<td[^>]*>(.*?)<\/td>/);
  const emailMatch = html.match(/<td[^>]*>Email:<\/td>\s*<td[^>]*>(.*?)<\/td>/);
  const mensajeMatch = html.match(/<td[^>]*>Mensaje:<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/);
  const nombre = nombreMatch ? sanitize(nombreMatch[1]) : '';
  const correo = emailMatch ? sanitize(emailMatch[1]) : '';
  const mensaje = mensajeMatch ? sanitizeHtml(mensajeMatch[1], { allowedTags: [], allowedAttributes: {} }).slice(0, 1000) : '';

  if (!isValidName(nombre)) {
    return res.status(400).json({ success: false, error: 'Nombre inválido.' });
  }
  if (!isValidEmail(correo)) {
    return res.status(400).json({ success: false, error: 'Correo electrónico inválido.' });
  }
  if (!isValidMessage(mensaje)) {
    return res.status(400).json({ success: false, error: 'El mensaje debe tener al menos 10 caracteres y no más de 1000.' });
  }

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      html
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
}); 