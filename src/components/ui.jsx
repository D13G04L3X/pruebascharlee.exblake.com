import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HOME, isEnabled } from '../site'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import imagenes from '../imagenes.json' // índice de versiones optimizadas (lo genera "npm run imagenes")

export const EASE = [0.16, 1, 0.3, 1] // expo.out
export const INOUT = [0.65, 0, 0.35, 1] // power3.inOut

/* Curvas para animaciones ligadas al scroll */
export const ez = {
  p2i: (t) => t * t,
  p2io: (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2),
  p3io: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
  p3o: (t) => 1 - (1 - t) ** 3,
  expoOut: (t) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t)),
}
export const clamp01 = (t) => Math.min(1, Math.max(0, t))
export const lerp = (a, b, t) => a + (b - a) * t
/* Progreso 0→1 de un tramo que empieza en `start` y dura `dur` */
export const seg = (t, start, dur, ease = (x) => x) => ease(clamp01((t - start) / dur))
export const pad = (n) => String(n).padStart(2, '0')

/* Degradado que funde el color de la sección sobre la anterior */
export const WASH_MASK =
  'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 15%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.9) 42%, #000 50%)'

export function useIsDesktop() {
  const [desktop, setDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const on = () => setDesktop(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return desktop
}

const TONES = [
  ['#cfc4b0', '#a89a82'],
  ['#b9b3a3', '#7f7a6c'],
  ['#d8cbb6', '#b08c6c'],
  ['#9a9486', '#4c4a42'],
  ['#c7b8a0', '#8a6f55'],
  ['#5a564d', '#24231f'],
]

/* Versiones optimizadas de una foto de /public/images (las genera scripts/optimizar-imagenes.mjs):
   devuelve los srcset AVIF y WebP, o null si la foto no tiene versiones (se usa el original). */
export function responsive(src) {
  const m = imagenes[src]
  if (!m) return null
  const base = src.replace(/^\/images\//, '/_img/').replace(/\.[^.]+$/, '')
  const set = (fmt) => m.anchos.map((w) => `${base}-${w}.${fmt} ${w}w`).join(', ')
  return { avif: set('avif'), webp: set('webp'), w: m.w, h: m.h }
}

/* Foto optimizada: AVIF → WebP → original, en el ancho que necesita la pantalla.
   `sizes` dice qué tan ancha se ve la foto (por defecto, todo el ancho de la pantalla). */
export function Picture({ src, alt = '', sizes = '100vw', className = '', ...rest }) {
  const r = responsive(src)
  if (!r) return <img src={src} alt={alt} className={className} {...rest} />
  return (
    <picture>
      <source type="image/avif" srcSet={r.avif} sizes={sizes} />
      <source type="image/webp" srcSet={r.webp} sizes={sizes} />
      <img src={src} alt={alt} width={r.w} height={r.h} className={className} {...rest} />
    </picture>
  )
}

/* Imagen con placeholder: si el archivo aún no existe en /public/images,
   muestra un bloque tonal con la ruta que hay que reemplazar. */
export function Img({ src, alt = '', className = '', dark = false, eager = false, sizes = '100vw' }) {
  const [failed, setFailed] = useState(false)
  const hash = [...src].reduce((a, c) => a + c.charCodeAt(0), 0)
  const [from, to] = dark ? TONES[5] : TONES[hash % 5]
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {failed ? (
        <div
          role="img"
          aria-label={alt}
          className="grain absolute inset-0 flex items-end p-4"
          style={{ background: `linear-gradient(155deg, ${from}, ${to})` }}
        >
          <span className="label text-white/70">public{src}</span>
        </div>
      ) : (
        <Picture
          src={src}
          alt={alt}
          sizes={sizes}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  )
}

/* Máscara para textos que suben desde abajo */
export function Mask({ children, className = '' }) {
  return (
    <span className={`-mb-[0.18em] -mt-[0.05em] block overflow-hidden pb-[0.18em] pt-[0.05em] ${className}`}>
      {children}
    </span>
  )
}

/* Pieza de texto dentro de una máscara. `state`: -1 abajo (oculta), 0 visible, 1 arriba (salió). */
export function Piece({ state, delay = 0, as = 'span', className = '', children }) {
  const Tag = motion[as]
  return (
    <Mask>
      <Tag
        className={`block will-change-transform ${className}`}
        initial={false}
        animate={{ y: state === 0 ? '0%' : state < 0 ? '110%' : '-110%', opacity: state === 0 ? 1 : 0 }}
        transition={
          state === 0
            ? { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }
            : { duration: 0.35, ease: [0.55, 0, 1, 0.45] }
        }
      >
        {children}
      </Tag>
    </Mask>
  )
}

/* Titular que sube línea por línea. `show` controla la animación. */
export function Lines({ lines, className = '', delay = 0, show = true, as: Tag = 'h2' }) {
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <Mask key={i}>
          <motion.span
            className="block will-change-transform"
            initial={{ y: '110%' }}
            animate={{ y: show ? '0%' : '110%' }}
            transition={{ duration: 1.1, ease: EASE, delay: delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </Mask>
      ))}
    </Tag>
  )
}

/* Texto que rueda hacia arriba en hover (el padre necesita la clase `group`). */
export function Roll({ children, className = '' }) {
  return (
    <span className={`relative inline-block overflow-hidden align-top ${className}`}>
      <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0"
      >
        {children}
      </span>
    </span>
  )
}

const PUFFS = [
  [-6, 42, 30, 72],
  [12, 22, 26, 80],
  [30, 38, 24, 72],
  [45, 12, 28, 92],
  [64, 34, 25, 76],
  [80, 20, 28, 86],
  [-4, 62, 108, 60],
]

/* Banco de nubes del color indicado; `style` acepta motion values. */
export function Cloud({ color, className = '', style }) {
  return (
    <motion.div aria-hidden className={`cloud ${className}`} style={{ ...style, color }}>
      {PUFFS.map(([l, t, w, h], i) => (
        <i key={i} style={{ left: `${l}%`, top: `${t}%`, width: `${w}%`, height: `${h}%` }} />
      ))}
    </motion.div>
  )
}

export function Chevron({ dir = 1 }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={dir > 0 ? 'M9 6l6 6-6 6' : 'M15 6l-6 6 6 6'} />
    </svg>
  )
}

// Anclas que existen en todas las páginas
const EVERYWHERE = ['#top', '#contacto']

/* Enlace del sitio: rutas internas con el router; las anclas (#hotel…) llevan
   a la página de inicio cuando se está en otra página. */
export function SiteLink({ href, children, onClick, ...rest }) {
  const { pathname } = useLocation()
  // Ruta de una página desactivada (p. ej. el inicio): lleva a la página principal activa
  if (href.startsWith('/')) return <Link to={isEnabled(href) ? href : HOME} onClick={onClick} {...rest}>{children}</Link>
  // Ancla de otra página (las del inicio): solo si esa ancla no existe aquí y el inicio está activo
  if (href.startsWith('#') && pathname !== '/' && !EVERYWHERE.includes(href) && isEnabled('/')) {
    return (
      <Link
        to={`/${href}`}
        onClick={(e) => {
          if (document.querySelector(href)) {
            e.preventDefault()
            document.querySelector(href).scrollIntoView()
          }
          onClick?.(e)
        }}
        {...rest}
      >
        {children}
      </Link>
    )
  }
  return <a href={href} onClick={onClick} {...rest}>{children}</a>
}

/* Aparece subiendo al entrar en pantalla */
export function FadeUp({ children, className = '', delay = 0, as = 'div' }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </Tag>
  )
}

/* Botón magnético: sigue al cursor unos píxeles. */
export function Magnetic({ children, className = '', strength = 0.35 }) {
  const ref = useRef(null)
  const x = useSpring(useMotionValue(0), { stiffness: 180, damping: 14 })
  const y = useSpring(useMotionValue(0), { stiffness: 180, damping: 14 })
  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const leave = () => {
    x.set(0)
    y.set(0)
  }
  return (
    <motion.div ref={ref} onMouseMove={move} onMouseLeave={leave} style={{ x, y }} className={`inline-block ${className}`}>
      {children}
    </motion.div>
  )
}

/* Nubes + velo que funden el color de una sección sobre la anterior.
   `t` es una línea de tiempo 0 → 1.56 (motion value). */
export function Veil({ t, color }) {
  const a = {
    y: useTransform(t, (v) => `${lerp(20, -20, seg(v, 0, 0.5))}%`),
    opacity: useTransform(t, (v) => seg(v, 0, 0.5)),
  }
  const b = {
    y: useTransform(t, (v) => `${lerp(10, -30, seg(v, 0, 0.3))}%`),
    opacity: useTransform(t, (v) => seg(v, 0, 0.3)),
  }
  const wash = useTransform(t, (v) => seg(v, 0.5, 0.3))
  return (
    <>
      <div aria-hidden className="pointer-events-none absolute left-0 top-[-42vh] z-30 h-[112vh] w-full md:top-[-52vh]">
        <Cloud color={color} style={a} className="top-[25%] lg:top-0" />
        <Cloud color={color} style={b} className="top-[20%] lg:top-[8%]" />
      </div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[-40vh] z-[35]"
        style={{ backgroundColor: color, opacity: wash, WebkitMaskImage: WASH_MASK, maskImage: WASH_MASK }}
      />
    </>
  )
}

export function Close() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}
