import { useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { booking } from '../content'
import { EASE, Roll } from './ui'

/* Barra flotante de reserva (habitaciones y El hotel).
   Aparece al dejar atrás la portada (mide la segunda sección de <main>) y se esconde al
   llegar al footer, que ya tiene su propio botón de reserva.
   `title`: texto principal (p. ej. el nombre de la habitación) · `detail`: texto pequeño
   que solo se ve desde tablet. */
export default function BookBar({ title, detail }) {
  const [show, setShow] = useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => {
    const vh = window.innerHeight
    const next = document.querySelector('main#top > :nth-child(2)')
    const start = next ? next.getBoundingClientRect().top + y - vh * 0.3 : vh * 0.7
    const footer = document.querySelector('footer')
    const atFooter = footer ? footer.getBoundingClientRect().top < vh - 80 : false
    setShow(y > start && !atFooter)
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
      {/* Se nota por el borde claro, la sombra, un halo lento en el botón y la flecha que avanza. */}
      <div className="flex max-w-full items-center gap-4 rounded-full bg-ink py-1.5 pl-5 pr-1.5 text-bone shadow-[0_14px_44px_rgba(69,70,60,0.45)] ring-1 ring-bone/25">
        <span className="truncate text-xs font-medium tracking-[-0.01em] md:text-sm">{title}</span>
        {detail && <span className="hidden text-[10px] uppercase tracking-[0.16em] text-bone/60 sm:inline">{detail}</span>}
        <a
          href={booking.href}
          className="group flex shrink-0 items-center gap-1.5 rounded-full bg-terracotta px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-bone transition-colors motion-safe:animate-halo-soft hover:bg-terracotta-dark"
        >
          <Roll>{booking.label}</Roll>
          <span aria-hidden className="inline-block motion-safe:animate-nudge">
            →
          </span>
        </a>
      </div>
    </motion.div>
  )
}
