import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Chevron, Close, EASE, pad } from './ui'

/* Foto ampliada a pantalla completa, como carrusel:
   - Se desliza con el dedo / se arrastra con el mouse, flechas a los lados y teclado (← → Esc).
   - Miniaturas abajo para saltar a cualquier foto.
   - Se monta en <body> (portal) para quedar encima de todo: no se ven el header ni la barra de reserva. */
const SWIPE = 60 // px que hay que deslizar para cambiar de foto

const slide = {
  enter: (dir) => ({ x: dir > 0 ? '60%' : '-60%', opacity: 0, scale: 0.96 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir) => ({ x: dir > 0 ? '-60%' : '60%', opacity: 0, scale: 0.96 }),
}

export default function Lightbox({ images, index, onClose, onStep }) {
  const n = images.length
  const dir = useRef(1)
  const thumbs = useRef(null)
  const step = (d) => {
    dir.current = d >= 0 ? 1 : -1
    onStep(d)
  }
  const goTo = (i) => i !== index && step(i - index)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    window.lenis?.stop?.()
    const html = document.documentElement
    const prevOverflow = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      window.lenis?.start?.()
      html.style.overflow = prevOverflow
    }
  })

  // La miniatura activa siempre a la vista
  useEffect(() => {
    thumbs.current?.children[index]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [index])

  // Precarga la anterior y la siguiente para que el cambio sea inmediato
  useEffect(() => {
    ;[1, -1].forEach((d) => {
      const img = new Image()
      img.src = images[(index + d + n) % n].src
    })
  }, [index, images, n])

  // Botones discretos: translúcidos, sin tapar la foto; se encienden al pasar el mouse
  const ghost =
    'flex cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-bone/80 transition-colors duration-300 hover:border-bone hover:bg-bone hover:text-ink'
  const side = `${ghost} absolute top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 md:flex`

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Galería ampliada"
      className="fixed inset-0 z-[200] flex select-none flex-col bg-[#2b2c25] text-bone"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Barra superior: contador y nombre de la foto · cerrar */}
      <div className="flex shrink-0 items-center justify-between gap-4 px-5 pb-3 pt-[max(1rem,env(safe-area-inset-top))] md:px-10 md:pt-6">
        <p className="min-w-0 truncate text-[11px] uppercase tracking-[0.18em]">
          <span className="tabular-nums">{pad(index + 1)}</span>
          <span className="text-bone/40"> / {pad(n)}</span>
          <span className="ml-3 text-bone/60">{images[index].alt}</span>
        </p>
        <button
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
          className={`${ghost} h-9 w-9 shrink-0 md:h-10 md:w-10`}
        >
          <Close />
        </button>
      </div>

      {/* Foto actual: se desliza para cambiar */}
      <div className="relative min-h-0 flex-1 overflow-hidden" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <AnimatePresence initial={false} custom={dir.current} mode="popLayout">
          <motion.div
            key={index}
            custom={dir.current}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: EASE }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE || info.velocity.x < -500) step(1)
              else if (info.offset.x > SWIPE || info.velocity.x > 500) step(-1)
            }}
            className="absolute inset-0 flex cursor-grab touch-pan-y items-center justify-center px-4 active:cursor-grabbing md:px-28"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <img
              src={images[index].src}
              alt={images[index].alt}
              draggable={false}
              className="pointer-events-none max-h-full max-w-full rounded-xl object-contain md:rounded-2xl"
            />
          </motion.div>
        </AnimatePresence>

        <button type="button" aria-label="Imagen anterior" onClick={() => step(-1)} className={`${side} left-6`}>
          <Chevron dir={-1} />
        </button>
        <button type="button" aria-label="Imagen siguiente" onClick={() => step(1)} className={`${side} right-6`}>
          <Chevron dir={1} />
        </button>
      </div>

      {/* Miniaturas */}
      <div className="shrink-0 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 md:px-10 md:pb-6">
        <div className="flex items-center justify-center gap-2">
        <button type="button" aria-label="Imagen anterior" onClick={() => step(-1)} className={`${ghost} h-9 w-9 shrink-0 md:hidden`}>
          <Chevron dir={-1} />
        </button>
        <div ref={thumbs} className="flex min-w-0 gap-2 overflow-x-auto p-1 [scrollbar-width:none] md:gap-3">
          {images.map((im, i) => (
            <button
              key={im.src}
              type="button"
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === index}
              onClick={() => goTo(i)}
              className={`h-12 w-16 shrink-0 cursor-pointer overflow-hidden rounded-lg transition-all duration-300 md:h-16 md:w-24 ${
                i === index ? 'opacity-100 ring-2 ring-bone ring-offset-2 ring-offset-[#2b2c25]' : 'opacity-40 hover:opacity-80'
              }`}
            >
              <img src={im.src} alt="" draggable={false} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
        <button type="button" aria-label="Imagen siguiente" onClick={() => step(1)} className={`${ghost} h-9 w-9 shrink-0 md:hidden`}>
          <Chevron dir={1} />
        </button>
        </div>
      </div>
    </motion.div>,
    document.body,
  )
}
