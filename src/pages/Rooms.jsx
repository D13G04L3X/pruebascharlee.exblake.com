import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { rooms, roomsPage } from '../content'
import Footer from '../components/Footer'
import { EASE, Img, Lines, Roll, pad } from '../components/ui'

/* Tarjeta a pantalla completa. Se queda fija mientras la siguiente sube por
   encima; al pasar el cursor se reproduce el video de la habitación. */
function RoomCard({ room, i, total }) {
  const ref = useRef(null)
  const pause = useRef(null)
  const video = useRef(null)
  // La tarjeta se queda quieta mientras pasa la pausa; se encoge solo cuando la siguiente empieza a subir.
  const { scrollYProgress: leave } = useScroll({ target: pause, offset: ['end end', 'end start'] })
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ['start end', 'start start'] })
  const last = i === total - 1
  const scale = useTransform(leave, [0, 1], [1, last ? 1 : 0.9])
  const dim = useTransform(leave, [0, 1], [0, last ? 0 : 0.55])
  const imgScale = useTransform(enter, [0, 1], [1.25, 1])

  const play = () => video.current?.play().catch(() => {})
  const stop = () => video.current?.pause()

  return (
    <>
    <div ref={ref} className="sticky top-(--nav-h) h-[calc(100svh-var(--nav-h))] w-full p-3 md:p-5 lg:p-8" style={{ zIndex: i + 1 }}>
      <motion.div style={{ scale }} className="h-full w-full origin-top will-change-transform">
        <Link
          to={`/habitaciones/${room.slug}`}
          onMouseEnter={play}
          onMouseLeave={stop}
          onFocus={play}
          onBlur={stop}
          className="group relative block h-full w-full overflow-hidden rounded-[28px] bg-ink text-white md:rounded-[36px]"
        >
          <motion.div className="absolute inset-0" style={{ scale: imgScale }}>
            <Img
              src={room.images[0].src}
              alt={room.images[0].alt}
              eager={i === 0}
              className="h-full w-full transition-transform duration-[1.6s] ease-out-expo group-hover:scale-[1.05]"
            />
            <video
              ref={video}
              src={room.video}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden
              className="absolute inset-0 hidden h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100 lg:block"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/35" />

          <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-8 lg:p-10">
            <div className="flex items-start justify-between pt-8 text-[11px] uppercase tracking-[0.18em] lg:pt-6">
              <span />
              <span className="tabular-nums">
                {pad(i + 1)} <span className="opacity-50">/ {pad(total)}</span>
              </span>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
              <div>
                <h2 className="text-[clamp(2.4rem,11vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.05em] lg:text-[7vw]">
                  {room.name}
                </h2>
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[10px] uppercase tracking-[0.16em] text-white/80 md:text-xs">
                  {room.meta.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
              <span className="inline-flex shrink-0 items-center self-start rounded-full border border-white/70 px-6 py-3 text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 group-hover:bg-white group-hover:text-ink lg:self-auto">
                <Roll>{roomsPage.cta} →</Roll>
              </span>
            </div>
          </div>
          <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: dim }} />
        </Link>
      </motion.div>
    </div>
    {/* Pausa: tramo de scroll en el que la habitación queda fija para leerla con calma */}
    <div ref={pause} aria-hidden className={last ? 'h-0' : 'h-[75svh]'} />
    </>
  )
}

export default function Rooms({ ready }) {
  return (
    <main id="top" className="overflow-x-clip bg-bone text-ink">
      <header className="flex min-h-[72svh] flex-col justify-end px-6 pb-10 pt-32 md:px-10 lg:pb-14">
        <motion.p
          className="label mb-5 tracking-[0.24em] lg:text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {roomsPage.eyebrow}
        </motion.p>
        <Lines
          as="h1"
          lines={roomsPage.title}
          show={ready}
          delay={0.1}
          className="text-[clamp(2.3rem,10.5vw,5.5rem)] text-sage-deep font-medium leading-[0.98] tracking-[-0.05em] lg:text-[8.2vw]"
        />
        <motion.div
          className="mt-8 flex flex-col gap-4 border-t border-ink/20 pt-5 md:flex-row md:items-start md:justify-between lg:mt-12"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 16 }}
          transition={{ duration: 1, ease: EASE, delay: 0.7 }}
        >
          <span className="text-[11px] uppercase tracking-[0.18em]">
            {pad(rooms.length)} habitaciones · Desliza ↓
          </span>
        </motion.div>
      </header>

      <section aria-label="Habitaciones" className="relative">
        {rooms.map((room, i) => (
          <RoomCard key={room.slug} room={room} i={i} total={rooms.length} />
        ))}
      </section>

      <Footer />
    </main>
  )
}
