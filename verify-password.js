// Esta función corre en el servidor de Vercel, nunca en el navegador del visitante.
// Compara la contraseña ingresada contra la variable de entorno ADMIN_PASSWORD
// (configurada en Vercel > Settings > Environment Variables), así el valor real
// nunca queda visible en el código que ve el navegador.

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  const { password } = req.body || {};
  // Contraseña por defecto puesta directamente en el código (no depende de Vercel).
  // Si más adelante configuras ADMIN_PASSWORD en Vercel, esa tiene prioridad.
  const HARDCODED_PASSWORD = 'campestre2024';
  const realPassword = process.env.ADMIN_PASSWORD || HARDCODED_PASSWORD;
  if (password === realPassword) {
    res.status(200).json({ ok: true });
  } else {
    res.status(401).json({ ok: false, error: 'Contraseña incorrecta.' });
  }
};
