import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { MotionConfig, motion } from 'framer-motion'
import Lenis from 'lenis'
import Preloader from './components/Preloader'
import Nav from './components/Nav'
import { INOUT } from './components/ui'
import { brand } from './content'
import { HOME, isEnabled } from './site'
import Home from './pages/Home'
import Rooms from './pages/Rooms'
import Room from './pages/Room'
import { EnvyRooftop, Restaurant } from './pages/Venue'
import Experiences from './pages/Experiences'
import Gallery from './pages/Gallery'
import About from './pages/About'


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

// Todas las páginas del sitio (se publican solo las activas en src/site.js)
const PAGES = [
  { path: '/', render: (ready) => <Home ready={ready} /> },
  { path: '/habitaciones', render: (ready) => <Rooms ready={ready} /> },
  { path: '/habitaciones/:slug', render: (ready) => <RoomRoute ready={ready} /> },
  { path: '/restaurante', render: (ready) => <Restaurant ready={ready} /> },
  { path: '/rooftop', render: (ready) => <EnvyRooftop ready={ready} /> },
  { path: '/experiencias', render: (ready) => <Experiences ready={ready} /> },
  { path: '/galeria', render: (ready) => <Gallery ready={ready} /> },
  { path: '/hotel', render: (ready) => <About ready={ready} /> },
]

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
          {/* Solo las páginas activas (src/site.js); el resto redirige a HOME */}
          {PAGES.filter((pg) => isEnabled(pg.path)).map((pg) => (
            <Route key={pg.path} path={pg.path} element={pg.render(ready)} />
          ))}
          <Route path="*" element={<Navigate to={HOME} replace />} />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  )
}
