// Páginas activas del sitio. Las que no estén aquí no se pueden abrir (redirigen a la primera),
// y sus enlaces desaparecen del menú, del footer y de las tarjetas.
// Para volver a activar todo el sitio: export const ENABLED = null
export const ENABLED = ['/habitaciones', '/restaurante', '/hotel']

// Adonde lleva el logo y cualquier ruta desactivada
export const HOME = ENABLED ? ENABLED[0] : '/'

// ¿Este enlace lleva a una página activa? (anclas y enlaces externos siempre cuentan como activos)
export function isEnabled(href) {
  if (!ENABLED || !href || !href.startsWith('/')) return true
  const path = href.split('#')[0].split('?')[0]
  return ENABLED.some((p) => path === p || path.startsWith(p + '/'))
}

// Filtra una lista de enlaces ({ href, ... }) dejando solo los de páginas activas
export const onlyEnabled = (links) => links.filter((l) => isEnabled(l.href))
