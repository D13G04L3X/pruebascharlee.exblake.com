import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { booking, brand, footer, nav as allNav } from '../content'
import { onlyEnabled } from '../site'
import { EASE, INOUT, Img, Roll, SiteLink, pad } from './ui'

// Enlaces del menú: solo páginas activas (src/site.js)
const nav = onlyEnabled(allNav)

const layer = (openDelay, closeDelay) => ({
  closed: { x: '-100%', transition: { duration: 0.75, ease: INOUT, delay: closeDelay } },
  open: { x: '0%', transition: { duration: 0.85, ease: INOUT, delay: openDelay } },
})
const rise = {
  closed: { y: '115%', transition: { duration: 0.35, ease: [0.55, 0, 1, 0.45] } },
  open: (i) => ({ y: '0%', transition: { duration: 0.9, ease: EASE, delay: 0.5 + i * 0.07 } }),
}
const fade = {
  closed: { opacity: 0, y: 16, transition: { duration: 0.25 } },
  open: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: 0.9 + i * 0.08 } }),
}

/* Menú a pantalla completa: entra desde la izquierda en dos capas (beige y
   tinta), con los enlaces subiendo uno a uno y una foto por cada enlace. */
function Menu({ onClose }) {
  const [hover, setHover] = useState(null)
  const shown = hover ?? 0

  return (
    <motion.div id="site-menu" className="fixed inset-0 z-[45]" initial="closed" animate="open" exit="closed">
      <motion.div className="absolute inset-0 bg-bone" variants={layer(0, 0.12)} />
      <motion.div className="absolute inset-0 overflow-hidden bg-ink text-bone" variants={layer(0.12, 0)}>
        <div className="grid h-full lg:grid-cols-[1.05fr_1fr]">
          <div className="flex h-full flex-col justify-between overflow-y-auto px-6 pb-7 pt-24 md:px-10 lg:pt-28">
            <ul onMouseLeave={() => setHover(null)}>
              {nav.map((l, i) => (
                <li key={l.label} className="overflow-hidden border-b border-bone/15">
                  <motion.div variants={rise} custom={i}>
                    <SiteLink
                      href={l.href}
                      onClick={onClose}
                      onMouseEnter={() => setHover(i)}
                      onFocus={() => setHover(i)}
                      className="group flex items-baseline gap-4 py-[1.1vh] transition-opacity duration-500 lg:gap-6"
                      style={{ opacity: hover === null || hover === i ? 1 : 0.3 }}
                    >
                      <span className="w-6 text-[10px] tabular-nums tracking-[0.16em] text-bone/50 lg:text-xs">{pad(i + 1)}</span>
                      <Roll className="font-display text-[clamp(1.7rem,min(9vw,5.2svh),3.5rem)] leading-[1.08] tracking-[-0.05em] lg:text-[min(4.6vw,7svh)]">
                        {l.label}
                      </Roll>
                      <span className="ml-auto -translate-x-3 self-center text-xl opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-x-0 group-hover:opacity-100 lg:text-3xl">
                        →
                      </span>
                    </SiteLink>
                  </motion.div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <motion.div variants={fade} custom={0} className="text-[11px] uppercase leading-[1.7] tracking-[0.16em] text-bone/60">
                <p>{footer.address}</p>
                <p className="mt-2 flex flex-wrap gap-x-5">
                  {footer.follow.map((f) => (
                    <a key={f.label} href={f.href} className="text-bone transition-opacity hover:opacity-60">
                      {f.label}
                    </a>
                  ))}
                </p>
              </motion.div>
              <motion.div variants={fade} custom={1}>
                <SiteLink
                  href={booking.href}
                  onClick={onClose}
                  className="group inline-block rounded-full bg-terracotta px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-bone transition-colors hover:bg-terracotta-dark"
                >
                  <Roll>{booking.label} →</Roll>
                </SiteLink>
              </motion.div>
            </div>
          </div>

          {/* Foto del enlace señalado */}
          <motion.div variants={fade} custom={-3} className="relative hidden p-8 pl-0 pt-24 lg:block">
            <div className="relative h-full w-full overflow-hidden rounded-[36px] bg-bone/5">
              <AnimatePresence initial={false}>
                <motion.div
                  key={shown}
                  className="absolute inset-0"
                  style={{ zIndex: 2 }}
                  initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
                  animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                  exit={{ zIndex: 1, opacity: 0.99, transition: { duration: 0.9 } }}
                  transition={{ duration: 0.9, ease: INOUT }}
                >
                  <motion.div
                    className="h-full w-full"
                    initial={{ scale: 1.25 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.4, ease: EASE }}
                  >
                    <Img src={nav[shown].image} alt="" eager sizes="50vw" className="h-full w-full" />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-8 text-[11px] uppercase tracking-[0.18em] text-white">
                <span>{nav[shown].label}</span>
                <span className="tabular-nums">
                  {pad(shown + 1)} <span className="opacity-50">/ {pad(nav.length)}</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Nav({ ready }) {
  const [open, setOpen] = useState(false)
  const { pathname, hash, key } = useLocation()

  // Se cierra al navegar
  useEffect(() => setOpen(false), [pathname, hash, key])

  // Transparente sobre la primera sección de la página; sólido en cuanto se deja atrás.
  // Depende solo de la posición (no de la dirección del scroll), así no titila.
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    let frame = 0
    const check = () => {
      frame = 0
      const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64
      // La portada suele ser sticky y su offsetTop cambia mientras está pegada, así que
      // se mide dónde empieza la siguiente sección que no es sticky.
      let next = document.querySelector('main')?.firstElementChild?.nextElementSibling
      while (next && getComputedStyle(next).position === 'sticky') next = next.nextElementSibling
      const end = next ? next.offsetTop - navH : window.innerHeight - navH
      setSolid(window.scrollY >= end)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check)
    }
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [pathname])

  const look = open ? 'open' : solid ? 'solid' : 'clear'

  // Abierto: sin scroll de fondo y Escape para cerrar
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    window.lenis?.stop?.()
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      window.lenis?.start?.()
      document.documentElement.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <AnimatePresence>{open && <Menu key="menu" onClose={() => setOpen(false)} />}</AnimatePresence>

      <motion.nav
        className={`fixed left-0 top-0 z-50 flex h-(--nav-h) w-full items-center px-6 transition-[background-color,color,box-shadow] duration-500 md:px-10 ${
          look === 'solid'
            ? 'bg-bone text-ink shadow-[0_1px_0_rgba(69,70,60,0.12)]'
            : look === 'open'
              ? 'bg-transparent text-bone'
              : 'pointer-events-none bg-transparent text-white mix-blend-difference'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Arriba: transparente con mix-blend-difference (se ve sobre fondos claros y oscuros).
            Pasada la primera sección: barra sólida; las secciones fijas empiezan debajo (--nav-h). */}
        <div className="flex w-full items-center justify-between">
          <SiteLink href="/" className="pointer-events-auto block leading-none" aria-label="The Charlee, inicio">
            <img
              src="/images/logos/charlee-header.svg"
              alt={brand}
              className={`block h-5 w-auto brightness-0 md:h-6 ${look === 'solid' ? '' : 'invert'}`}
            />
          </SiteLink>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((o) => !o)}
            className="group pointer-events-auto flex cursor-pointer items-center gap-2 text-base font-bold leading-none tracking-tight"
          >
            <span className="relative block overflow-hidden text-right">
              <span className={`block transition-transform duration-500 ease-out-expo ${open ? '-translate-y-full' : ''}`}>MENÚ</span>
              <span
                aria-hidden={!open}
                className={`absolute right-0 top-0 transition-transform duration-500 ease-out-expo ${open ? '' : 'translate-y-full'}`}
              >
                CERRAR
              </span>
              <span aria-hidden className="invisible block h-0">CERRAR</span>
            </span>
            <span
              aria-hidden
              className="grid grid-cols-2 transition-[gap,transform] duration-500 ease-out-expo"
              style={{ gap: open ? 5 : 2, transform: open ? 'rotate(45deg)' : 'none' }}
            >
              {[0, 1, 2, 3].map((i) => (
                <i key={i} className="block h-[3px] w-[3px] rounded-full bg-current" />
              ))}
            </span>
          </button>
        </div>
      </motion.nav>
    </>
  )
}
