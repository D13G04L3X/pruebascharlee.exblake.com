import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { galleryPage } from '../content'
import Footer from '../components/Footer'
import Lightbox from '../components/Lightbox'
import { CtaPanel } from '../components/blocks'
import { EASE, Img, Lines, pad } from '../components/ui'

// Proporciones que se van alternando para dar ritmo a las columnas
const RATIOS = ['aspect-[4/5]', 'aspect-[4/3]', 'aspect-[3/4]', 'aspect-square', 'aspect-[5/4]']

function useColumns() {
  const get = () => (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1)
  const [cols, setCols] = useState(get)
  useEffect(() => {
    const on = () => setCols(get())
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return cols
}

/* Cada columna se mueve a su propio ritmo con el scroll. */
function Column({ items, shift, progress, onOpen }) {
  const y = useTransform(progress, [0, 1], [shift, -shift])
  return (
    <motion.div style={{ y }} className="flex flex-1 flex-col gap-4 will-change-transform md:gap-6">
      <AnimatePresence mode="popLayout" initial={false}>
        {items.map((it) => (
          <motion.figure
            key={it.src}
            layout
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="group"
          >
            <button
              type="button"
              onClick={() => onOpen(it.index)}
              aria-label={`Ampliar: ${it.alt}`}
              className={`relative block w-full cursor-zoom-in overflow-hidden rounded-[20px] md:rounded-[28px] ${RATIOS[it.order % RATIOS.length]}`}
            >
              <Img src={it.src} alt={it.alt} className="h-full w-full transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.06]" />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-3 items-end justify-between gap-4 p-5 text-left text-white opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100">
                <span className="text-lg font-medium leading-tight tracking-[-0.03em]">{it.alt}</span>
                <span className="text-[10px] uppercase tracking-[0.16em]">{it.cat}</span>
              </span>
            </button>
          </motion.figure>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Gallery({ ready }) {
  const { eyebrow, title, intro, filters, items } = galleryPage
  const [filter, setFilter] = useState(filters[0])
  const [open, setOpen] = useState(null)
  const cols = useColumns()
  const grid = useRef(null)
  const { scrollYProgress } = useScroll({ target: grid, offset: ['start end', 'end start'] })

  const shown = useMemo(
    () => items.map((it, order) => ({ ...it, order })).filter((it) => filter === filters[0] || it.cat === filter).map((it, index) => ({ ...it, index })),
    [items, filter, filters],
  )
  const columns = useMemo(() => Array.from({ length: cols }, (_, c) => shown.filter((_, i) => i % cols === c)), [shown, cols])
  // Parallax solo cuando hay varias columnas
  const shifts = cols === 3 ? [50, -50, 90] : cols === 2 ? [30, -40] : [0]
  const count = (f) => (f === filters[0] ? items.length : items.filter((it) => it.cat === f).length)

  return (
    <main id="top" className="overflow-x-clip bg-bone text-ink">
      <header className="flex min-h-[68svh] flex-col justify-end px-6 pb-8 pt-32 md:px-10 lg:pb-10">
        <motion.p
          className="label mb-5 tracking-[0.24em] lg:text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {eyebrow}
        </motion.p>
        <Lines
          as="h1"
          lines={title}
          show={ready}
          delay={0.1}
          className="text-[clamp(2.3rem,10.5vw,5.5rem)] font-medium leading-[0.98] tracking-[-0.05em] lg:text-[8.2vw]"
        />
        <motion.div
          className="mt-8 flex flex-col gap-6 border-t border-ink/20 pt-5 lg:mt-12 lg:flex-row lg:items-start lg:justify-between"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 16 }}
          transition={{ duration: 1, ease: EASE, delay: 0.7 }}
        >
          <p className="max-w-md text-sm leading-[1.4] tracking-[-0.01em] lg:order-2 lg:text-lg">{intro}</p>
          <div role="tablist" aria-label="Filtrar galería" className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:px-0">
            {filters.map((f) => {
              const on = f === filter
              return (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setFilter(f)}
                  className={`relative shrink-0 cursor-pointer rounded-full border px-5 py-2.5 text-[11px] uppercase tracking-[0.16em] transition-colors duration-300 ${
                    on ? 'border-ink text-bone' : 'border-ink/30 hover:border-ink'
                  }`}
                >
                  {on && <motion.span layoutId="gallery-filter" className="absolute inset-0 rounded-full bg-ink" transition={{ duration: 0.5, ease: EASE }} />}
                  <span className="relative">
                    {f} <span className="tabular-nums opacity-50">{pad(count(f))}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </motion.div>
      </header>

      <section ref={grid} aria-label="Fotos" className="relative z-20 min-h-[60svh] bg-bone px-6 pb-28 pt-6 md:px-10 lg:pb-44 lg:pt-16">
        <div className="flex items-start gap-4 md:gap-6">
          {columns.map((col, c) => (
            <Column key={c} items={col} shift={shifts[c] ?? 0} progress={scrollYProgress} onOpen={setOpen} />
          ))}
        </div>
      </section>

      <CtaPanel
        eyebrow="Mejor en persona"
        aside={`${pad(items.length)} fotos`}
        title="Ven a verlo tú."
        marquee="The Charlee — Reservar ahora"
        button={{ label: 'Ver habitaciones', href: '/habitaciones' }}
        foot="Parque Lleras · Medellín"
      />
      <Footer />

      <AnimatePresence>
        {open !== null && shown[open] && (
          <Lightbox
            images={shown}
            index={open}
            onClose={() => setOpen(null)}
            onStep={(d) => setOpen((i) => (i + d + shown.length) % shown.length)}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
