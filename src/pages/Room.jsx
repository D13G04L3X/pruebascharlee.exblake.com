import { useEffect, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion'
import { booking, brand, rooms, roomsPage } from '../content'
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
function RoomHero({ room, ready }) {
  const video = useRef(null)
  const [failed, setFailed] = useState(false)
  const [paused, setPaused] = useState(false)
  const { scrollY } = useScroll()
  const p = useTransform(scrollY, (y) => clamp01(y / (window.innerHeight * 0.9)))
  const scale = useTransform(p, [0, 1], [1, 1.12])
  const contentY = useTransform(p, (v) => -80 * seg(v, 0, 0.3, ez.p2i))
  const contentOpacity = useTransform(p, (v) => 1 - seg(v, 0, 0.3, ez.p2i))

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
              poster={room.images[0].src}
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
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/35" />
      </motion.div>

      <motion.div className="absolute inset-0 z-10" style={{ y: contentY, opacity: contentOpacity }}>
        <div className="absolute left-6 top-[14%] md:left-10 lg:top-[9%]">
          <motion.div {...fade(0.2)}>
            <Link to="/habitaciones" className="group mb-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em]">
              <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
              <Roll>Habitaciones</Roll>
            </Link>
          </motion.div>
          <Lines
            as="h1"
            lines={[room.name]}
            show={ready}
            delay={0.1}
            className="text-[clamp(2.6rem,12.5vw,5rem)] font-medium leading-[0.96] tracking-[-0.05em] md:text-[5.4rem] lg:text-[7vw]"
          />
          <motion.div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap sm:gap-5" {...fade(0.7)}>
            <a href={booking.href} className="group flex items-center gap-3 py-1.5 text-sm uppercase md:text-base lg:py-0 lg:text-lg">
              <Roll className="border-b border-white">{booking.label}</Roll>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <a href="#galeria" className="group flex items-center gap-3 py-1.5 text-sm uppercase md:text-base lg:py-0 lg:text-lg">
              <Roll className="border-b border-white">Ver la habitación</Roll>
              <span className="inline-block transition-transform duration-300 group-hover:translate-y-1">↓</span>
            </a>
          </motion.div>
        </div>

        <div className="pointer-events-none absolute bottom-[14%] left-0 right-0 px-6 md:px-10 lg:bottom-[16%]">
          <motion.ul
            className="grid w-full grid-cols-2 gap-x-6 gap-y-1 border-t border-white/30 pt-4 md:flex md:items-end md:justify-between"
            {...fade(0.9)}
          >
            {room.meta.map((m) => (
              <li key={m} className="text-[11px] uppercase tracking-[0.18em] md:text-sm lg:text-base">
                {m}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div className="absolute bottom-6 w-full px-6 text-center md:bottom-7" {...fade(1.1)}>
          <p className="text-sm leading-[120%] md:text-base lg:text-lg">
            {room.tagline[0]}
            <br />
            {room.tagline[1]}
          </p>
        </motion.div>

        {!failed && (
          <motion.button
            type="button"
            onClick={toggle}
            aria-label={paused ? 'Reproducir video' : 'Pausar video'}
            className="absolute bottom-5 right-6 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/60 bg-white/10 backdrop-blur-sm transition-colors hover:bg-white hover:text-ink md:right-10"
            {...fade(1.2)}
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
      </motion.div>
    </section>
  )
}

/* ───────────── 2 · Galería horizontal fija ───────────── */
const SHAPES = [
  'h-[58svh] w-[74vw] md:w-[40vw] lg:w-[36vw]',
  'h-[44svh] w-[60vw] md:w-[30vw] lg:w-[24vw] mt-[14svh]',
  'h-[62svh] w-[66vw] md:w-[32vw] lg:w-[27vw] -mt-[4svh]',
  'h-[40svh] w-[70vw] md:w-[38vw] lg:w-[32vw] mt-[18svh]',
]

function RoomGallery({ room }) {
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
        <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
          <motion.div style={{ opacity: introOpacity, y: introY }}>
            <motion.div ref={track} style={{ x }} className="flex w-max items-start gap-4 px-6 will-change-transform md:gap-6 md:px-10">
              <div className="flex h-[58svh] w-[78vw] shrink-0 flex-col justify-between pr-4 md:w-[40vw] lg:w-[34vw]">
                <span className="label tracking-[0.24em] lg:text-xs">Galería — {pad(n)}</span>
                <div>
                  <h2 className="text-[clamp(2rem,8.5vw,3.5rem)] font-medium leading-[1] tracking-[-0.05em] lg:text-[4.6vw]">
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
            className="mt-6 text-[clamp(1.75rem,7vw,2.75rem)] font-medium leading-[1.08] tracking-[-0.05em] lg:text-[4.2vw] lg:leading-[1.04]"
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
        <motion.div style={{ clipPath: clip }} className="h-[52svh] overflow-hidden lg:h-[92svh]">
          <motion.div style={{ y: figY }} className="h-[118%] w-full -translate-y-[8%]">
            <Img src={wide.src} alt={wide.alt} className="h-full w-full" />
          </motion.div>
        </motion.div>
      </div>

      <div className="mt-20 grid grid-cols-12 gap-x-6 gap-y-8 lg:mt-32">
        <div className="col-span-12 lg:col-span-4">
          <span className="label tracking-[0.24em] lg:text-xs">Incluye</span>
          <FadeUp as="h2" className="mt-5 text-[clamp(2rem,8.5vw,3.25rem)] font-medium leading-[1] tracking-[-0.05em] lg:text-[3.6vw]">
            Pensada hasta
            <br />
            el último detalle.
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
    </section>
  )
}

/* ───────────── 4 · Reservar ───────────── */
function RoomBook({ room, innerRef }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1])
  const line = `${booking.label} — ${room.name} — `

  return (
    <section id="reservar" ref={(el) => ((ref.current = el), innerRef && (innerRef.current = el))} className="relative z-20 h-svh w-full bg-bone p-3 md:p-5 lg:p-8">
      <motion.div
        style={{ scale }}
        className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[28px] bg-ink p-5 text-white md:rounded-[36px] md:p-8 lg:p-10"
      >
        <div className="relative z-10 flex items-start justify-between gap-6 pt-8 text-[11px] uppercase tracking-[0.18em] lg:pt-4">
          <span>Tu estadía</span>
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
            {room.name} te espera.
          </FadeUp>
          <FadeUp delay={0.15} className="mt-8 lg:mt-10">
            <Magnetic>
              <a
                href={booking.href}
                className="group relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-bone text-center text-[11px] font-medium uppercase tracking-[0.18em] text-ink md:h-44 md:w-44 md:text-xs"
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
          <span className="text-right text-white/60">Parque Lleras · Medellín</span>
        </div>
      </motion.div>
    </section>
  )
}

/* ───────────── 5 · Carrusel de otras habitaciones ───────────── */
function RoomSlide({ room, i, total, wasDragged }) {
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
      className="group block w-[78vw] shrink-0 select-none sm:w-[56vw] lg:w-[38vw]"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-ink md:rounded-[32px] lg:aspect-[5/6]">
        <Img
          src={room.images[0].src}
          alt={room.images[0].alt}
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
          <span>{room.kicker}</span>
          <span className="tabular-nums">
            {pad(i + 1)} <span className="opacity-50">/ {pad(total)}</span>
          </span>
        </div>
        <span className="pointer-events-none absolute bottom-5 left-5 inline-block translate-y-3 rounded-full border border-white/70 px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] text-white opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 md:bottom-7 md:left-7">
          {roomsPage.cta} →
        </span>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="text-[clamp(1.6rem,6.5vw,2.25rem)] font-medium leading-none tracking-[-0.05em] lg:text-[2.6vw]">{room.name}</h3>
        <span className="text-xl transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">→</span>
      </div>
      <p className="mt-3 text-[10px] uppercase leading-[1.6] tracking-[0.16em] text-ink/60 md:text-[11px]">{room.meta.join(' · ')}</p>
    </Link>
  )
}

function OtherRooms({ current }) {
  const others = rooms.filter((r) => r.slug !== current.slug)
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

  // Cursor "Arrastra" que sigue al mouse sobre el carrusel
  const cx = useSpring(useMotionValue(0), { stiffness: 260, damping: 26 })
  const cy = useSpring(useMotionValue(0), { stiffness: 260, damping: 26 })
  const [cursor, setCursor] = useState(false)
  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = wrap.current.getBoundingClientRect()
    cx.set(e.clientX - r.left)
    cy.set(e.clientY - r.top)
    setCursor(true)
  }

  const arrow =
    'flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-ink/30 transition-colors duration-300 hover:bg-ink hover:text-bone disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink'

  return (
    <section id="otras" className="relative z-20 overflow-hidden bg-bone pb-24 pt-20 text-ink lg:pb-36 lg:pt-28">
      <div className="flex flex-col gap-8 px-6 md:px-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="label tracking-[0.24em] lg:text-xs">{roomsPage.more.eyebrow}</span>
          <FadeUp as="h2" className="mt-5 text-[clamp(2.1rem,9.5vw,4rem)] font-medium leading-[0.98] tracking-[-0.05em] lg:text-[5.4vw]">
            {roomsPage.more.title[0]}
            <br />
            {roomsPage.more.title[1]}
          </FadeUp>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" aria-label="Anterior" onClick={() => go(-1)} disabled={edge === -1} className={arrow}>
            <Chevron dir={-1} />
          </button>
          <button type="button" aria-label="Siguiente" onClick={() => go(1)} disabled={edge === 1 || max === 0} className={arrow}>
            <Chevron dir={1} />
          </button>
        </div>
      </div>

      <div
        ref={wrap}
        className="relative mt-10 px-6 md:px-10 lg:mt-16"
        onPointerMove={onMove}
        onPointerLeave={() => setCursor(false)}
      >
        <motion.div
          ref={track}
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -max, right: 0 }}
          dragElastic={0.08}
          dragTransition={{ power: 0.25, timeConstant: 260 }}
          onDragStart={() => (wasDragged.current = true)}
          onDragEnd={() => setTimeout(() => (wasDragged.current = false), 50)}
          className="flex w-max cursor-grab touch-pan-y gap-4 active:cursor-grabbing md:gap-6"
        >
          {others.map((r, i) => (
            <RoomSlide key={r.slug} room={r} i={i} total={others.length} wasDragged={wasDragged} />
          ))}
          {/* Última tarjeta: volver al listado */}
          <Link
            to="/habitaciones"
            draggable={false}
            onClick={(e) => wasDragged.current && e.preventDefault()}
            className="group block w-[78vw] shrink-0 select-none sm:w-[56vw] lg:w-[38vw]"
          >
            <div className="flex aspect-[4/5] flex-col justify-between rounded-[24px] bg-ink p-6 text-bone md:rounded-[32px] md:p-9 lg:aspect-[5/6]">
              <span className="text-[11px] uppercase tracking-[0.18em] text-bone/60">{pad(rooms.length)} habitaciones</span>
              <div>
                <p className="text-[clamp(2rem,8.5vw,3rem)] font-medium leading-[1] tracking-[-0.05em] lg:text-[3.6vw]">
                  {roomsPage.more.all}
                </p>
                <span className="mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-bone text-xl text-ink transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
                  →
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          aria-hidden
          style={{ left: cx, top: cy }}
          initial={false}
          animate={{ scale: cursor ? 1 : 0, opacity: cursor ? 1 : 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="pointer-events-none absolute z-10 -ml-11 -mt-11 hidden h-[5.5rem] w-[5.5rem] items-center justify-center rounded-full bg-bone/90 text-[10px] font-medium uppercase tracking-[0.16em] text-ink backdrop-blur-sm lg:flex"
        >
          ← Arrastra →
        </motion.div>
      </div>

      <div className="mt-10 px-6 md:px-10 lg:mt-14">
        <div className="relative h-px w-full bg-ink/20">
          <motion.div style={{ scaleX: progress }} className="absolute inset-0 origin-left bg-ink" />
        </div>
      </div>
    </section>
  )
}

/* Barra flotante de reserva: visible mientras se lee la información, hasta el bloque de reserva. */
function BookBar({ room, until }) {
  const [show, setShow] = useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => {
    const vh = window.innerHeight
    const end = until.current ? until.current.getBoundingClientRect().top + y - vh * 0.6 : Infinity
    const info = document.getElementById('info')
    const start = info ? info.getBoundingClientRect().top + y - vh * 0.5 : vh
    setShow(y > start && y < end)
  })
  return (
    <motion.div
      className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4"
      initial={false}
      animate={{ y: show ? 0 : 90, opacity: show ? 1 : 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      style={{ pointerEvents: show ? 'auto' : 'none' }}
      inert={!show}
    >
      <div className="flex max-w-full items-center gap-4 rounded-full bg-ink py-1.5 pl-5 pr-1.5 text-bone shadow-[0_10px_40px_rgba(42,39,37,0.35)]">
        <span className="truncate text-xs font-medium tracking-[-0.01em] md:text-sm">{room.name}</span>
        <span className="hidden text-[10px] uppercase tracking-[0.16em] text-bone/60 sm:inline">{room.meta[0]} · {room.meta[1]}</span>
        <a
          href={booking.href}
          className="group shrink-0 rounded-full bg-bone px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-ink transition-colors hover:bg-white"
        >
          <Roll>{booking.label} →</Roll>
        </a>
      </div>
    </motion.div>
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
      <BookBar room={room} until={bookRef} />
    </main>
  )
}
