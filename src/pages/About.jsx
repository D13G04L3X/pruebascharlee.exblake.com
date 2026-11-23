import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { aboutPage, brand } from '../content'
import { onlyEnabled } from '../site'
import BookBar from '../components/BookBar'
import Footer from '../components/Footer'
import Lightbox from '../components/Lightbox'
import { Band, Heading, Statement, Stats } from '../components/blocks'
import { Chevron, EASE, FadeUp, Img, Roll, SiteLink, clamp01, ez, pad, useIsDesktop } from '../components/ui'

/* La página del hotel usa a propósito una arquitectura distinta a la de Habitaciones
   (allí hay portada a pantalla completa, carrusel horizontal y tarjeta oscura de reserva).
   Aquí: portada tipográfica donde la foto se abre desde el título, mosaico de formas (arco,
   círculo, óvalo) y póster salvia, tomados del manual de marca. */

/* ───────────── 1 · Portada: la foto se abre desde el título ───────────── */
/* "El [foto] hotel." en una sola línea: la foto empieza como una cápsula entre las dos
   palabras y, al hacer scroll, las aparta y crece hasta llenar la pantalla.
   Todo el bloque (etiqueta, título, frase, botones y datos) va centrado en el espacio bajo
   el header; la foto parte del hueco real entre las palabras (medido) y termina centrada.
   La sección queda fija mientras la foto crece. */
function HotelHero({ ready, image, eyebrow, title, ctas, meta, tagline }) {
  const ref = useRef(null)
  const gap = useRef(null)
  const desktop = useIsDesktop()
  const [left, ...rest] = title[0].split(' ')
  const right = rest.join(' ')

  // Tamaño inicial de la cápsula (en vw)
  const PW = desktop ? 16 : 25
  const PH = desktop ? 9 : 14.5

  // Distancia del hueco al centro de la pantalla (la cápsula arranca ahí)
  const [off, setOff] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const measure = () => {
      const el = gap.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const top = ref.current.getBoundingClientRect().top
      setOff({ x: r.left + r.width / 2 - window.innerWidth / 2, y: r.top - top + r.height / 2 - window.innerHeight / 2 })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(gap.current)
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [desktop])

  // Progreso calculado directo del scroll: 0 arriba, 1 al soltarse la sección
  const { scrollY } = useScroll()
  const p = useTransform(scrollY, (y) => {
    const el = ref.current
    return el ? clamp01((y - el.offsetTop) / Math.max(1, el.offsetHeight - window.innerHeight)) : 0
  })
  const e = useTransform(p, (v) => ez.p2io(clamp01((v - 0.04) / 0.72)))
  const width = useTransform(e, (v) => `${PW + (100 - PW) * v}vw`)
  const height = useTransform(e, (v) => `calc(${PH * (1 - v)}vw + ${100 * v}svh)`)
  const radius = useTransform(e, (v) => `calc(${((1 - v) * PH) / 2}vw)`)
  const cx = useTransform(e, (v) => `calc(50% + ${(1 - v) * off.x}px)`)
  const cy = useTransform(e, (v) => `calc(50% + ${(1 - v) * off.y}px)`)
  const photoZoom = useTransform(e, [0, 1], [1.35, 1])
  const leftX = useTransform(e, (v) => `${-45 * v}vw`)
  const rightX = useTransform(e, (v) => `${45 * v}vw`)
  const wordsOpacity = useTransform(e, [0.2, 0.6], [1, 0])
  const uiOpacity = useTransform(p, (v) => 1 - clamp01(v / 0.1))
  const uiEvents = useTransform(uiOpacity, (o) => (o < 0.15 ? 'none' : 'auto'))
  const endOpacity = useTransform(e, [0.85, 1], [0, 1])

  const enter = (delay, from = 16) => ({
    initial: { opacity: 0, y: from },
    animate: { opacity: ready ? 1 : 0, y: ready ? 0 : from },
    transition: { duration: 1.1, ease: EASE, delay },
  })
  const word = 'block font-display leading-[0.95] text-sage-deep text-[16.5vw] lg:text-[min(11.5vw,22svh)]'

  return (
    <section ref={ref} className="relative z-20 h-[260svh] bg-bone text-ink">
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* Foto: cápsula (en el hueco del título) → pantalla completa (centrada) */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute z-10 overflow-hidden bg-ink"
          style={{ left: cx, top: cy, x: '-50%', y: '-50%', width, height, borderRadius: radius }}
          initial={{ scale: 0 }}
          animate={{ scale: ready ? 1 : 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.35 }}
        >
          <motion.div className="h-full w-full" style={{ scale: photoZoom }}>
            <Img src={image} alt="" eager sizes="100vw" className="h-full w-full" />
          </motion.div>
          <motion.div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/30" style={{ opacity: endOpacity }} />
        </motion.div>

        {/* Bloque centrado en el espacio bajo el header */}
        <div className="absolute inset-x-0 bottom-0 top-(--nav-h) z-20 flex flex-col items-center justify-center px-6 pb-6 text-center md:px-10">
          <motion.p className="label tracking-[0.24em] text-ink/70 lg:text-xs" style={{ opacity: uiOpacity }}>
            <motion.span className="inline-block" {...enter(0.15)}>
              {eyebrow} · {brand}
            </motion.span>
          </motion.p>

          <h1 className="my-[min(5svh,3rem)] flex items-center justify-center lg:my-[min(6svh,3.5rem)]">
            <motion.span className="overflow-hidden" style={{ x: leftX, opacity: wordsOpacity }}>
              <motion.span className={word} {...enter(0.1, 90)}>
                {left}
              </motion.span>
            </motion.span>
            <span ref={gap} aria-hidden className="mx-[2vw] shrink-0 lg:mx-[1.5vw]" style={{ width: `${PW}vw`, height: `${PH}vw` }} />
            <motion.span className="overflow-hidden" style={{ x: rightX, opacity: wordsOpacity }}>
              <motion.span className={word} {...enter(0.2, 90)}>
                {right}
              </motion.span>
            </motion.span>
          </h1>

          <motion.div className="flex flex-col items-center" style={{ opacity: uiOpacity, pointerEvents: uiEvents }}>
            <motion.p className="max-w-md text-base leading-[1.4] tracking-[-0.01em] lg:text-lg" {...enter(0.5)}>
              {tagline.join(' ')}
            </motion.p>
            <motion.div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 lg:mt-6 lg:gap-3" {...enter(0.6)}>
              {/* Principal: terracota con halo que late, como el de Reservar en las habitaciones */}
              <a
                href={ctas[0].href}
                className="group inline-flex items-center gap-3 rounded-full bg-terracotta py-1.5 pl-5 pr-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-bone shadow-[0_12px_32px_rgba(0,0,0,0.25)] transition-[background-color,transform] duration-300 motion-safe:animate-halo hover:scale-[1.03] hover:bg-terracotta-dark lg:py-2 lg:pl-6 lg:pr-2 lg:text-[12px]"
              >
                <Roll>{ctas[0].label}</Roll>
                <span className="flex h-8 w-8 rotate-90 items-center justify-center rounded-full bg-bone text-terracotta transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 lg:h-9 lg:w-9">
                  <Chevron dir={1} />
                </span>
              </a>
              <SiteLink
                href={ctas[1].href}
                className="group inline-flex items-center gap-3 rounded-full border border-ink/25 py-1.5 pl-5 pr-1.5 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors hover:border-ink hover:bg-ink hover:text-bone lg:py-2 lg:pl-6 lg:pr-2 lg:text-[12px]"
              >
                <Roll>{ctas[1].label}</Roll>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-current/30 transition-transform duration-500 ease-out-expo group-hover:translate-x-1 lg:h-9 lg:w-9">
                  <Chevron dir={1} />
                </span>
              </SiteLink>
            </motion.div>
            <motion.ul className="mt-6 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.18em] text-ink/60 lg:text-[11px]" {...enter(0.75)}>
              {meta.map((m, i) => (
                <li key={m} className="flex items-center gap-3">
                  {i > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-sage" />}
                  {m}
                </li>
              ))}
            </motion.ul>
          </motion.div>
        </div>

        {/* Al final, sobre la foto abierta */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-6 px-6 pb-8 text-[11px] uppercase tracking-[0.18em] text-bone md:px-10"
          style={{ opacity: endOpacity }}
        >
          <span>{tagline.join(' ')}</span>
          <span className="hidden sm:inline">Desliza ↓</span>
        </motion.div>
      </div>
    </section>
  )
}

/* ───────────── 2 · Rincones: paneles que se expanden ───────────── */
/* Las fotos son franjas una al lado de la otra (apiladas en móvil). La activa se abre y
   muestra su nombre; las demás quedan angostas con el nombre en vertical.
   Escritorio: se activa al pasar el mouse (o con Tab) y un clic la amplía.
   Móvil: el primer toque la abre, el segundo la amplía. */
function Corners({ id, eyebrow, title, images }) {
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(null)
  // ¿Estaba abierto el panel justo al tocarlo? (el foco del toque lo activa antes del clic)
  const wasOpen = useRef(false)
  const n = images.length

  return (
    <Band id={id} className="px-6 pb-28 pt-24 md:px-10 lg:pb-40 lg:pt-36">
      <div className="mb-10 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
        <Heading eyebrow={`${eyebrow} — ${pad(n)}`} title={title} />
        <FadeUp as="p" className="max-w-xs text-sm leading-[1.5] text-ink/70 lg:text-base">
          Arte, materiales y luz natural en cada rincón. Recorre las fotos y toca una para verla en grande.
        </FadeUp>
      </div>

      <FadeUp>
        <div
          className="flex h-[calc(var(--ah)*82)] flex-col gap-2 lg:h-[calc(var(--ah)*78)] lg:flex-row lg:gap-3"
        >
          {images.map((im, i) => {
            const on = i === active
            return (
              <button
                key={im.src}
                type="button"
                aria-label={on ? `Ampliar: ${im.alt}` : `Ver ${im.alt}`}
                aria-expanded={on}
                onPointerDown={() => (wasOpen.current = on)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={(e) => {
                  // Teclado (detail 0) o panel ya abierto: amplía. Si no, solo lo abre.
                  if (e.detail === 0 || wasOpen.current) setOpen(i)
                  else setActive(i)
                }}
                className={`group relative min-h-0 min-w-0 cursor-pointer overflow-hidden rounded-[18px] bg-ink text-left text-bone transition-[flex-grow] duration-700 ease-out-expo md:rounded-[24px] ${
                  on ? 'grow-[7] cursor-zoom-in lg:grow-[6]' : 'grow'
                } basis-0`}
              >
                <Img
                  src={im.src}
                  alt={im.alt}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className={`h-full w-full transition-transform duration-[1.2s] ease-out-expo ${on ? 'scale-100' : 'scale-110'}`}
                />
                <span
                  className={`absolute inset-0 transition-colors duration-700 ${on ? 'bg-gradient-to-t from-black/60 via-black/5 to-transparent' : 'bg-black/45 group-hover:bg-black/35'}`}
                />

                {/* Cerrado: número y nombre (en vertical en escritorio) */}
                <span
                  className={`absolute inset-0 flex items-center gap-3 px-4 transition-opacity duration-500 lg:flex-col-reverse lg:items-center lg:justify-start lg:gap-4 lg:px-0 lg:py-6 ${
                    on ? 'opacity-0' : 'opacity-100 delay-200'
                  }`}
                >
                  <span className="text-[10px] tabular-nums tracking-[0.16em] text-bone/70">{pad(i + 1)}</span>
                  <span className="truncate text-[11px] uppercase tracking-[0.18em] lg:[writing-mode:vertical-rl] lg:rotate-180">{im.alt}</span>
                </span>

                {/* Abierto: nombre grande y botón para ampliar */}
                <span
                  className={`absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 transition-all duration-700 ease-out-expo md:p-7 ${
                    on ? 'translate-y-0 opacity-100 delay-200' : 'pointer-events-none translate-y-4 opacity-0'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block text-[10px] tabular-nums uppercase tracking-[0.18em] text-bone/70">
                      {pad(i + 1)} / {pad(n)}
                    </span>
                    <span className="mt-2 block truncate font-display text-[clamp(1.6rem,6vw,2.5rem)] leading-[1.05] lg:text-[2.6vw]">{im.alt}</span>
                  </span>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bone text-ink transition-transform duration-500 ease-out-expo group-hover:scale-110">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </FadeUp>

      <AnimatePresence>
        {open !== null && (
          <Lightbox images={images} index={open} onClose={() => setOpen(null)} onStep={(d) => setOpen((i) => (i + d + n) % n)} />
        )}
      </AnimatePresence>
    </Band>
  )
}

/* ───────────── Contenido oficial del hotel ───────────── */

/* Banner con foto (o video, si se agrega) y el nombre del hotel encima. */
function HotelBanner({ image, video, title, sub }) {
  const ref = useRef(null)
  const player = useRef(null)
  const [playing, setPlaying] = useState(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const toggle = () => {
    const v = player.current
    if (!v) return
    if (v.paused) v.play().catch(() => {})
    else v.pause()
  }
  return (
    <div className="px-3 pb-20 pt-16 md:px-5 lg:px-8 lg:pb-32 lg:pt-24">
      <div ref={ref} className="relative h-[calc(var(--ah)*70)] overflow-hidden rounded-[28px] bg-ink text-bone md:rounded-[36px] lg:h-[calc(var(--ah)*88)]">
        <motion.div className="absolute inset-0 h-[116%] -translate-y-[8%]" style={{ y }}>
          <Img src={image.src} alt={image.alt} className="h-full w-full" />
          {video && (
            <video
              ref={player}
              src={video}
              muted
              loop
              playsInline
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? 'opacity-100' : 'opacity-0'}`}
            />
          )}
        </motion.div>
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
          {video && (
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? 'Pausar video' : 'Reproducir video'}
              className="mb-2 flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border border-bone/70 transition-colors hover:bg-bone hover:text-ink md:h-24 md:w-24"
            >
              {playing ? (
                <svg width="16" height="16" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                  <path d="M2 1h3v10H2zM7 1h3v10H7z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                  <path d="M2 1l9 5-9 5z" />
                </svg>
              )}
            </button>
          )}
          <FadeUp as="h2" className="text-[clamp(2rem,8vw,4.5rem)] leading-[1] lg:text-[4.8vw]">
            {title}
          </FadeUp>
          <FadeUp as="p" delay={0.1} className="text-[12px] font-semibold uppercase tracking-[0.3em] md:text-sm">
            {sub}
          </FadeUp>
        </div>
      </div>
    </div>
  )
}

/* La historia: título y etiqueta a la izquierda, los tres párrafos a la derecha. */
function History({ title, eyebrow, paragraphs }) {
  return (
    <Band id="historia-hotel" className="px-6 pb-20 md:px-10 lg:pb-32">
      <div className="grid grid-cols-12 gap-x-6 gap-y-10 border-t border-ink/20 pt-12 lg:pt-16">
        <div className="col-span-12 lg:col-span-5">
          <span className="label tracking-[0.24em] lg:text-xs">{eyebrow}</span>
          <FadeUp as="h2" className="mt-5 max-w-[14ch] text-[clamp(2.1rem,9vw,3.75rem)] leading-[1] text-sage-deep lg:text-[4.4vw]">
            {title}
          </FadeUp>
        </div>
        <div className="col-span-12 flex flex-col gap-5 lg:col-span-6 lg:col-start-7 lg:pt-10">
          {paragraphs.map((t, i) => (
            <FadeUp key={i} as="p" delay={i * 0.06} className="text-[15px] leading-[1.6] tracking-[-0.01em] text-ink/85 lg:text-lg lg:leading-[1.55]">
              {t}
            </FadeUp>
          ))}
        </div>
      </div>
    </Band>
  )
}

/* La oferta: recuadro con el nombre y la frase, y las cuatro áreas debajo
   (título, línea corta y texto, como en el sitio actual). */
function Offer({ title, intro, items }) {
  return (
    <Band id="oferta" className="px-6 pb-24 md:px-10 lg:pb-36">
      <FadeUp className="mx-auto max-w-5xl rounded-[28px] border border-ink/25 px-6 py-10 text-center md:rounded-[36px] md:px-12 lg:py-14">
        <h2 className="text-[clamp(1.9rem,7vw,3.25rem)] leading-[1.05] lg:text-[3.4vw]">{title}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-[11px] uppercase leading-[1.7] tracking-[0.18em] text-ink/70 md:text-xs">{intro}</p>
      </FadeUp>
      <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-x-10">
        {items.map((it, i) => (
          <FadeUp key={it.title} delay={i * 0.08}>
            <span className="label tabular-nums tracking-[0.24em] text-sage-deep">{pad(i + 1)}</span>
            <h3 className="mt-4 text-[clamp(1.7rem,6vw,2.25rem)] leading-[1.05] lg:text-[2.2vw]">{it.title}</h3>
            <span aria-hidden className="mt-5 block h-px w-16 bg-ink/40" />
            <p className="mt-5 text-[15px] leading-[1.6] tracking-[-0.01em] text-ink/80">{it.text}</p>
          </FadeUp>
        ))}
      </div>
    </Band>
  )
}

/* ───────────── Secciones que se mantienen ───────────── */

/* Ubicación: texto y distancias a un lado, foto con parallax al otro. */
function Location({ data }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  return (
    <Band id="ubicacion" className="px-6 py-24 md:px-10 lg:py-36">
      <div className="grid grid-cols-12 gap-x-6 gap-y-12">
        <div className="col-span-12 lg:col-span-6">
          <Heading eyebrow={data.eyebrow} title={data.title} />
          <FadeUp as="p" className="mt-8 max-w-md text-sm leading-[1.5] tracking-[-0.01em] lg:text-lg lg:leading-[1.4]">
            {data.text}
          </FadeUp>
          <dl className="mt-10 lg:mt-14">
            {data.items.map((it, i) => (
              <FadeUp key={it.name} delay={i * 0.05} className="flex items-baseline justify-between gap-6 border-t border-ink/20 py-4 last:border-b">
                <dt className="text-base font-medium tracking-[-0.03em] lg:text-xl">{it.name}</dt>
                <dd className="text-right text-[11px] uppercase tracking-[0.18em] text-ink/60">{it.value}</dd>
              </FadeUp>
            ))}
          </dl>
          <FadeUp as="p" className="mt-8 text-[11px] uppercase tracking-[0.18em] text-ink/60">
            {data.address}
          </FadeUp>
        </div>
        <div ref={ref} className="col-span-12 h-[60svh] overflow-hidden rounded-[28px] lg:col-span-5 lg:col-start-8 lg:h-auto lg:min-h-[80svh] lg:rounded-[36px]">
          <motion.div style={{ y }} className="h-[118%] w-full -translate-y-[8%]">
            <Img src={data.image.src} alt={data.image.alt} className="h-full w-full" />
          </motion.div>
        </div>
      </div>
    </Band>
  )
}

/* Tres tarjetas hacia el resto del sitio */
function Explore({ data }) {
  return (
    <Band className="px-6 pb-24 md:px-10 lg:pb-36">
      <Heading eyebrow={data.eyebrow} title={data.title} className="mb-12 lg:mb-20" />
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        {onlyEnabled(data.items).map((l, i) => (
          <FadeUp key={l.href} delay={i * 0.1}>
            <SiteLink href={l.href} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-ink text-white md:rounded-[32px] lg:aspect-[4/5]">
                <Img src={l.image} alt={l.label} sizes="(min-width: 1024px) 33vw, 100vw" className="h-full w-full transition-transform duration-[1.6s] ease-out-expo group-hover:scale-[1.06]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25" />
                <div className="absolute inset-x-0 top-0 flex justify-between p-5 text-[11px] uppercase tracking-[0.18em] md:p-7">
                  <span>{l.kicker}</span>
                  <span className="tabular-nums">{pad(i + 1)}</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-7">
                  <h3 className="text-[clamp(1.8rem,7.5vw,2.5rem)] font-medium leading-none tracking-[-0.05em] lg:text-[2.8vw]">
                    <Roll>{l.label}</Roll>
                  </h3>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bone text-ink transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">
                    →
                  </span>
                </div>
              </div>
            </SiteLink>
          </FadeUp>
        ))}
      </div>
    </Band>
  )
}

export default function About({ ready }) {
  const { hero, statement, stats, banner, history, offer, location, strip, links } = aboutPage
  return (
    <main id="top" className="overflow-x-clip">
      <HotelHero ready={ready} {...hero} />

      <Band id="historia">
        <Statement {...statement} />
        <Stats items={stats} />
        <HotelBanner {...banner} />
      </Band>

      <History {...history} />
      <Offer {...offer} />
      <Location data={location} />
      <Corners id="edificio" {...strip} />
      <Explore data={links} />
      <Footer />
      <BookBar title={brand} detail='Parque Lleras · El Poblado' />
    </main>
  )
}
