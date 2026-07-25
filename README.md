# Chúpate el Dedo — sitio web con panel admin conectado a GitHub

Este proyecto está listo para desplegarse en Vercel. El panel admin guarda los
cambios de menú directamente en este repositorio de GitHub, usando una función
que corre en el servidor (nunca en el navegador del visitante).

## ⚠️ Importante sobre el token de GitHub

**Nunca pongas tu token de GitHub en el código ni lo compartas por chat.**
Va en las variables de entorno de Vercel, un lugar hecho para guardar secretos
que ningún visitante de la página puede ver, ni siquiera revisando el código
fuente.

## Paso 1 — Sube este proyecto a un repositorio de GitHub

1. Crea un repositorio nuevo en GitHub (puede ser privado).
2. Sube todos estos archivos (`index.html`, la carpeta `api/`, la carpeta
   `data/`, `package.json`).

## Paso 2 — Crea un token de GitHub (Personal Access Token)

1. Ve a GitHub → foto de perfil → **Settings** → **Developer settings** →
   **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
2. En "Repository access", elige **Only select repositories** y selecciona
   únicamente el repositorio de este proyecto (no le des acceso a todos tus
   repos).
3. En "Permissions", dale acceso de **Contents: Read and write** (eso es todo
   lo que necesita).
4. Genera el token y **cópialo una sola vez** (GitHub no te lo vuelve a
   mostrar).

## Paso 3 — Importa el proyecto en Vercel

1. Entra a [vercel.com](https://vercel.com) → **Add New Project** → conecta
   tu cuenta de GitHub → selecciona este repositorio.
2. No hace falta cambiar nada en la configuración de build (no usa framework).

## Paso 4 — Configura las variables de entorno en Vercel

Antes o justo después del primer deploy, ve a **Project → Settings →
Environment Variables** y agrega:

| Variable | Valor |
|---|---|
| `GITHUB_TOKEN` | El token que generaste en el Paso 2 |
| `GITHUB_OWNER` | Tu usuario de GitHub (ej: `juanperez`) |
| `GITHUB_REPO` | El nombre del repositorio (ej: `chupate-el-dedo`) |
| `GITHUB_BRANCH` | `main` (o el nombre de tu rama principal) |
| `ADMIN_PASSWORD` | La contraseña que quieras usar para entrar al modo admin |

Guarda y vuelve a desplegar el proyecto (Vercel lo pide automáticamente
después de agregar variables nuevas).

## Paso 5 — Prueba

1. Abre tu URL de Vercel.
2. Haz clic 3 veces seguidas en el logo del encabezado.
3. Escribe la contraseña que pusiste en `ADMIN_PASSWORD`.
4. Agrega o edita un plato — deberías ver el mensaje "Guardado en GitHub" y,
   a los 30-60 segundos, el cambio aparece para cualquiera que visite el
   sitio (revisa que Vercel esté conectado a auto-deploy, que es lo normal
   por defecto).

## Para cambiar la contraseña de admin más adelante

Solo edita el valor de `ADMIN_PASSWORD` en Vercel → Settings → Environment
Variables y vuelve a desplegar. No hay que tocar código.

## Estructura del proyecto

```
index.html              → el sitio completo (menú, carrito, pedido por WhatsApp, panel admin)
data/menu.json          → el menú actual (esto es lo que el panel admin actualiza)
api/verify-password.js  → función que valida la contraseña del admin sin exponerla
api/save-menu.js        → función que guarda el nuevo menú en GitHub usando el token
package.json            → configuración mínima del proyecto
```
