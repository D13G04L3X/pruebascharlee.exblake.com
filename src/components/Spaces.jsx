import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { brand, spaces } from '../content'
import { EASE, Img, clamp01, ez, lerp, pad, seg } from './ui'

// Recorrido en vh: la ventana se abre (ENTER) y luego cada espacio ocupa STEP
const ENTER = 130
const STEP = 90

/* Marquee con una ventana al centro: al bajar, la ventana se abre a pantalla
   completa y se convierte en el recorrido por los espacios del hotel. */
export default function Spaces() {
  const ref = useRef(null)
  const items = spaces.items
  const n = items.length
  const total = ENTER + STEP * n
  const [active, setActive] = useState(0)
  const [entered, setEntered] = useState(false)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const vh = useTransform(scrollYProgress, (v) => v * total)

  useMotionValueEvent(vh, 'change', (v) => {
    setEntered(v >= 95)
    setActive(Math.min(n - 1, Math.max(0, Math.floor((v - ENTER) / STEP))))
  })

  const open = useTransform(vh, (v) => seg(v, 0, 100, ez.p2io))
  const clip = useTransform(open, (k) => {
    const W = window.innerWidth
    const H = window.innerHeight
    const lg = W >= 1024
    const w = lerp(Math.min(0.72 * W, lg ? 384 : 288), W, k)
    const h = lerp((lg ? 0.38 : 0.28) * H, H, k)
    return `inset(${(H - h) / 2}px ${(W - w) / 2}px round ${lerp(2, 0, k)}px)`
  })
  const imgScale = useTransform(open, [0, 1], [1.2, 1])
  const prompt = useTransform(vh, (v) => 1 - seg(v, 0, 30))
  const trackOpacity = useTransform(vh, (v) => 1 - seg(v, 20, 60))
  const trackY = useTransform(vh, (v) => `${-25 * seg(v, 20, 60)}%`)
  const tour = useTransform(vh, (v) => clamp01((v - ENTER) / (STEP * n)))
  const dot = useTransform(tour, (v) => `${v * 100}%`)

  const goTo = (i) => {
    const y = ref.current.offsetTop + ((ENTER + STEP * (i + 0.5)) / 100) * window.innerHeight
    if (window.lenis) window.lenis.scrollTo(y)
    else window.scrollTo(0, y)
  }

  const item = items[active]

  return (
    <section id="hotel" ref={ref} className="relative z-10 bg-bone text-ink" style={{ height: `${total + 100}vh` }}>
      <div className="sticky top-(--nav-h) h-[calc(100svh-var(--nav-h))] w-full overflow-hidden">
        {/* Marquee */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-10 flex items-center overflow-hidden">
          <motion.div style={{ opacity: trackOpacity, y: trackY }}>
            <div className="flex animate-marquee whitespace-nowrap text-[clamp(2.5rem,10vw,8rem)] font-semibold leading-none tracking-[-0.06em] lg:text-[clamp(3.5rem,7.5vw,8rem)]">
              {[0, 1, 2].map((g) => (
                <div key={g} className="flex shrink-0">
                  {Array.from({ length: 8 }, (_, i) => (
                    <span key={i} className="mx-[0.2em]">
                      {brand}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Ventana → pantalla completa */}
        <motion.div className="absolute inset-0 z-40 bg-ink will-change-[clip-path]" style={{ clipPath: clip }}>
          <motion.div className="absolute inset-0" style={{ scale: imgScale }}>
            {items.map((s, i) => (
              <motion.div
                key={s.src}
                className="absolute inset-0"
                style={{ zIndex: i }}
                initial={false}
                animate={{ clipPath: i <= active ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)' }}
                transition={{ duration: 1.1, ease: EASE }}
              >
                <motion.div
                  className="h-full w-full"
                  initial={false}
                  animate={{ scale: i === active ? 1 : 1.15 }}
                  transition={{ duration: 1.6, ease: EASE }}
                >
                  <Img src={s.src} alt={s.title} dark={i % 2 === 0} eager={i === 0} className="h-full w-full" />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          style={{ opacity: prompt }}
          className="label absolute bottom-8 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap text-black/55"
        >
          {spaces.hint}
        </motion.div>

        {/* HUD del recorrido */}
        <div
          className={`absolute inset-0 z-50 text-white transition-opacity duration-700 ${
            entered ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          {/* Riel lateral */}
          <div className="absolute right-4 top-[38%] -translate-y-1/2 scale-90 lg:right-10 lg:top-1/2 lg:scale-100">
            <div className="relative flex flex-col items-center gap-4">
              <div className="absolute left-1/2 top-2.5 h-[calc(100%-1.25rem)] w-px -translate-x-1/2 bg-white/20" />
              <motion.div
                className="absolute left-1/2 top-2.5 h-[calc(100%-1.25rem)] w-px origin-top -translate-x-1/2 bg-white shadow-[0_0_8px_rgba(255,255,255,0.45)]"
                style={{ scaleY: tour }}
              />
              {items.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  title={s.title}
                  aria-label={`Ver ${s.title}`}
                  aria-current={i === active}
                  onClick={() => goTo(i)}
                  className="relative z-10 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full"
                >
                  <span
                    className={`block rounded-full border transition-all duration-300 ${
                      i === active
                        ? 'h-3.5 w-3.5 border-white bg-white ring-4 ring-white/20'
                        : 'h-2 w-2 border-white/40 bg-transparent'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Pie con título, contador y barra */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent px-6 pb-6 pt-20 lg:px-10 lg:pb-8 lg:pt-28">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
              <div className="min-w-0 pr-10 lg:pr-0" role="status" aria-live="polite">
                <div className="label mb-3 flex items-center gap-2 text-white/70">
                  <span className="h-px w-6 bg-white/60" />
                  <span>{spaces.eyebrow}</span>
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active}
                    initial="hide"
                    animate="show"
                    exit="out"
                    transition={{ staggerChildren: 0.06 }}
                  >
                    <div className="overflow-hidden pb-[0.15em]">
                      <motion.h3 variants={hud} className="text-3xl leading-none tracking-[-0.04em] md:text-4xl lg:text-6xl">
                        {item.title}
                      </motion.h3>
                    </div>
                    <div className="mt-3 overflow-hidden">
                      <motion.p variants={hud} className="max-w-md text-xs uppercase tracking-[0.14em] text-white/75 md:text-sm">
                        {item.text}
                      </motion.p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="shrink-0 text-right">
                <div className="overflow-hidden pb-[0.1em]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={active}
                      variants={hud}
                      initial="hide"
                      animate="show"
                      exit="out"
                      className="text-4xl leading-none tracking-[-0.05em] tabular-nums md:text-5xl lg:text-8xl"
                    >
                      {pad(active + 1)}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="label mt-2 text-white/60">de {pad(n)}</div>
              </div>
            </div>
            <div className="relative mt-6 h-[2px] w-full bg-white/25">
              <motion.div className="absolute inset-0 origin-left bg-white" style={{ scaleX: tour }} />
              {items.slice(1).map((s, i) => (
                <span
                  key={s.title}
                  className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-white/50"
                  style={{ left: `${((i + 1) / n) * 100}%` }}
                />
              ))}
              <motion.span
                className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                style={{ left: dot }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const hud = {
  hide: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.6, ease: EASE } },
  out: { y: '-110%', transition: { duration: 0.25, ease: [0.55, 0, 1, 0.45] } },
}
