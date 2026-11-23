import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { MotionConfig, motion } from 'framer-motion'
import Lenis from 'lenis'
import Preloader from './components/Preloader'
import Nav from './components/Nav'
import { INOUT } from './components/ui'
import { brand } from './content'
import Home from './pages/Home'
import Rooms from './pages/Rooms'
import Room from './pages/Room'
import { EnvyRooftop, Restaurant } from './pages/Venue'
import Experiences from './pages/Experiences'
import Gallery from './pages/Gallery'
import About from './pages/About'

/* MODO VISTA PREVIA: solo se puede navegar por Habitaciones.
   Ponlo en false para volver a habilitar todo el sitio. */
const ROOMS_ONLY = false
const isRoomsPath = (p) => p === '/habitaciones' || p.startsWith('/habitaciones/')

const scrollTo = (target, opts) => {
  if (window.lenis?.scrollTo) window.lenis.scrollTo(target, { force: true, ...opts })
  else if (typeof target === 'number') window.scrollTo(0, target)
  else target.scrollIntoView()
}

/* Al cambiar de página: arriba del todo, o al ancla si la URL trae #hash. */
function ScrollManager() {
  const { pathname, hash, key } = useLocation()
  const prev = useRef(pathname)
  useLayoutEffect(() => {
    const samePage = prev.current === pathname
    prev.current = pathname
    if (hash) {
      const id = setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) scrollTo(el, { immediate: !samePage })
      }, 60)
      return () => clearTimeout(id)
    }
    scrollTo(0, { immediate: !samePage })
  }, [pathname, hash, key])
  return null
}

/* Cortina entre páginas: cubre la pantalla y se retira hacia arriba. */
function Curtain() {
  const { pathname } = useLocation()
  const prev = useRef(pathname)
  const [n, setN] = useState(0)
  useLayoutEffect(() => {
    if (prev.current !== pathname) {
      prev.current = pathname
      setN((c) => c + 1)
    }
  }, [pathname])
  if (n === 0) return null
  return (
    <motion.div
      key={n}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[150] flex items-center justify-center bg-ink text-bone"
      initial={{ y: '0%' }}
      animate={{ y: '-100%' }}
      transition={{ duration: 0.9, ease: INOUT, delay: 0.2 }}
    >
      <span className="text-[clamp(1.5rem,2.5vw,2.75rem)] font-medium leading-none tracking-[-0.055em]">{brand}</span>
    </motion.div>
  )
}

function RoomRoute({ ready }) {
  const { slug } = useParams()
  return <Room key={slug} slug={slug} ready={ready} />
}

export default function App() {
  const [ready, setReady] = useState(false)
  const lenis = useRef(null)

  // Scroll suave en toda la página
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const l = new Lenis({ lerp: 0.09 })
    lenis.current = l
    window.lenis = l
    l.stop()
    let id
    const raf = (t) => {
      l.raf(t)
      id = requestAnimationFrame(raf)
    }
    id = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(id)
      l.destroy()
      window.lenis = null
    }
  }, [])

  useEffect(() => {
    if (ready) lenis.current?.start()
  }, [ready])

  // Vista previa: bloquea cualquier enlace interno que no sea de habitaciones
  useEffect(() => {
    if (!ROOMS_ONLY) return
    const block = (e) => {
      const a = e.target.closest?.('a[href]')
      if (!a) return
      const href = a.getAttribute('href')
      if (href.startsWith('#')) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (!isRoomsPath(url.pathname)) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    document.addEventListener('click', block, true)
    return () => document.removeEventListener('click', block, true)
  }, [])

  // Enlaces #ancla dentro de la misma página
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]')
      if (!a || e.defaultPrevented) return
      const href = a.getAttribute('href')
      const el = href.length > 1 ? document.querySelector(href) : null
      e.preventDefault()
      // Un instante después: si el clic vino del menú, primero se libera el scroll
      if (el) setTimeout(() => scrollTo(el), 90)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Preloader onDone={() => setReady(true)} />
        <ScrollManager />
        <Curtain />
        <Nav ready={ready} />
        <Routes>
          {ROOMS_ONLY ? (
            <>
              <Route path="/habitaciones" element={<Rooms ready={ready} />} />
              <Route path="/habitaciones/:slug" element={<RoomRoute ready={ready} />} />
              <Route path="*" element={<Navigate to="/habitaciones" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Home ready={ready} />} />
              <Route path="/habitaciones" element={<Rooms ready={ready} />} />
              <Route path="/habitaciones/:slug" element={<RoomRoute ready={ready} />} />
              <Route path="/restaurante" element={<Restaurant ready={ready} />} />
              <Route path="/rooftop" element={<EnvyRooftop ready={ready} />} />
              <Route path="/experiencias" element={<Experiences ready={ready} />} />
              <Route path="/galeria" element={<Gallery ready={ready} />} />
              <Route path="/hotel" element={<About ready={ready} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  )
}
