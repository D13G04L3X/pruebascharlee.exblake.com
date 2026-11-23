import { useEffect, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion'
import { booking, brand, roomGeneral, roomNotes, rooms, roomsPage } from '../content'
import BookBar from '../components/BookBar'
import Footer from '../components/Footer'
import Lightbox from '../components/Lightbox'
import {
  Chevron,
  Close,
  EASE,
  FadeUp,
  Img,
  Lines,
  Magnetic,
  Piece,
  Roll,
  Veil,
  clamp01,
  ez,
  lerp,
  pad,
  seg,
  useIsDesktop,
} from '../components/ui'

/* ───────────── 1 · Video a pantalla completa ───────────── */
/* Portada de la habitación. Orden de lectura: nombre → frase → botones → ficha.
   - Abajo a la izquierda: número, nombre, frase y los dos botones (Reservar es el principal).
   - Ficha (a la derecha en escritorio, debajo en móvil): 4 datos clave y las comodidades.
   - Arriba: volver a Habitaciones y pausar el video, justo debajo del header. */
function RoomHero({ room, ready }) {
  const video = useRef(null)
  const [failed, setFailed] = useState(false)
  const [paused, setPaused] = useState(false)
  const { scrollY } = useScroll()
  const p = useTransform(scrollY, (y) => clamp01(y / (window.innerHeight * 0.9)))
  const scale = useTransform(p, [0, 1], [1, 1.12])
  const contentY = useTransform(p, (v) => -80 * seg(v, 0, 0.3, ez.p2i))
  const contentOpacity = useTransform(p, (v) => 1 - seg(v, 0, 0.3, ez.p2i))
  const index = rooms.findIndex((r) => r.slug === room.slug)
  const extras = room.meta.slice(4) // WiFi, aire acondicionado, maxi bar…

  const toggle = () => {
    const v = video.current
    if (!v) return
    if (v.paused) v.play().catch(() => {})
    else v.pause()
  }
  const fade = (delay) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: ready ? 1 : 0, y: ready ? 0 : 14 },
    transition: { duration: 1, ease: EASE, delay },
  })

  return (
    <section className="sticky top-0 z-0 h-svh w-full select-none overflow-hidden bg-black text-white">
      <motion.div className="pointer-events-none absolute inset-0" style={{ scale }}>
        <motion.div
          className="h-full w-full"
          initial={{ scale: 1.2 }}
          animate={{ scale: ready ? 1 : 1.2 }}
          transition={{ duration: 2.2, ease: EASE }}
        >
          {/* Si el video no carga, queda la foto de portada con un zoom lento */}
          <motion.div
            className="absolute inset-0"
            animate={failed ? { scale: [1, 1.12] } : undefined}
            transition={{ duration: 18, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
          >
            <Img src={room.images[0].src} alt={room.images[0].alt} dark eager className="h-full w-full" />
          </motion.div>
          {!failed && (
            <video
              ref={video}
              src={room.video}
              autoPlay
              muted
              loop
              playsInline
              onError={() => setFailed(true)}
              onPlay={() => setPaused(false)}
              onPause={() => setPaused(true)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </motion.div>
        {/* Oscurecido: más fuerte abajo, donde va el texto */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />
      </motion.div>

      <motion.div className="absolute inset-0 z-10 flex flex-col" style={{ y: contentY, opacity: contentOpacity }}>
        {/* Barra superior, bajo el header */}
        <div className="flex items-center justify-between px-6 pt-[calc(var(--nav-h)+1rem)] md:px-10">
          <motion.div {...fade(0.2)}>
            <Link
              to="/habitaciones"
              className="group inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/20 py-2 pl-3 pr-4 text-[10px] uppercase tracking-[0.18em] backdrop-blur-md transition-colors hover:bg-white hover:text-ink md:text-[11px]"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-0.5">
                <Chevron dir={-1} />
              </span>
              <Roll>Habitaciones</Roll>
            </Link>
          </motion.div>
          {!failed && (
            <motion.button
              type="button"
              onClick={toggle}
              aria-label={paused ? 'Reproducir video' : 'Pausar video'}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-black/20 backdrop-blur-md transition-colors hover:bg-white hover:text-ink"
              {...fade(0.3)}
            >
              {paused ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                  <path d="M2 1l9 5-9 5z" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                  <path d="M2 1h3v10H2zM7 1h3v10H7z" />
                </svg>
              )}
            </motion.button>
          )}
        </div>

        {/* Contenido principal, anclado abajo */}
        <div className="mt-auto flex flex-col gap-3.5 px-5 pb-5 sm:gap-5 sm:px-6 sm:pb-6 md:px-10 md:pb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="min-w-0 lg:max-w-[46rem]">
            <motion.p className="mb-2 text-[9px] uppercase tracking-[0.24em] text-white/70 sm:mb-3 sm:text-[10px] md:text-[11px]" {...fade(0.15)}>
              Habitación {pad(index + 1)} <span className="text-white/40">/ {pad(rooms.length)}</span>
            </motion.p>
            <Lines
              as="h1"
              lines={[room.name]}
              show={ready}
              delay={0.1}
              className="text-[clamp(2rem,9.5vw,5rem)] font-medium leading-[0.95] tracking-[-0.05em] md:text-[5.5rem] lg:text-[min(7vw,13svh)]"
            />
            <motion.p
              className="mt-2 max-w-[30rem] text-[13px] leading-[1.4] sm:mt-3 sm:text-[15px] tracking-[-0.01em] text-white/85 md:text-lg lg:mt-4"
              {...fade(0.5)}
            >
              {room.tagline.join(' ')}
            </motion.p>

            {/* Llamados a la acción: Reservar (principal, sólido y con halo) y Ver (secundario) */}
            <motion.div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:flex sm:items-center sm:gap-3 lg:mt-7" {...fade(0.7)}>
              <a
                href={booking.href}
                className="group relative inline-flex items-center justify-between min-w-0 gap-2 rounded-full bg-terracotta py-1.5 whitespace-nowrap pl-3 pr-1.5 text-[9px] font-semibold uppercase min-[380px]:pl-3.5 min-[380px]:text-[10px] tracking-[0.06em] sm:gap-4 sm:py-2 sm:pl-6 sm:pr-2 sm:text-[12px] sm:tracking-[0.16em] text-bone shadow-[0_12px_32px_rgba(0,0,0,0.4)] transition-[background-color,transform] duration-300 motion-safe:animate-halo hover:scale-[1.03] hover:bg-terracotta-dark md:text-[13px]"
              >
                <Roll>{booking.label}</Roll>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bone text-terracotta sm:h-10 sm:w-10 transition-transform duration-500 ease-out-expo group-hover:translate-x-1">
                  <Chevron dir={1} />
                </span>
              </a>
              <a
                href="#galeria"
                className="group inline-flex items-center justify-between min-w-0 gap-2 rounded-full border border-white/50 bg-white/10 py-1.5 whitespace-nowrap pl-3 pr-1.5 text-[9px] font-medium uppercase min-[380px]:pl-3.5 min-[380px]:text-[10px] tracking-[0.06em] sm:gap-4 sm:py-2 sm:pl-6 sm:pr-2 sm:text-[12px] sm:tracking-[0.16em] backdrop-blur-md transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink md:text-[13px]"
              >
                <Roll>
                  <span className="sm:hidden">Ver habitación</span>
                  <span className="hidden sm:inline">Ver la habitación</span>
                </Roll>
                <span className="flex h-8 w-8 shrink-0 rotate-90 items-center justify-center rounded-full border border-current/30 sm:h-10 sm:w-10 transition-transform duration-500 ease-out-expo group-hover:translate-x-1">
                  <Chevron dir={1} />
                </span>
              </a>
            </motion.div>
          </div>

          {/* Ficha de la habitación */}
          <motion.div
            className="w-full shrink-0 rounded-[18px] border border-white/15 bg-black/30 px-3.5 py-3 backdrop-blur-md sm:rounded-[22px] sm:p-4 md:p-5 lg:w-[26rem]"
            {...fade(0.9)}
          >
            <dl className="flex">
              {room.specs.map((s, k) => (
                <div key={s.label} className={`flex-1 ${k ? 'border-l border-white/15 pl-2.5 md:pl-3' : 'pr-2.5 md:pr-3'}`}>
                  <dt className="whitespace-nowrap pr-1 text-[8px] uppercase tracking-[0.04em] sm:text-[9px] text-white/60 md:text-[10px] md:tracking-[0.14em]">
                    {s.label}
                  </dt>
                  <dd className="mt-1 whitespace-nowrap text-[15px] font-medium sm:mt-1.5 sm:text-lg leading-none tracking-[-0.03em] md:text-2xl">{s.value}</dd>
                </div>
              ))}
            </dl>
            {extras.length > 0 && (
              <ul className="mt-2.5 flex flex-wrap gap-1 border-t border-white/15 pt-2.5 sm:mt-4 sm:gap-1.5 sm:pt-4">
                {extras.map((m) => (
                  <li key={m} className="rounded-full bg-white/10 px-2 py-1 text-[8px] uppercase tracking-[0.08em] text-white/85 sm:px-3 sm:py-1.5 sm:text-[10px] sm:tracking-[0.12em]">
                    {m}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

/* ───────────── 2 · Galería horizontal fija ───────────── */
const SHAPES = [
  'h-[calc(var(--ah)*58)] w-[74vw] md:w-[40vw] lg:w-[36vw]',
  'h-[calc(var(--ah)*44)] w-[60vw] md:w-[30vw] lg:w-[24vw] mt-[calc(var(--ah)*14)]',
  'h-[calc(var(--ah)*62)] w-[66vw] md:w-[32vw] lg:w-[27vw] -mt-[calc(var(--ah)*4)]',
  'h-[calc(var(--ah)*40)] w-[70vw] md:w-[38vw] lg:w-[32vw] mt-[calc(var(--ah)*18)]',
]

function RoomGalleryDesktop({ room }) {
  const section = useRef(null)
  const track = useRef(null)
  const [max, setMax] = useState(0)
  const [open, setOpen] = useState(null)
  const n = room.images.length

  // Nubes que suben sobre el video
  const { scrollY } = useScroll()
  const t = useTransform(scrollY, (y) => 1.56 * clamp01(y / (window.innerHeight * 0.9)))
  const introOpacity = useTransform(t, (v) => seg(v, 0.85, 0.5))
  const introY = useTransform(t, (v) => 48 * (1 - seg(v, 0.85, 0.6, ez.p3o)))

  useEffect(() => {
    const measure = () => track.current && setMax(Math.max(0, track.current.scrollWidth - window.innerWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, (v) => -max * ez.p2io(v) * 1) // leve suavizado al entrar y salir
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1])
  const [count, setCount] = useState(1)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setCount(Math.min(n, Math.floor(v * n) + 1)))

  const step = (d) => setOpen((i) => (i + d + n) % n)

  return (
    <section id="galeria" className="relative z-20 bg-bone text-ink">
      <Veil t={t} color="var(--color-bone)" />
      <div ref={section} className="relative z-40" style={{ height: `${120 + n * 55}vh` }}>
        <div className="sticky top-(--nav-h) flex h-[calc(100svh-var(--nav-h))] flex-col justify-center overflow-hidden">
          <motion.div style={{ opacity: introOpacity, y: introY }}>
            <motion.div ref={track} style={{ x }} className="flex w-max items-start gap-4 px-6 will-change-transform md:gap-6 md:px-10">
              <div className="flex h-[calc(var(--ah)*58)] w-[78vw] shrink-0 flex-col justify-between pr-4 md:w-[40vw] lg:w-[34vw]">
                <span className="label tracking-[0.24em] lg:text-xs">Galería — {pad(n)}</span>
                <div>
                  <h2 className="text-[clamp(2rem,8.5vw,3.5rem)] text-sage-deep font-medium leading-[1] tracking-[-0.05em] lg:text-[4.6vw]">
                    Dentro de
                    <br />
                    {room.name}.
                  </h2>
                  <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-ink/60">Desliza · toca una foto para ampliarla</p>
                </div>
              </div>
              {room.images.map((im, i) => (
                <figure key={im.src} className={`group shrink-0 ${SHAPES[i % SHAPES.length]}`}>
                  <button
                    type="button"
                    onClick={() => setOpen(i)}
                    aria-label={`Ampliar: ${im.alt}`}
                    className="block h-full w-full cursor-zoom-in overflow-hidden rounded-[20px] md:rounded-[28px]"
                  >
                    <Img
                      src={im.src}
                      alt={im.alt}
                      sizes="(min-width: 1024px) 36vw, 74vw"
                      className="h-full w-full transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.06]"
                    />
                  </button>
                  <figcaption className="mt-3 flex justify-between gap-4 text-[10px] uppercase tracking-[0.16em] text-ink/60">
                    <span>{im.alt}</span>
                    <span className="tabular-nums">{pad(i + 1)}</span>
                  </figcaption>
                </figure>
              ))}
            </motion.div>
          </motion.div>

          <div className="absolute inset-x-6 bottom-7 flex items-center gap-4 md:inset-x-10">
            <span className="label tabular-nums">
              {pad(count)} / {pad(n)}
            </span>
            <div className="relative h-px flex-1 bg-ink/20">
              <motion.div style={{ scaleX: bar }} className="absolute inset-0 origin-left bg-ink" />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open !== null && <Lightbox images={room.images} index={open} onClose={() => setOpen(null)} onStep={step} />}
      </AnimatePresence>
    </section>
  )
}

/* Carrusel que se arrastra (o se desliza con el dedo) con flechas y barra de progreso.
   Lo usan la galería en móvil y "Otras habitaciones", para que se comporten igual. */
const ARROW =
  'flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-ink/30 transition-colors duration-300 hover:bg-ink hover:text-bone disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink'

function useDragCarousel() {
  const wrap = useRef(null)
  const track = useRef(null)
  const wasDragged = useRef(false)
  const [max, setMax] = useState(0)
  const [edge, setEdge] = useState(-1) // -1 inicio · 0 medio · 1 final
  const x = useMotionValue(0)
  const progress = useTransform(x, (v) => (max ? clamp01(-v / max) : 0))
  useMotionValueEvent(x, 'change', (v) => setEdge(v > -8 ? -1 : v < -max + 8 ? 1 : 0))

  useEffect(() => {
    const measure = () => {
      if (!track.current) return
      const m = Math.max(0, track.current.scrollWidth - wrap.current.clientWidth)
      setMax(m)
      if (x.get() < -m) x.set(-m)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track.current)
    ro.observe(wrap.current)
    return () => ro.disconnect()
  }, [x])

  const go = (dir) => {
    const first = track.current.firstElementChild
    const stepSize = first.getBoundingClientRect().width + parseFloat(getComputedStyle(track.current).columnGap || 0)
    const target = Math.max(-max, Math.min(0, Math.round((x.get() - dir * stepSize) / stepSize) * stepSize))
    animate(x, target, { duration: 0.9, ease: EASE })
  }

  // Props del riel que se arrastra
  const trackProps = {
    ref: track,
    style: { x },
    drag: 'x',
    dragConstraints: { left: -max, right: 0 },
    dragElastic: 0.08,
    dragTransition: { power: 0.25, timeConstant: 260 },
    onDragStart: () => (wasDragged.current = true),
    onDragEnd: () => setTimeout(() => (wasDragged.current = false), 50),
  }

  return { wrap, track, wasDragged, max, edge, progress, go, trackProps }
}

function Arrows({ go, edge, max }) {
  return (
    <div className="flex shrink-0 items-center gap-3">
      <button type="button" aria-label="Anterior" onClick={() => go(-1)} disabled={edge === -1} className={ARROW}>
        <Chevron dir={-1} />
      </button>
      <button type="button" aria-label="Siguiente" onClick={() => go(1)} disabled={edge === 1 || max === 0} className={ARROW}>
        <Chevron dir={1} />
      </button>
    </div>
  )
}

/* Galería en móvil y tablet: mismo carrusel que "Otras habitaciones". Cada foto (con su pie)
   cabe completa bajo el header; el carrusel es un contenedor y 100cqh es su alto. */
const GALLERY_H = 'h-[min(calc(100svh-var(--nav-h)-7.5rem),calc(78vw*1.25+3rem))]'
const GALLERY_SLIDE = 'flex h-full w-[min(78vw,calc((100cqh-3rem)*0.8))] shrink-0 select-none flex-col'

function RoomGalleryMobile({ room }) {
  const [open, setOpen] = useState(null)
  const n = room.images.length
  const { wrap, wasDragged, max, edge, progress, go, trackProps } = useDragCarousel()

  // Nubes que suben sobre el video (igual que en escritorio)
  const { scrollY } = useScroll()
  const t = useTransform(scrollY, (y) => 1.56 * clamp01(y / (window.innerHeight * 0.9)))
  const step = (d) => setOpen((i) => (i + d + n) % n)

  return (
    <section id="galeria" className="relative z-20 bg-bone text-ink">
      <Veil t={t} color="var(--color-bone)" />
      <div className="relative z-40 overflow-hidden pb-24 pt-20">
        <div className="flex items-end justify-between gap-6 px-6 md:px-10">
          <div>
            <span className="label tracking-[0.24em]">Galería — {pad(n)}</span>
            <FadeUp as="h2" className="mt-5 text-[clamp(2.1rem,9.5vw,4rem)] text-sage-deep font-medium leading-[0.98] tracking-[-0.05em]">
              Dentro de
              <br />
              {room.name}.
            </FadeUp>
          </div>
          <Arrows go={go} edge={edge} max={max} />
        </div>

        <div ref={wrap} className={`relative mt-10 px-6 [container-type:size] md:px-10 ${GALLERY_H}`}>
          <motion.div {...trackProps} className="flex h-full w-max cursor-grab touch-pan-y gap-4 active:cursor-grabbing md:gap-6">
            {room.images.map((im, i) => (
              <figure key={im.src} className={GALLERY_SLIDE}>
                <button
                  type="button"
                  draggable={false}
                  onClick={() => !wasDragged.current && setOpen(i)}
                  aria-label={`Ampliar: ${im.alt}`}
                  className="relative min-h-0 flex-1 cursor-zoom-in overflow-hidden rounded-[24px] bg-ink md:rounded-[32px]"
                >
                  <Img src={im.src} alt={im.alt} sizes="78vw" className="pointer-events-none h-full w-full" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/25" />
                  <span className="pointer-events-none absolute right-5 top-5 text-[11px] uppercase tracking-[0.18em] text-white tabular-nums">
                    {pad(i + 1)} <span className="opacity-50">/ {pad(n)}</span>
                  </span>
                  {/* Indica que se puede ampliar */}
                  <span className="pointer-events-none absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-ink">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </span>
                </button>
                <figcaption className="flex h-12 shrink-0 items-start justify-between gap-4 pt-3 text-[10px] uppercase tracking-[0.16em] text-ink/60">
                  <span className="truncate">{im.alt}</span>
                  <span className="tabular-nums">{pad(i + 1)}</span>
                </figcaption>
              </figure>
            ))}
          </motion.div>
        </div>

        <div className="mt-6 px-6 md:px-10">
          <div className="relative h-px w-full bg-ink/20">
            <motion.div style={{ scaleX: progress }} className="absolute inset-0 origin-left bg-ink" />
          </div>
          <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-ink/50">Desliza · toca una foto para ampliarla</p>
        </div>
      </div>

      <AnimatePresence>
        {open !== null && <Lightbox images={room.images} index={open} onClose={() => setOpen(null)} onStep={step} />}
      </AnimatePresence>
    </section>
  )
}

/* Galería: en escritorio la fija con scroll horizontal; en móvil/tablet, el carrusel. */
function RoomGallery({ room }) {
  const desktop = useIsDesktop()
  return desktop ? <RoomGalleryDesktop room={room} /> : <RoomGalleryMobile room={room} />
}

/* ───────────── 3 · Información ───────────── */
function Word({ progress, range, children }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <motion.span style={{ opacity }} className="mr-[0.24em] inline-block">
      {children}
    </motion.span>
  )
}

function RoomInfo({ room }) {
  const statement = useRef(null)
  const figure = useRef(null)
  const { scrollYProgress } = useScroll({ target: statement, offset: ['start 0.85', 'end 0.45'] })
  const { scrollYProgress: fig } = useScroll({ target: figure, offset: ['start end', 'end start'] })
  const figY = useTransform(fig, [0, 1], ['-9%', '9%'])
  const clip = useTransform(fig, (v) => {
    const k = 1 - seg(v, 0.05, 0.4, ez.p2io)
    return `inset(${10 * k}% ${14 * k}% round ${lerp(28, 36, 1 - k)}px)`
  })
  const words = room.statement.split(' ')
  const wide = room.images[2] ?? room.images[0]

  return (
    <section id="info" className="relative z-20 bg-bone px-6 pb-24 pt-10 text-ink md:px-10 lg:pb-36 lg:pt-20">
      <div className="grid grid-cols-12 gap-x-6 gap-y-12">
        <div className="col-span-12 lg:col-span-7">
          <span className="label tracking-[0.24em] lg:text-xs">La habitación</span>
          <p
            ref={statement}
            className="mt-6 font-display text-[clamp(1.75rem,7vw,2.75rem)] leading-[1.08] tracking-[-0.05em] lg:text-[4.2vw] lg:leading-[1.04]"
          >
            {words.map((w, i) => (
              <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
                {w}
              </Word>
            ))}
          </p>
        </div>

        <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:pt-12">
          <FadeUp as="p" className="max-w-md text-sm leading-[1.5] tracking-[-0.01em] lg:text-lg lg:leading-[1.4]">
            {room.description}
          </FadeUp>
          <dl className="mt-10">
            {room.specs.map((s, i) => (
              <FadeUp key={s.label} delay={i * 0.06} className="flex items-baseline justify-between gap-6 border-t border-ink/20 py-4 last:border-b">
                <dt className="text-[11px] uppercase tracking-[0.18em] text-ink/60">{s.label}</dt>
                <dd className="text-right text-lg font-medium tracking-[-0.03em] lg:text-2xl">{s.value}</dd>
              </FadeUp>
            ))}
          </dl>
        </div>
      </div>

      {/* Foto ancha que se abre al entrar */}
      <div ref={figure} className="mt-20 lg:mt-32">
        <motion.div style={{ clipPath: clip }} className="h-[calc(var(--ah)*52)] overflow-hidden lg:h-[calc(var(--ah)*92)]">
          <motion.div style={{ y: figY }} className="h-[118%] w-full -translate-y-[8%]">
            <Img src={wide.src} alt={wide.alt} className="h-full w-full" />
          </motion.div>
        </motion.div>
      </div>

      <div className="mt-20 grid grid-cols-12 gap-x-6 gap-y-8 lg:mt-32">
        <div className="col-span-12 lg:col-span-4">
          <span className="label tracking-[0.24em] lg:text-xs">{roomGeneral.eyebrow}</span>
          <FadeUp as="h2" className="mt-5 text-[clamp(2rem,8.5vw,3.25rem)] text-sage-deep font-medium leading-[1] tracking-[-0.05em] lg:text-[3.6vw]">
            {roomGeneral.title}
          </FadeUp>
        </div>
        <ul className="col-span-12 grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8 lg:col-span-7 lg:col-start-6">
          {room.amenities.map((a, i) => (
            <FadeUp
              as="li"
              key={a}
              delay={(i % 2) * 0.06 + Math.floor(i / 2) * 0.05}
              className="flex items-baseline gap-4 border-t border-ink/20 py-4 text-base tracking-[-0.02em] lg:text-xl"
            >
              <span className="text-[10px] tabular-nums tracking-[0.16em] text-ink/50">{pad(i + 1)}</span>
              {a}
            </FadeUp>
          ))}
        </ul>
      </div>

      <div className="mt-20 grid grid-cols-12 gap-x-6 gap-y-8 lg:mt-32">
        <div className="col-span-12 lg:col-span-4">
          <span className="label tracking-[0.24em] lg:text-xs">{roomNotes.eyebrow}</span>
          <FadeUp as="h2" className="mt-5 text-[clamp(2rem,8.5vw,3.25rem)] text-sage-deep font-medium leading-[1] tracking-[-0.05em] lg:text-[3.6vw]">
            {roomNotes.title}
          </FadeUp>
        </div>
        <ul className="col-span-12 lg:col-span-7 lg:col-start-6">
          {roomNotes.items.map((n, i) => (
            <FadeUp
              as="li"
              key={i}
              delay={i * 0.06}
              className="flex items-baseline gap-4 border-t border-ink/20 py-4 text-sm leading-[1.5] tracking-[-0.01em] last:border-b lg:text-lg lg:leading-[1.4]"
            >
              <span className="text-[10px] tabular-nums tracking-[0.16em] text-ink/50">{pad(i + 1)}</span>
              <span>{n}</span>
            </FadeUp>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ───────────── 4 · Reservar ───────────── */
function RoomBook({ room, innerRef }) {
  const ref = useRef(null)
  // Termina de crecer justo cuando su borde superior llega bajo el header (no detrás de él)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 64px'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1])
  const line = `${booking.label} — ${room.name} — `

  return (
    <section id="reservar" ref={(el) => ((ref.current = el), innerRef && (innerRef.current = el))} className="relative z-20 h-[calc(100svh-var(--nav-h))] w-full bg-bone p-3 md:p-5 lg:p-8">
      <motion.div
        style={{ scale }}
        className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[28px] bg-ink p-5 text-white md:rounded-[36px] md:p-8 lg:p-10"
      >
        <div className="relative z-10 flex items-start justify-between gap-6 pt-8 text-[11px] uppercase tracking-[0.18em] lg:pt-4">
          <span />
          <span className="text-right text-white/60">{room.meta.slice(0, 2).join(' · ')}</span>
        </div>

        {/* Marquee de fondo */}
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center overflow-hidden opacity-[0.14]">
          <div className="flex animate-marquee whitespace-nowrap text-[clamp(4rem,17vw,16rem)] font-semibold leading-none tracking-[-0.06em]">
            {[0, 1, 2].map((g) => (
              <span key={g} className="shrink-0 pr-[0.3em]">
                {line}
                {line}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <FadeUp as="h2" className="max-w-[16ch] text-balance text-[clamp(2.2rem,9.5vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.05em] lg:text-[5.6vw]">
            {room.name}
          </FadeUp>
          <FadeUp delay={0.15} className="mt-8 lg:mt-10">
            <Magnetic>
              <a
                href={booking.href}
                className="group relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-terracotta text-center text-[11px] font-medium uppercase tracking-[0.18em] text-bone md:h-44 md:w-44 md:text-xs"
              >
                <span className="absolute inset-0 translate-y-full rounded-full bg-white transition-transform duration-700 ease-out-expo group-hover:translate-y-0" />
                <span className="relative px-6 leading-[1.5]">
                  {booking.label}
                  <span className="mt-1 block text-base transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">→</span>
                </span>
              </a>
            </Magnetic>
          </FadeUp>
        </div>

        <div className="relative z-10 flex items-end justify-between gap-6 text-[11px] uppercase tracking-[0.18em]">
          <span>{brand}</span>
          <span className="text-right text-white/60">El Poblado · Medellín</span>
        </div>
      </motion.div>
    </section>
  )
}

/* ───────────── 5 · Carrusel de otras habitaciones ───────────── */
/* Carrusel de otras habitaciones. Cada tarjeta (foto + ficha) cabe completa en el espacio
   bajo el header: el carrusel mide ese alto menos 7.5rem (barra de progreso y barra
   flotante de reserva), sin pasarse del alto que pide el ancho máximo de la tarjeta.
   El carrusel es un contenedor (container-type: size): 100cqh es su alto, la foto ocupa
   ese alto menos la ficha (h-36 = 9rem) y el ancho sale de la proporción (4:5; 1.05:1 en escritorio). */
const CAROUSEL_H =
  'h-[min(calc(100svh-var(--nav-h)-7.5rem),calc(78vw*1.25+9rem))] lg:h-[min(calc(100svh-var(--nav-h)-7.5rem),calc(40vw/1.05+9rem))]'
const SLIDE =
  'group flex h-full w-[min(78vw,calc((100cqh-9rem)*0.8))] shrink-0 select-none flex-col lg:w-[min(40vw,calc((100cqh-9rem)*1.05))]'
const CAPTION = 'h-36 shrink-0 pt-4'

function RoomSlide({ room, i, total, wasDragged, onButton }) {
  const video = useRef(null)
  const play = () => video.current?.play().catch(() => {})
  const stop = () => video.current?.pause()
  return (
    <Link
      to={`/habitaciones/${room.slug}`}
      draggable={false}
      onClick={(e) => wasDragged.current && e.preventDefault()}
      onMouseEnter={play}
      onMouseLeave={stop}
      className={SLIDE}
    >
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-[24px] bg-ink md:rounded-[32px]">
        <Img
          src={room.images[0].src}
          alt={room.images[0].alt}
          sizes="(min-width: 1024px) 40vw, 78vw"
          className="pointer-events-none h-full w-full transition-transform duration-[1.6s] ease-out-expo group-hover:scale-[1.06]"
        />
        <video
          ref={video}
          src={room.video}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100 lg:block"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25" />
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-5 text-[11px] uppercase tracking-[0.18em] text-white md:p-7">
          <span />
          <span className="tabular-nums">
            {pad(i + 1)} <span className="opacity-50">/ {pad(total)}</span>
          </span>
        </div>

        {/* Botón "Ver habitación". La zona que lo rodea (p-5/p-7) es más grande que el botón:
            al acercarse el mouse, el botón se llena de blanco, crece y la flecha avanza,
            y el cursor de "Arrastra" se reduce a un punto para no taparlo. */}
        <span
          className="group/btn absolute bottom-0 left-0 hidden p-5 md:p-7 lg:block"
          onPointerEnter={() => onButton(true)}
          onPointerLeave={() => onButton(false)}
        >
          <span className="flex translate-y-3 items-center gap-3 rounded-full border border-white/70 py-2.5 pl-5 pr-2.5 text-[11px] uppercase tracking-[0.18em] text-white opacity-0 backdrop-blur-[2px] transition-all duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 group-hover/btn:scale-[1.06] group-hover/btn:border-white group-hover/btn:bg-white group-hover/btn:text-ink group-hover/btn:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            {roomsPage.cta}
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-all duration-500 ease-out-expo group-hover/btn:translate-x-1 group-hover/btn:bg-ink group-hover/btn:text-white">
              <Chevron dir={1} />
            </span>
          </span>
        </span>
      </div>

      {/* Ficha: nombre, frase corta y los datos clave en columnas */}
      <div className={CAPTION}>
        <div className="flex items-center justify-between gap-4">
          <h3 className="truncate text-[clamp(1.4rem,min(6vw,calc(var(--ah)*4.2)),2.25rem)] font-medium leading-[1.05] tracking-[-0.05em]">
            {room.name}
          </h3>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/25 transition-all duration-500 ease-out-expo group-hover:border-ink group-hover:bg-ink group-hover:text-bone">
            <Chevron dir={1} />
          </span>
        </div>
        <p className="mt-1 truncate text-sm tracking-[-0.01em] text-ink/60">{room.tagline.join(' ')}</p>
        {/* Columnas que reparten el ancho pero nunca quedan más angostas que su texto */}
        <dl className="mt-3 flex border-t border-ink/15 pt-3">
          {room.specs.map((s, k) => (
            <div key={s.label} className={`flex-1 ${k ? 'border-l border-ink/15 pl-2 md:pl-3' : 'pr-2 md:pr-3'}`}>
              <dt className="whitespace-nowrap text-[9px] uppercase tracking-[0.04em] text-ink/50 xl:text-[10px] xl:tracking-[0.12em]">{s.label}</dt>
              <dd className="mt-1 truncate text-base font-medium leading-none tracking-[-0.03em] md:text-lg">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Link>
  )
}

function OtherRooms({ current }) {
  const others = rooms.filter((r) => r.slug !== current.slug)
  const { wrap, wasDragged, max, edge, progress, go, trackProps } = useDragCarousel()

  // Cursor "Arrastra" que sigue al mouse sobre el carrusel
  const cx = useSpring(useMotionValue(0), { stiffness: 260, damping: 26 })
  const cy = useSpring(useMotionValue(0), { stiffness: 260, damping: 26 })
  const [cursor, setCursor] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [overButton, setOverButton] = useState(false) // cerca de "Ver habitación": el cursor se vuelve un punto
  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = wrap.current.getBoundingClientRect()
    cx.set(e.clientX - r.left)
    cy.set(e.clientY - r.top)
    setCursor(true)
  }

  return (
    <section id="otras" className="relative z-20 overflow-hidden bg-bone pb-24 pt-20 text-ink lg:pb-32 lg:pt-28">
      <div className="flex items-end justify-between gap-6 px-6 md:px-10">
        <div>
          <span className="label tracking-[0.24em] lg:text-xs">{roomsPage.more.eyebrow}</span>
          <FadeUp as="h2" className="mt-5 text-[clamp(2.1rem,9.5vw,4rem)] text-sage-deep font-medium leading-[0.98] tracking-[-0.05em] lg:text-[5.4vw]">
            {roomsPage.more.title[0]}
            <br />
            {roomsPage.more.title[1]}
          </FadeUp>
        </div>
        <Arrows go={go} edge={edge} max={max} />
      </div>

      <div
        ref={wrap}
        className={`relative mt-10 px-6 [container-type:size] md:px-10 lg:mt-14 ${CAROUSEL_H}`}
        onPointerMove={onMove}
        onPointerLeave={() => (setCursor(false), setPressed(false), setOverButton(false))}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerCancel={() => setPressed(false)}
      >
        <motion.div
          {...trackProps}
          className="flex h-full w-max cursor-grab touch-pan-y gap-4 active:cursor-grabbing md:gap-6"
        >
          {others.map((r, i) => (
            <RoomSlide key={r.slug} room={r} i={i} total={others.length} wasDragged={wasDragged} onButton={setOverButton} />
          ))}
          {/* Última tarjeta: volver al listado */}
          <Link
            to="/habitaciones"
            draggable={false}
            onClick={(e) => wasDragged.current && e.preventDefault()}
            className={SLIDE}
          >
            <div className="flex min-h-0 flex-1 flex-col justify-between rounded-[24px] bg-ink p-6 text-bone md:rounded-[32px] md:p-9">
              <span className="text-[11px] uppercase tracking-[0.18em] text-bone/60">{pad(rooms.length)} habitaciones</span>
              <div>
                <p className="text-[clamp(1.6rem,min(8.5vw,calc(var(--ah)*5)),3.5rem)] font-medium leading-[1] tracking-[-0.05em]">
                  {roomsPage.more.all}
                </p>
                <span className="mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-bone text-xl text-ink transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
                  →
                </span>
              </div>
            </div>
            {/* Mismo pie vacío que las demás, para que todas las tarjetas queden alineadas */}
            <div aria-hidden className={CAPTION} />
          </Link>
        </motion.div>

        {/* Cursor "Arrastra": círculo oscuro translúcido, texto en una línea y flechas que
            invitan a deslizar; se encoge un poco mientras se arrastra. */}
        <motion.div
          aria-hidden
          style={{ left: cx, top: cy }}
          initial={false}
          animate={{ scale: cursor ? (overButton ? 0.14 : pressed ? 0.82 : 1) : 0, opacity: cursor ? 1 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="pointer-events-none absolute z-10 -ml-[3.75rem] -mt-[3.75rem] hidden h-[7.5rem] w-[7.5rem] items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-ink/75 text-bone shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md lg:flex"
        >
          <motion.span
            className="flex"
            animate={cursor ? { x: [0, -3, 0] } : { x: 0 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Chevron dir={-1} />
          </motion.span>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em]">Arrastra</span>
          <motion.span
            className="flex"
            animate={cursor ? { x: [0, 3, 0] } : { x: 0 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Chevron dir={1} />
          </motion.span>
        </motion.div>
      </div>

      <div className="mt-6 px-6 md:px-10">
        <div className="relative h-px w-full bg-ink/20">
          <motion.div style={{ scaleX: progress }} className="absolute inset-0 origin-left bg-ink" />
        </div>
      </div>
    </section>
  )
}

export default function Room({ slug, ready }) {
  const bookRef = useRef(null)
  const index = rooms.findIndex((r) => r.slug === slug)
  if (index < 0) return <Navigate to="/habitaciones" replace />
  const room = rooms[index]

  return (
    <main id="top" className="overflow-x-clip">
      <RoomHero room={room} ready={ready} />
      <RoomGallery room={room} />
      <RoomInfo room={room} />
      <RoomBook room={room} innerRef={bookRef} />
      <OtherRooms current={room} />
      <Footer />
      <BookBar title={room.name} detail={`${room.meta[0]} · ${room.meta[1]}`} />
    </main>
  )
}
