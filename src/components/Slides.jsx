import { useRef, useState } from 'react'
import { motion, useInView, useMotionValueEvent, useScroll } from 'framer-motion'
import { features } from '../content'
import { EASE, INOUT, Img, Mask, Roll, SiteLink, pad, useIsDesktop } from './ui'

// Colores y lado de la foto de cada panel
const LOOK = [
  { bg: 'var(--color-ink)', fg: '#ffffff', imageSide: 'right' },
  { bg: '#ffffff', fg: 'var(--color-ink)', imageSide: 'left' },
]
const STEP = 120 // vh de scroll por panel

/* Dos tarjetas redondeadas a pantalla completa: texto y foto.
   En cada paso el texto nuevo sube desde abajo y la foto cruza al otro lado. */
const LOOK_DARK = [
  { bg: 'var(--color-bone)', fg: 'var(--color-ink)', imageSide: 'right' },
  { bg: '#3b3734', fg: '#ffffff', imageSide: 'left' },
]

export default function Slides({ items = features, id = 'detalle', dark = false }) {
  const pin = useRef(null)
  const stage = useRef(null)
  const desktop = useIsDesktop()
  const shown = useInView(stage, { once: true, amount: 0.25 })
  const [active, setActive] = useState(0)
  const n = items.length
  const scrollLen = (n - 1) * STEP + 100

  const { scrollYProgress } = useScroll({ target: pin, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const t = (v * scrollLen) / STEP
    setActive(t < 0.3 ? 0 : Math.min(n - 1, Math.floor(t - 0.3) + 1))
  })

  const look = (i) => (dark ? LOOK_DARK : LOOK)[i % LOOK.length]
  const crossed = desktop && look(active).imageSide !== look(0).imageSide

  return (
    <section id={id} ref={pin} className={`relative z-20 w-full ${dark ? 'bg-ink text-bone' : 'bg-bone text-ink'}`} style={{ height: `${scrollLen + 100}vh` }}>
      <div ref={stage} className="sticky top-(--nav-h) h-[calc(100svh-var(--nav-h))] w-full overflow-hidden p-3 md:p-5 lg:p-8">
        <div className="relative h-full w-full">
          {items.map((f, i) => {
            const on = i === 0 ? shown : active >= i
            const base = i === 0 ? 0 : 0.5
            return (
              <div
                key={f.title}
                className="pointer-events-none absolute inset-0 grid grid-rows-2 gap-3 lg:grid-cols-2 lg:grid-rows-1"
                style={{ zIndex: i + 1 }}
              >
                <motion.div
                  className={`pointer-events-auto relative flex flex-col justify-between overflow-hidden rounded-[28px] p-5 md:rounded-[36px] md:p-8 lg:p-10 ${
                    look(i).imageSide === 'right' ? 'lg:col-start-1' : 'lg:col-start-2'
                  }`}
                  style={{ backgroundColor: look(i).bg, color: look(i).fg }}
                  initial={false}
                  animate={{ y: on ? '0%' : '105%' }}
                  transition={{ duration: i === 0 ? 1.1 : 0.9, ease: i === 0 ? EASE : INOUT }}
                >
                  <h2 className="max-w-[12ch] text-[clamp(2rem,8vw,3.75rem)] font-medium leading-[1] tracking-[-0.045em] lg:text-[4vw]">
                    <Mask>
                      <motion.span
                        className="block"
                        initial={false}
                        animate={{ y: on ? '0%' : '110%', opacity: on ? 1 : 0 }}
                        transition={{ duration: 0.8, ease: EASE, delay: on ? base + 0.1 : 0 }}
                      >
                        {f.title}
                      </motion.span>
                    </Mask>
                  </h2>
                  <motion.div
                    className="flex items-end justify-between gap-6"
                    initial={false}
                    animate={{ y: on ? 0 : 16, opacity: on ? 1 : 0 }}
                    transition={{ duration: 0.7, ease: EASE, delay: on ? base + 0.4 : 0 }}
                  >
                    <div className="flex shrink-0 -space-x-px text-sm" aria-label={`Panel ${i + 1} de ${n}`}>
                      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-current md:h-14 md:w-14">
                        {pad(i + 1)}
                      </span>
                      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-current opacity-40 md:h-14 md:w-14">
                        {pad(n)}
                      </span>
                    </div>
                    <div className="max-w-[22rem]">
                      <p className="text-xs leading-[1.4] tracking-[-0.01em] md:text-base">{f.text}</p>
                      {f.cta && (
                        <SiteLink
                          href={f.cta.href}
                          className="group mt-4 inline-block rounded-full border border-current px-5 py-2.5 text-[10px] uppercase tracking-[0.18em] transition-opacity hover:opacity-70 md:mt-5 md:text-[11px]"
                        >
                          <Roll>{f.cta.label} →</Roll>
                        </SiteLink>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            )
          })}

          {/* Foto: en escritorio cruza al otro lado cuando cambia el panel */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-50"
            initial={false}
            animate={{ x: crossed ? '-50%' : '0%' }}
            transition={{ duration: 0.9, ease: INOUT }}
          >
            <motion.div
              className="absolute inset-x-0 bottom-0 isolate h-[calc(50%-6px)] overflow-hidden rounded-[28px] md:rounded-[36px] lg:inset-y-0 lg:left-auto lg:right-0 lg:h-auto lg:w-[calc(50%-6px)]"
              initial={false}
              animate={{ x: crossed ? -6 : 0, y: shown ? '0%' : '105%' }}
              transition={{ duration: 1.1, ease: EASE, delay: shown && active === 0 ? 0.12 : 0 }}
            >
              {items.map((f, i) => (
                <motion.div
                  key={f.src}
                  className="absolute inset-0 overflow-hidden"
                  style={{ zIndex: i + 1 }}
                  initial={false}
                  animate={{ y: i === active ? '0%' : i < active ? '100%' : '-100%' }}
                  transition={{ duration: 0.8, ease: INOUT }}
                >
                  <motion.div
                    className="h-full w-full will-change-transform"
                    initial={false}
                    animate={{ scale: i === active && shown ? 1 : 1.3 }}
                    transition={{ duration: 1.4, ease: EASE }}
                  >
                    <Img src={f.src} alt={f.alt} dark={i % 2 === 1} className="h-full w-full" />
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
