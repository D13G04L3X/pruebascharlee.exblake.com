/* Bloques compartidos por las páginas interiores (restaurante, rooftop,
   experiencias, galería, el hotel). Todos siguen el sistema del inicio. */
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useInView, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion'
import { brand } from '../content'
import Lightbox from './Lightbox'
import { EASE, FadeUp, Img, Magnetic, Roll, SiteLink, Veil, clamp01, ez, lerp, pad, seg } from './ui'

const tone = (dark) => (dark ? 'bg-ink text-bone' : 'bg-bone text-ink')
const line = (dark) => (dark ? 'border-bone/20' : 'border-ink/20')
const soft = (dark) => (dark ? 'text-bone/60' : 'text-ink/60')

/* Primera sección tras la portada: sube con nubes y velo de su color. */
export function Rise({ dark = false, id, className = '', children }) {
  const { scrollY } = useScroll()
  const t = useTransform(scrollY, (y) => 1.56 * clamp01(y / (window.innerHeight * 0.9)))
  const opacity = useTransform(t, (v) => seg(v, 0.8, 0.5))
  const y = useTransform(t, (v) => 48 * (1 - seg(v, 0.8, 0.6, ez.p3o)))
  return (
    <section id={id} className={`relative z-20 ${tone(dark)}`}>
      <Veil t={t} color={dark ? 'var(--color-ink)' : 'var(--color-bone)'} />
      <motion.div style={{ opacity, y }} className={`relative z-40 ${className}`}>
        {children}
      </motion.div>
    </section>
  )
}

export function Band({ dark = false, id, className = '', children }) {
  return (
    <section id={id} className={`relative z-20 ${tone(dark)} ${className}`}>
      {children}
    </section>
  )
}

function Word({ progress, range, children }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <motion.span style={{ opacity }} className="mr-[0.24em] inline-block">
      {children}
    </motion.span>
  )
}

/* Frase grande que se enciende palabra por palabra + texto y datos al lado. */
export function Statement({ dark = false, eyebrow, text, body, rows = [], actions = [] }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')
  return (
    <div className="grid grid-cols-12 gap-x-6 gap-y-12 px-6 py-20 md:px-10 lg:py-32">
      <div className="col-span-12 lg:col-span-7">
        <span className="label tracking-[0.24em] lg:text-xs">{eyebrow}</span>
        <p
          ref={ref}
          className="mt-6 font-display text-[clamp(1.75rem,7vw,2.75rem)] leading-[1.08] lg:text-[4.2vw] lg:leading-[1.04]"
        >
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {w}
            </Word>
          ))}
        </p>
      </div>
      <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:pt-12">
        {/* body: un texto o una lista de párrafos */}
        {[].concat(body || []).map((b, i) => (
          <FadeUp key={i} as="p" delay={i * 0.06} className={`max-w-md text-sm leading-[1.5] tracking-[-0.01em] lg:text-lg lg:leading-[1.4] ${i ? 'mt-4 lg:mt-5' : ''}`}>
            {b}
          </FadeUp>
        ))}
        {rows.length > 0 && (
          <dl className="mt-10">
            {rows.map((r, i) => (
              <FadeUp key={r.label} delay={i * 0.06} className={`flex items-baseline justify-between gap-6 border-t py-4 last:border-b ${line(dark)}`}>
                <dt className={`text-[11px] uppercase tracking-[0.18em] ${soft(dark)}`}>{r.label}</dt>
                <dd className="text-right text-base font-medium tracking-[-0.03em] lg:text-xl">
                  {r.href ? (
                    <a href={r.href} target={r.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="group">
                      <Roll>{r.value}</Roll>
                    </a>
                  ) : (
                    r.value
                  )}
                </dd>
              </FadeUp>
            ))}
          </dl>
        )}
        {/* Botones opcionales: el primero relleno (principal), el resto con borde */}
        {actions.length > 0 && (
          <FadeUp delay={0.1} className="mt-10 flex flex-wrap gap-3">
            {actions.map((a, i) =>
              i === 0 ? (
                <SiteLink
                  key={a.label}
                  href={a.href}
                  className="group inline-block rounded-full bg-terracotta px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-bone transition-colors hover:bg-terracotta-dark"
                >
                  <Roll>{a.label} →</Roll>
                </SiteLink>
              ) : (
                <Pill key={a.label} href={a.href} dark={dark}>
                  {a.label}
                </Pill>
              ),
            )}
          </FadeUp>
        )}
      </div>
    </div>
  )
}

/* Foto ancha con título, separador y texto encima (p. ej. "Noches de música en vivo"). */
export function PhotoBanner({ id, image, title, text }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  return (
    <section id={id} className="relative z-20 bg-bone px-3 py-3 md:px-5 lg:px-8">
      <div ref={ref} className="relative h-[calc(var(--ah)*70)] overflow-hidden rounded-[28px] bg-ink text-bone md:rounded-[36px] lg:h-[calc(var(--ah)*80)]">
        <motion.div className="absolute inset-0 h-[116%] -translate-y-[8%]" style={{ y }}>
          <Img src={image.src} alt={image.alt} className="h-full w-full" />
        </motion.div>
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
          <FadeUp as="h2" className="text-[clamp(2rem,8vw,4.5rem)] leading-[1.02] lg:text-[4.8vw]">
            {title}
          </FadeUp>
          <FadeUp delay={0.1} className="my-6 flex w-[min(16rem,60vw)] items-center gap-3 text-bone/80" aria-hidden>
            <span className="h-px flex-1 bg-current" />
            <span className="h-2 w-2 rotate-45 bg-current" />
            <span className="h-px flex-1 bg-current" />
          </FadeUp>
          <FadeUp as="p" delay={0.15} className="max-w-xl text-base leading-[1.5] text-bone/90 md:text-lg">
            {text}
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

/* Cuadrícula fija "bento": 6 fotos de distintos tamaños que encajan en un rectángulo.
   Escritorio (4 columnas × 3 filas):  A A B C / A A D C / E F F F.  Móvil: 2 columnas.
   Al pasar el mouse la foto se acerca y aparece su nombre; un clic la amplía. */
const BENTO = [
  'col-span-2 aspect-[4/3] lg:aspect-auto lg:col-span-2 lg:row-span-2',
  'aspect-square lg:aspect-auto',
  'aspect-square lg:aspect-auto lg:row-span-2',
  'aspect-square lg:aspect-auto',
  'aspect-square lg:aspect-auto',
  'col-span-2 aspect-[16/9] lg:aspect-auto lg:col-span-3',
]

export function Bento({ id, eyebrow, title, images }) {
  const [open, setOpen] = useState(null)
  const n = images.length
  return (
    <section id={id} className="relative z-20 bg-bone px-6 py-24 text-ink md:px-10 lg:py-36">
      <Heading eyebrow={`${eyebrow} — ${pad(n)}`} title={title} className="mb-10 lg:mb-16">
        <FadeUp as="p" className="max-w-xs text-sm leading-[1.5] text-ink/70 lg:text-base">
          Toca una foto para verla en grande.
        </FadeUp>
      </Heading>
      <div className="grid grid-cols-2 gap-2 md:gap-3 lg:h-[calc(var(--ah)*84)] lg:grid-cols-4 lg:grid-rows-3">
        {images.map((im, i) => (
          <FadeUp key={im.src} delay={(i % 3) * 0.06} className={`min-h-0 ${BENTO[i % BENTO.length]}`}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Ampliar: ${im.alt}`}
              className="group relative block h-full w-full cursor-zoom-in overflow-hidden rounded-[18px] bg-ink md:rounded-[24px]"
            >
              <Img
                src={im.src}
                alt={im.alt}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-full w-full transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.06]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-left text-bone md:p-5">
                <span className="min-w-0">
                  <span className="block text-[10px] tabular-nums tracking-[0.16em] text-bone/70">{pad(i + 1)}</span>
                  <span className="mt-1 block truncate text-[11px] uppercase tracking-[0.18em] md:text-xs">{im.alt}</span>
                </span>
                <span className="hidden h-9 w-9 shrink-0 translate-y-2 items-center justify-center rounded-full bg-bone text-ink opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 md:flex">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </span>
              </span>
            </button>
          </FadeUp>
        ))}
      </div>
      <AnimatePresence>
        {open !== null && (
          <Lightbox images={images} index={open} onClose={() => setOpen(null)} onStep={(d) => setOpen((k) => (k + d + n) % n)} />
        )}
      </AnimatePresence>
    </section>
  )
}

/* Banda de color con etiqueta, título, texto y un botón (p. ej. "Eventos Real"). */
export function InfoBand({ id, eyebrow, title, text, button }) {
  return (
    <section id={id} className="relative z-20 bg-bone px-3 py-3 md:px-5 lg:px-8">
      <div className="flex flex-col items-center rounded-[28px] bg-olive px-6 py-20 text-center text-bone md:rounded-[36px] lg:py-28">
        <FadeUp as="p" className="text-[11px] font-medium uppercase tracking-[0.24em] text-bone/80 md:text-xs">
          {eyebrow}
        </FadeUp>
        <FadeUp as="h2" delay={0.05} className="mt-5 text-[clamp(2.4rem,10vw,5rem)] leading-[1] lg:text-[5.4vw]">
          {title}
        </FadeUp>
        <FadeUp as="p" delay={0.1} className="mt-6 max-w-2xl text-base leading-[1.6] text-bone/85 md:text-lg">
          {text}
        </FadeUp>
        <FadeUp delay={0.15} className="mt-10">
          <SiteLink
            href={button.href}
            className="group inline-flex items-center gap-3 rounded-full bg-bone py-2 pl-6 pr-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-white"
          >
            <Roll>{button.label}</Roll>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-olive text-bone transition-transform duration-500 ease-out-expo group-hover:translate-x-1">→</span>
          </SiteLink>
        </FadeUp>
      </div>
    </section>
  )
}

/* Título de sección: etiqueta pequeña + titular en dos líneas. */
export function Heading({ eyebrow, title, className = '', children }) {
  return (
    <div className={`flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between ${className}`}>
      <div>
        <span className="label tracking-[0.24em] lg:text-xs">{eyebrow}</span>
        <FadeUp as="h2" className="mt-5 text-[clamp(2.1rem,9.5vw,4rem)] font-medium leading-[0.98] tracking-[-0.05em] lg:text-[5.4vw]">
          {title[0]}
          {title[1] && (
            <>
              <br />
              {title[1]}
            </>
          )}
        </FadeUp>
      </div>
      {children}
    </div>
  )
}

const SHAPES = [
  'h-[calc(var(--ah)*58)] w-[74vw] md:w-[40vw] lg:w-[36vw]',
  'h-[calc(var(--ah)*44)] w-[60vw] md:w-[30vw] lg:w-[24vw] mt-[calc(var(--ah)*14)]',
  'h-[calc(var(--ah)*62)] w-[66vw] md:w-[32vw] lg:w-[27vw] -mt-[calc(var(--ah)*4)]',
  'h-[calc(var(--ah)*40)] w-[70vw] md:w-[38vw] lg:w-[32vw] mt-[calc(var(--ah)*18)]',
]

/* Tira horizontal fija: el scroll vertical mueve las fotos. Se amplían al tocarlas. */
export function Strip({ dark = false, id, eyebrow, title, images }) {
  const section = useRef(null)
  const track = useRef(null)
  const [max, setMax] = useState(0)
  const [open, setOpen] = useState(null)
  const [count, setCount] = useState(1)
  const n = images.length

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
  const x = useTransform(scrollYProgress, (v) => -max * ez.p2io(v))
  useMotionValueEvent(scrollYProgress, 'change', (v) => setCount(Math.min(n, Math.floor(v * n) + 1)))

  return (
    <section id={id} className={`relative z-20 ${tone(dark)}`}>
      <div ref={section} style={{ height: `${120 + n * 55}vh` }}>
        <div className="sticky top-(--nav-h) flex h-[calc(100svh-var(--nav-h))] flex-col justify-center overflow-hidden">
          <motion.div ref={track} style={{ x }} className="flex w-max items-start gap-4 px-6 will-change-transform md:gap-6 md:px-10">
            <div className="flex h-[calc(var(--ah)*58)] w-[78vw] shrink-0 flex-col justify-between pr-4 md:w-[40vw] lg:w-[34vw]">
              <span className="label tracking-[0.24em] lg:text-xs">
                {eyebrow} — {pad(n)}
              </span>
              <div>
                <h2 className="text-[clamp(2rem,8.5vw,3.5rem)] font-medium leading-[1] tracking-[-0.05em] lg:text-[4.6vw]">
                  {title[0]}
                  <br />
                  {title[1]}
                </h2>
                <p className={`mt-5 text-[11px] uppercase tracking-[0.18em] ${soft(dark)}`}>Desliza · toca una foto para ampliarla</p>
              </div>
            </div>
            {images.map((im, i) => (
              <figure key={im.src} className={`group shrink-0 ${SHAPES[i % SHAPES.length]}`}>
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={`Ampliar: ${im.alt}`}
                  className="block h-full w-full cursor-zoom-in overflow-hidden rounded-[20px] md:rounded-[28px]"
                >
                  <Img src={im.src} alt={im.alt} sizes="(min-width: 1024px) 36vw, 74vw" className="h-full w-full transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.06]" />
                </button>
                <figcaption className={`mt-3 flex justify-between gap-4 text-[10px] uppercase tracking-[0.16em] ${soft(dark)}`}>
                  <span>{im.alt}</span>
                  <span className="tabular-nums">{pad(i + 1)}</span>
                </figcaption>
              </figure>
            ))}
          </motion.div>

          <div className="absolute inset-x-6 bottom-7 flex items-center gap-4 md:inset-x-10">
            <span className="label tabular-nums">
              {pad(count)} / {pad(n)}
            </span>
            <div className={`relative h-px flex-1 ${dark ? 'bg-bone/20' : 'bg-ink/20'}`}>
              <motion.div style={{ scaleX: scrollYProgress }} className={`absolute inset-0 origin-left ${dark ? 'bg-bone' : 'bg-ink'}`} />
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {open !== null && (
          <Lightbox images={images} index={open} onClose={() => setOpen(null)} onStep={(d) => setOpen((i) => (i + d + n) % n)} />
        )}
      </AnimatePresence>
    </section>
  )
}

/* Panel redondeado a pantalla completa con marquee de fondo y botón magnético. */
export function CtaPanel({ dark = false, id = 'reservar', eyebrow, aside, title, marquee, button, foot }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1])
  const text = `${marquee} — `
  return (
    <section id={id} ref={ref} className={`relative z-20 h-[calc(100svh-var(--nav-h))] w-full p-3 md:p-5 lg:p-8 ${tone(dark)}`}>
      <motion.div
        style={{ scale }}
        className={`relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[28px] p-5 md:rounded-[36px] md:p-8 lg:p-10 ${
          dark ? 'bg-bone text-ink' : 'bg-ink text-white'
        }`}
      >
        <div className="relative z-10 flex items-start justify-between gap-6 pt-8 text-[11px] uppercase tracking-[0.18em] lg:pt-4">
          <span>{eyebrow}</span>
          <span className="text-right opacity-60">{aside}</span>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center overflow-hidden opacity-[0.14]">
          <div className="flex animate-marquee whitespace-nowrap text-[clamp(4rem,17vw,16rem)] font-semibold leading-none tracking-[-0.06em]">
            {[0, 1, 2].map((g) => (
              <span key={g} className="shrink-0 pr-[0.3em]">
                {text}
                {text}
              </span>
            ))}
          </div>
        </div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <FadeUp as="h2" className="max-w-[16ch] text-balance text-[clamp(2.2rem,9.5vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.05em] lg:text-[5.6vw]">
            {title}
          </FadeUp>
          <FadeUp delay={0.15} className="mt-8 lg:mt-10">
            <Magnetic>
              <SiteLink
                href={button.href}
                className={`group relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full text-center text-[11px] font-medium uppercase tracking-[0.18em] md:h-44 md:w-44 md:text-xs ${
                  dark ? 'bg-ink text-bone' : 'bg-bone text-ink'
                }`}
              >
                <span
                  className={`absolute inset-0 translate-y-full rounded-full transition-transform duration-700 ease-out-expo group-hover:translate-y-0 ${
                    dark ? 'bg-black' : 'bg-white'
                  }`}
                />
                <span className="relative px-6 leading-[1.5]">
                  {button.label}
                  <span className="mt-1 block text-base transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">→</span>
                </span>
              </SiteLink>
            </Magnetic>
          </FadeUp>
        </div>
        <div className="relative z-10 flex items-end justify-between gap-6 text-[11px] uppercase tracking-[0.18em]">
          <span>{brand}</span>
          <span className="text-right opacity-60">{foot}</span>
        </div>
      </motion.div>
    </section>
  )
}

function Count({ value, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, value, { duration: 1.8, ease: EASE, onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [inView, value])
  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  )
}

/* Cifras grandes que cuentan al entrar en pantalla. */
export function Stats({ dark = false, items }) {
  return (
    <div className={`grid grid-cols-2 border-t ${items.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} ${line(dark)} mx-6 md:mx-10`}>
      {items.map((s, i) => (
        <FadeUp key={s.label} delay={i * 0.08} className={`border-b py-8 lg:py-12 ${line(dark)} ${i % 2 ? 'pl-5' : ''} lg:pl-0`}>
          <div className="text-[clamp(2.6rem,12vw,5rem)] font-medium leading-none tracking-[-0.06em] lg:text-[6.4vw]">
            <Count value={s.value} suffix={s.suffix} />
          </div>
          <p className={`mt-3 text-[11px] uppercase tracking-[0.18em] ${soft(dark)}`}>{s.label}</p>
        </FadeUp>
      ))}
    </div>
  )
}

/* Lista con foto flotante: en escritorio la foto sigue al cursor. */
export function HoverList({ dark = false, items }) {
  const wrap = useRef(null)
  const [active, setActive] = useState(null)
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 26 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 26 })
  const move = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = wrap.current.getBoundingClientRect()
    x.set(e.clientX - r.left)
    y.set(e.clientY - r.top)
  }
  return (
    <div ref={wrap} className="relative" onPointerMove={move} onPointerLeave={() => setActive(null)}>
      <ul className={`border-t ${line(dark)}`}>
        {items.map((it, i) => (
          <motion.li
            key={it.name}
            onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8% 0px' }}
            transition={{ duration: 0.9, ease: EASE, delay: (i % 4) * 0.05 }}
            className={`group grid grid-cols-12 items-center gap-x-4 gap-y-2 border-b py-5 lg:py-7 ${line(dark)}`}
          >
            <>
              <span className={`col-span-2 text-[10px] tabular-nums tracking-[0.16em] lg:col-span-1 ${soft(dark)}`} style={{ opacity: active === null || active === i ? 1 : 0.35 }}>
                {pad(i + 1)}
              </span>
              <h3
                className="col-span-10 text-[clamp(1.5rem,6.5vw,2.25rem)] font-medium leading-[1.05] tracking-[-0.045em] transition-[opacity,transform] duration-500 ease-out-expo lg:col-span-5 lg:text-[3vw] lg:group-hover:translate-x-3"
                style={{ opacity: active === null || active === i ? 1 : 0.35 }}
              >
                {it.name}
              </h3>
              <p
                className="col-span-10 col-start-3 text-sm leading-[1.45] tracking-[-0.01em] transition-opacity duration-500 lg:col-span-4 lg:col-start-auto lg:text-base"
                style={{ opacity: active === null || active === i ? 1 : 0.35 }}
              >
                {it.text}
              </p>
              <span className={`col-span-10 col-start-3 text-[10px] uppercase tracking-[0.16em] lg:col-span-2 lg:col-start-auto lg:text-right ${soft(dark)}`}>{it.tag}</span>
              {/* En móvil la foto va dentro de la fila */}
              <div className="col-span-10 col-start-3 mt-2 h-44 overflow-hidden rounded-[18px] lg:hidden">
                <Img src={it.image} alt={it.name} className="h-full w-full" />
              </div>
            </>
          </motion.li>
        ))}
      </ul>

      <motion.div
        aria-hidden
        style={{ left: x, top: y }}
        initial={false}
        animate={{ scale: active === null ? 0.6 : 1, opacity: active === null ? 0 : 1 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="pointer-events-none absolute z-10 -ml-[11vw] -mt-[14vw] hidden h-[28vw] w-[22vw] overflow-hidden rounded-[24px] lg:block"
      >
        {items.map((it, i) => (
          <motion.div
            key={it.name}
            className="absolute inset-0"
            initial={false}
            animate={{ clipPath: active !== null && i <= active ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)' }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ zIndex: i }}
          >
            <Img src={it.image} alt="" className="h-full w-full" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

/* Foto ancha que se abre al entrar en pantalla, con parallax. */
export function WideImage({ src, alt, className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-9%', '9%'])
  const clip = useTransform(scrollYProgress, (v) => {
    const k = 1 - seg(v, 0.05, 0.4, ez.p2io)
    return `inset(${10 * k}% ${14 * k}% round ${lerp(28, 36, 1 - k)}px)`
  })
  return (
    <div ref={ref} className={`px-6 md:px-10 ${className}`}>
      <motion.div style={{ clipPath: clip }} className="h-[calc(var(--ah)*52)] overflow-hidden lg:h-[calc(var(--ah)*92)]">
        <motion.div style={{ y }} className="h-[118%] w-full -translate-y-[8%]">
          <Img src={src} alt={alt} className="h-full w-full" />
        </motion.div>
      </motion.div>
    </div>
  )
}

/* Enlace tipo píldora */
export function Pill({ href, children, dark = false, className = '' }) {
  return (
    <SiteLink
      href={href}
      className={`group inline-block shrink-0 rounded-full border px-6 py-3 text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 ${
        dark ? 'border-bone/60 hover:bg-bone hover:text-ink' : 'border-ink/40 hover:bg-ink hover:text-bone'
      } ${className}`}
    >
      <Roll>{children} →</Roll>
    </SiteLink>
  )
}
