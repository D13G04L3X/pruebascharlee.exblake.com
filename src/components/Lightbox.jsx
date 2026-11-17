import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Chevron, Close, EASE, pad } from './ui'

/* Foto ampliada a pantalla completa, con flechas, teclado y contador. */
export default function Lightbox({ images, index, onClose, onStep }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    window.lenis?.stop?.()
    return () => {
      window.removeEventListener('keydown', onKey)
      window.lenis?.start?.()
    }
  }, [onClose, onStep])

  const btn =
    'flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-bone text-ink transition-transform hover:scale-105'
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Galería ampliada"
      className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/95 p-4 md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onClose}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={images[index].src}
          alt={images[index].alt}
          className="max-h-full max-w-full rounded-xl object-contain"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.45, ease: EASE }}
          onClick={(e) => e.stopPropagation()}
        />
      </AnimatePresence>
      <button type="button" aria-label="Cerrar" onClick={onClose} className={`${btn} absolute right-5 top-16 md:right-10`}>
        <Close />
      </button>
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-4 text-bone" onClick={(e) => e.stopPropagation()}>
        <button type="button" aria-label="Imagen anterior" onClick={() => onStep(-1)} className={btn}>
          <Chevron dir={-1} />
        </button>
        <span className="label tabular-nums">
          {pad(index + 1)} / {pad(images.length)}
        </span>
        <button type="button" aria-label="Imagen siguiente" onClick={() => onStep(1)} className={btn}>
          <Chevron dir={1} />
        </button>
      </div>
    </motion.div>
  )
}
