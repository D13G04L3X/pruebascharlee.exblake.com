import { envy, restaurant } from '../content'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import Slides from '../components/Slides'
import { Band, CtaPanel, Heading, HoverList, Pill, Rise, Statement, Strip } from '../components/blocks'

/* Plantilla de los dos espacios del hotel: restaurante (clara) y rooftop (oscura).
   Portada → concepto y horarios → paneles → carta con foto flotante → fotos → reservar. */
function Venue({ data, ready, dark = false, listId }) {
  return (
    <main id="top" className="overflow-x-clip">
      <PageHero ready={ready} {...data.hero} alt={data.name} />

      <Rise dark={dark} id="concepto">
        <Statement dark={dark} {...data.statement} />
      </Rise>

      <Slides items={data.panels} id="detalle" dark={dark} />

      <Band dark={dark} id={listId} className="px-6 py-24 md:px-10 lg:py-36">
        <Heading eyebrow={data.menu.eyebrow} title={data.menu.title} className="mb-12 lg:mb-20">
          <Pill href="#reservar" dark={dark}>
            {data.cta.button.label}
          </Pill>
        </Heading>
        <HoverList dark={dark} items={data.menu.items} />
      </Band>

      <Strip dark={dark} id="ambiente" {...data.strip} />
      <CtaPanel dark={dark} {...data.cta} />
      <Footer />
    </main>
  )
}

export const Restaurant = ({ ready }) => <Venue data={restaurant} ready={ready} listId="carta" />
export const EnvyRooftop = ({ ready }) => <Venue data={envy} ready={ready} dark listId="barra" />
