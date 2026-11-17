import Hero from '../components/Hero'
import About from '../components/About'
import Spaces from '../components/Spaces'
import Slides from '../components/Slides'
import Suites from '../components/Suites'
import Rooftop from '../components/Rooftop'
import Footer from '../components/Footer'

export default function Home({ ready }) {
  return (
    <main id="top" className="overflow-x-clip">
      <Hero ready={ready} />
      <About />
      <Spaces />
      <Slides />
      <Suites />
      <Rooftop />
      <Footer />
    </main>
  )
}
