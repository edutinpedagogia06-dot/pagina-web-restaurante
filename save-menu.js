// Esta función corre en el servidor de Vercel. Puede recibir el token de
// GitHub de dos formas:
//   1. Enviado por la dueña desde el panel admin en el momento de guardar
//      (campo "Token de GitHub" — no se guarda en ningún lado, solo viaja
//      en esta petición y se usa una sola vez).
//   2. Si no se envía ninguno, se usa el guardado en la variable de entorno
//      GITHUB_TOKEN de Vercel, como respaldo.
//
// Flujo: recibe la contraseña de admin + el menú actualizado (+ token
// opcional) -> valida la contraseña -> lee el sha actual de data/menu.json
// en GitHub -> sube la nueva versión con la GitHub Contents API -> Vercel
// detecta el nuevo commit y vuelve a publicar el sitio automáticamente
// (30-60 seg aprox).

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  const { password, menu, githubToken } = req.body || {};
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const GITHUB_TOKEN = githubToken || process.env.GITHUB_TOKEN;
  const GITHUB_OWNER = process.env.GITHUB_OWNER;
  const GITHUB_REPO = process.env.GITHUB_REPO;
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
  const FILE_PATH = 'data/menu.json';

  if (!ADMIN_PASSWORD || !GITHUB_OWNER || !GITHUB_REPO) {
    res.status(500).json({ error: 'Faltan variables de entorno en Vercel (ADMIN_PASSWORD, GITHUB_OWNER, GITHUB_REPO).' });
    return;
  }

  if (!GITHUB_TOKEN) {
    res.status(400).json({ error: 'No se recibió ningún token de GitHub (ni en el panel, ni de respaldo en Vercel).' });
    return;
  }

  if (password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Contraseña incorrecta.' });
    return;
  }

  if (!Array.isArray(menu)) {
    res.status(400).json({ error: 'El menú enviado no tiene un formato válido.' });
    return;
  }

  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`;
  const ghHeaders = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'chupate-el-dedo-admin'
  };

  try {
    const getResp = await fetch(`${apiUrl}?ref=${GITHUB_BRANCH}`, { headers: ghHeaders });
    if (!getResp.ok) {
      const errText = await getResp.text();
      throw new Error(`No se pudo leer el archivo actual en GitHub: ${errText}`);
    }
    const fileData = await getResp.json();
    const sha = fileData.sha;

    const content = Buffer.from(JSON.stringify(menu, null, 2), 'utf-8').toString('base64');
    const putResp = await fetch(apiUrl, {
      method: 'PUT',
      headers: { ...ghHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Actualizar menú desde el panel admin',
        content,
        sha,
        branch: GITHUB_BRANCH
      })
    });

    if (!putResp.ok) {
      const errData = await putResp.json();
      throw new Error(errData.message || 'Error al guardar en GitHub.');
    }

    res.status(200).json({ ok: true, message: 'Guardado. El sitio se actualizará en unos segundos.' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error inesperado al guardar.' });
  }
};
