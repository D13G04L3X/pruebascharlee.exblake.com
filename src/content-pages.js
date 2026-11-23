// Textos e imágenes de las páginas interiores: restaurante, rooftop,
// experiencias, el hotel y galería. Se reexporta desde content.js.
// Fotos en /public/images/pages (temporales). Platos, horarios, cifras y
// distancias son DE EJEMPLO: reemplázalos por los reales.
const img = (name) => `/images/${name}.jpg`
const pg = (name, alt) => ({ src: img(`pages/${name}`), alt })

// /restaurante
export const restaurant = {
  name: 'Real Eatery',
  hero: {
    layout: 'cabecera', // portada con el nombre enorme abajo (ver MastheadHero)
    image: img('pages/resto-1'),
    video: '/videos/restaurante.mp4',
    eyebrow: 'Restaurante · The Charlee',
    title: ['Real', 'Eatery.'],
    ctas: [
      { label: 'Reservar una mesa', href: '#contacto' },
      { label: 'Ver el menú', href: '#carta' },
    ],
    meta: ['Cocina de origen', 'Desayuno · Almuerzo · Cena', 'Piso 1', 'Abierto al público'],
    tagline: ['Producto local, fuego lento', 'y una mesa sin afán.'],
  },
  // Textos oficiales de Real Eatery (tomados del sitio actual)
  statement: {
    eyebrow: 'Real Eatery · Una gran experiencia',
    text: 'REAL es un verdadero destino culinario en el corazón de El Poblado.',
    body: [
      'Nuestra cocina internacional con esencia local es el principal pilar de las recetas, donde los sabores del mundo se fusionan con ingredientes frescos y autóctonos de Colombia.',
      'Aquí, el ambiente es contemporáneo y acogedor, ideal para disfrutar desde un desayuno saludable hasta una cena especial.',
      'Además de la oferta gastronómica, en Real Eatery nos destacamos por la carta de cocteles de autor, SAMSARA, una experiencia gastronómica innovadora, consciente y REAL.',
    ],
    rows: [
      { label: 'Correo', value: 'info@thecharlee.com', href: 'mailto:info@thecharlee.com' },
      { label: 'Teléfono', value: '+57 316 2445492', href: 'tel:+573162445492' },
      { label: 'Instagram', value: '@real.eatery', href: 'https://www.instagram.com/real.eatery/' },
    ],
    actions: [
      { label: 'Reservar una mesa', href: '#contacto' },
      { label: 'Ver el menú', href: '#carta' },
    ],
  },
  panels: [
    {
      title: 'Cocina global, ingredientes locales',
      text: 'Nuestra cocina internacional con esencia local es el principal pilar de las recetas, donde los sabores del mundo se fusionan con ingredientes frescos y autóctonos de Colombia.',
      src: img('pages/resto-8'),
      alt: 'Cocina de Real Eatery',
      cta: { label: 'Reservar una mesa', href: '#contacto' },
    },
    {
      title: 'Menú Ultra',
      text: 'Una propuesta creada para acompañar tu entrenamiento: ingredientes conscientes, balance real y bienestar en cada plato.',
      src: img('pages/resto-6'),
      alt: 'Plato del Menú Ultra',
      cta: { label: 'Reservar una mesa', href: '#contacto' },
    },
  ],
  music: {
    image: pg('resto-3', 'Real Eatery de noche'),
    title: 'Noches de música en vivo',
    text: 'En Real, la gastronomía se une con la música en vivo para crear una experiencia única.',
  },
  events: {
    eyebrow: 'Espacio disponible para eventos',
    title: 'Eventos Real',
    text: 'En The Charlee, somos más que un hotel, ya que tenemos espacios adicionales que nos permiten brindarte experiencias inolvidables como el salón de eventos o el Mezzanine.',
    // Cambia el enlace por el formulario de cotización real
    button: { label: 'Cotiza aquí tu evento', href: '#contacto' },
  },
  menu: {
    eyebrow: 'La carta',
    title: ['Platos que', 'vuelven siempre.'],
    items: [
      { name: 'Salmón a la brasa', text: 'Pico de mango, ají dulce y fondo de cítricos.', tag: 'Del mar', image: img('pages/resto-4') },
      { name: 'Costilla de cocción lenta', text: 'Doce horas al horno, papa criolla y chimichurri.', tag: 'De la brasa', image: img('pages/resto-5') },
      { name: 'Ensalada de la huerta', text: 'Hojas frescas, queso costeño, semillas y vinagreta de panela.', tag: 'Vegetariano', image: img('pages/resto-6') },
      { name: 'Huevos de la casa', text: 'Pan de masa madre, aguacate y hogao suave.', tag: 'Desayuno', image: img('pages/resto-7') },
      { name: 'Tabla para compartir', text: 'Quesos locales, embutidos, encurtidos y pan caliente.', tag: 'Para la mesa', image: img('pages/resto-11') },
      { name: 'Café de origen', text: 'Granos de Antioquia en filtrado, espresso o cold brew.', tag: 'Barra de café', image: img('pages/resto-10') },
    ],
  },
  strip: {
    layout: 'bento', // cuadrícula fija en lugar del carrusel horizontal
    eyebrow: 'Ambiente',
    title: ['Un día en', 'Real Eatery.'],
    images: [
      pg('resto-1', 'El salón'),
      pg('resto-2', 'El pase'),
      pg('resto-9', 'La terraza'),
      pg('resto-3', 'La barra de noche'),
      pg('resto-8', 'La cocina'),
      pg('resto-10', 'Café de la mañana'),
    ],
  },
  // Sin bloque final de reserva: la barra flotante (bookBar) lleva a reservar
  bookBar: { title: 'Real Eatery', detail: 'El Poblado · Medellín' },
  cta: {
    panel: false,
    eyebrow: 'Tu mesa',
    aside: 'Piso 1 · Abierto al público',
    title: 'Tu mesa te espera.',
    marquee: 'Reservar mesa — Real Eatery',
    button: { label: 'Reservar mesa', href: '#contacto' },
    foot: 'Parque Lleras · Medellín',
  },
}

// /rooftop
export const envy = {
  name: 'Envy Rooftop',
  hero: {
    image: img('pages/envy-1'),
    video: '/videos/rooftop.mp4',
    eyebrow: 'Rooftop',
    title: ['Envy', 'Rooftop.'],
    ctas: [
      { label: 'Reservar', href: '#reservar' },
      { label: 'Ver el ambiente', href: '#ambiente' },
    ],
    meta: ['Piscina', 'Bar & cocteles', 'DJ en vivo', 'Vista 360°'],
    tagline: ['La ciudad a tus pies,', 'el atardecer en la mano.'],
  },
  statement: {
    eyebrow: 'El rooftop',
    text: 'Arriba, Medellín se ve completa: piscina de día, cocteles al atardecer y música cuando cae la noche.',
    body: 'Envy es el último piso de The Charlee. Un lugar para pasar la tarde con los pies en el agua y quedarse hasta que la ciudad se enciende.',
    rows: [
      { label: 'Piscina', value: '9:00 – 18:00' },
      { label: 'Bar', value: '12:00 – 2:00' },
      { label: 'DJ', value: 'Jueves a sábado' },
      { label: 'Ingreso', value: 'Huéspedes y reservas' },
    ],
  },
  panels: [
    {
      title: 'De día, agua y sol.',
      text: 'Piscina con vista a las montañas, camas de sol y una carta fresca para no bajar en toda la tarde.',
      src: img('pages/envy-7'),
      alt: 'Camas de sol con vista a la ciudad',
    },
    {
      title: 'De noche, la ciudad encendida.',
      text: 'Cuando baja el sol sube la música: cocteles de autor, DJ invitados y Medellín brillando alrededor.',
      src: img('pages/envy-5'),
      alt: 'Noche de música en Envy',
    },
  ],
  menu: {
    eyebrow: 'La barra',
    title: ['Lo que se pide', 'aquí arriba.'],
    items: [
      { name: 'Envy Spritz', text: 'Aperitivo cítrico, espumoso y naranja deshidratada.', tag: 'Atardecer', image: img('pages/envy-4') },
      { name: 'Old Fashioned de la casa', text: 'Ron colombiano añejo, panela y amargo de cacao.', tag: 'Clásico', image: img('pages/envy-3') },
      { name: 'Trío tropical', text: 'Lulo, maracuyá y mora: tres cocteles para la mesa.', tag: 'Para compartir', image: img('pages/envy-8') },
      { name: 'Brindis en grupo', text: 'Botellas, vinos y burbujas con servicio en tu mesa.', tag: 'Mesas', image: img('pages/envy-10') },
    ],
  },
  strip: {
    eyebrow: 'Ambiente',
    title: ['Así se vive', 'Envy.'],
    images: [
      pg('envy-1', 'La piscina'),
      pg('envy-9', 'Terraza al atardecer'),
      pg('envy-2', 'La barra'),
      pg('envy-6', 'Hora azul'),
      pg('envy-5', 'Noche de DJ'),
      pg('envy-3', 'Cocteles de autor'),
    ],
  },
  cta: {
    eyebrow: 'Tu noche',
    aside: 'Último piso · Vista 360°',
    title: 'Nos vemos arriba.',
    marquee: 'Envy Rooftop — Reservar',
    button: { label: 'Reservar en Envy', href: '#contacto' },
    foot: 'Parque Lleras · Medellín',
  },
}

// /experiencias
export const experiences = {
  hero: {
    image: img('pages/exp-1'),
    eyebrow: 'Servicios del hotel',
    title: ['Experiencias.'],
    ctas: [
      { label: 'Ver experiencias', href: '#experiencias' },
      { label: 'Hablar con concierge', href: '#contacto' },
    ],
    meta: ['Bienestar', 'Ciudad', 'Gastronomía', 'Eventos'],
    tagline: ['Lo que pasa además de dormir:', 'dinos qué quieres vivir.'],
  },
  statement: {
    eyebrow: 'A tu medida',
    text: 'Tu estadía no termina en la habitación: nuestro equipo arma el resto contigo.',
    body: 'Del aeropuerto a la mesa, del spa a la montaña. Cada experiencia se puede sumar a tu reserva o pedirse durante la estadía con nuestro concierge.',
  },
  list: {
    eyebrow: 'Experiencias',
    title: ['Elige cómo', 'vivir Medellín.'],
    request: { label: 'Solicitar', href: '#contacto' },
    items: [
      {
        name: 'Spa & masajes',
        tag: 'Bienestar',
        text: 'Masajes relajantes, de tejido profundo y rituales con piedras calientes, en cabina o en tu habitación.',
        details: ['60 o 90 minutos', 'Individual o en pareja', 'Con cita previa'],
        image: img('pages/exp-2'),
      },
      {
        name: 'Traslados privados',
        tag: 'Llegada',
        text: 'Te recogemos en el aeropuerto y te llevamos a donde necesites, con conductor y vehículo privado.',
        details: ['Aeropuerto José María Córdova', 'Disponible 24 horas', 'Hasta 4 pasajeros'],
        image: img('pages/exp-3'),
      },
      {
        name: 'Medellín con guía',
        tag: 'Ciudad',
        text: 'Recorridos a pie y en vehículo por la ciudad y sus alrededores, con guías locales que la conocen de verdad.',
        details: ['Comuna 13 y centro', 'Guatapé y El Peñol', 'Fincas cafeteras'],
        image: img('pages/exp-4'),
      },
      {
        name: 'Cena privada',
        tag: 'Gastronomía',
        text: 'Un menú diseñado por nuestra cocina para una ocasión especial, en el restaurante, el rooftop o tu suite.',
        details: ['Menú de varios tiempos', 'Maridaje opcional', 'De 2 a 12 personas'],
        image: img('pages/exp-5'),
      },
      {
        name: 'Gimnasio',
        tag: 'Bienestar',
        text: 'Equipos de fuerza y cardio con luz natural, y entrenador personal si quieres mantener la rutina.',
        details: ['Abierto todos los días', 'Entrenador con reserva', 'Sin costo para huéspedes'],
        image: img('pages/exp-6'),
      },
      {
        name: 'Eventos & reuniones',
        tag: 'Eventos',
        text: 'Salones y terrazas para celebraciones, lanzamientos y reuniones de trabajo, con equipo técnico y catering.',
        details: ['Salones privados', 'Catering de Real Eatery', 'Coordinador dedicado'],
        image: img('pages/exp-7'),
      },
    ],
  },
  steps: {
    eyebrow: 'Cómo funciona',
    title: ['Tres pasos,', 'cero vueltas.'],
    items: [
      { title: 'Cuéntanos', text: 'Escríbenos antes de llegar o habla con concierge en el lobby.' },
      { title: 'Lo organizamos', text: 'Coordinamos horarios, transporte y reservas por ti.' },
      { title: 'Disfruta', text: 'Tú solo llegas. Todo se carga a tu habitación.' },
    ],
  },
  wide: pg('exp-8', 'Detalle del spa'),
  cta: {
    eyebrow: 'Concierge',
    aside: 'Todos los días',
    title: 'Diseñemos tu estadía.',
    marquee: 'Experiencias — The Charlee',
    button: { label: 'Escribir a concierge', href: '#contacto' },
    foot: 'Parque Lleras · Medellín',
  },
}

// /hotel
export const aboutPage = {
  hero: {
    image: img('pages/hotel-1'),
    eyebrow: 'Acerca de',
    title: ['El hotel.'],
    ctas: [
      { label: 'Nuestra historia', href: '#historia' },
      { label: 'Ver habitaciones', href: '/habitaciones' },
    ],
    meta: ['Hotel de diseño', 'Parque Lleras', 'El Poblado', 'Medellín'],
    tagline: ['Arte, diseño y hospitalidad', 'en un mismo edificio.'],
  },
  // Textos oficiales del hotel (tomados del sitio actual)
  statement: {
    eyebrow: 'The Charlee Hotel en Medellín',
    text: 'Durante 12 años, hemos sido un referente de prestigio y estilo en Medellín.',
    body: [
      'Ubicados en el sector El Poblado, una de las zonas más reconocidas de la ciudad a solo 2 calles de Provenza ofrecemos más que una estadía.',
      'Cada detalle está diseñado para brindar una experiencia única y memorable, a través de nuestro servicio personalizado.',
      'Descubre el encanto de The Charlee y vive Medellín de una manera inigualable.',
    ],
  },
  // Solo cifras que aparecen en los textos oficiales
  stats: [
    { value: 12, label: 'Años en Medellín' },
    { value: 42, label: 'Habitaciones' },
    { value: 2, label: 'Calles de Provenza' },
  ],
  // Banner (en el sitio actual es un video): cuando subas el video a public/videos, escribe su ruta en "video" y aparece el botón de play
  banner: {
    image: pg('hotel-4', 'Entrada de The Charlee Hotel'),
    video: null,
    title: 'The Charlee Hotel en Medellín',
    sub: 'A joyful stay',
  },
  history: {
    title: 'La historia de nuestro hotel.',
    eyebrow: 'El hotel Charlee',
    paragraphs: [
      'Inaugurado hace 12 años en el barrio El Poblado de Medellín, The Charlee nació con la visión de convertirse en un referente de hospitalidad en la ciudad. Desde sus inicios, The Charlee se distinguió por su diseño arquitectónico y su enfoque en ofrecer una experiencia memorable a sus huéspedes. Con 42 habitaciones, combina la amplitud y la iluminación natural con un estilo contemporáneo, creando un ambiente de confort y distinción.',
      'Ubicado en el corazón del Parque Lleras, The Charlee tiene proximidad a los mejores restaurantes, bares y tiendas de la ciudad, lo que les permite a los huéspedes explorar y disfrutar de todo lo que Medellín tiene para ofrecer.',
      'Además, tiene una oferta gastronómica de alcance internacional, donde su atención personalizada y ambiente exclusivo, lo han llevado a ser pionero en la promoción de la cultura local, integrando elementos artísticos y culturales en su diseño.',
    ],
  },
  offer: {
    title: 'The Charlee Hotel Medellín',
    intro: 'Haz de tu viaje la mejor experiencia de estilo de vida disfrutando de una amplia oferta en:',
    items: [
      { title: 'Cultura', text: 'Conéctate con la esencia de Medellín a través de exposiciones de arte, música en vivo y elementos culturales que enriquecen cada momento de tu estancia.' },
      { title: 'Arte, diseño y arquitectura', text: 'Espacios contemporáneos que fusionan elegancia y confort, creando ambientes sofisticados y acogedores en cada rincón del hotel.' },
      { title: 'Wellness', text: 'Experimenta un bienestar integral con nuestras instalaciones de fitness, tratamientos relajantes y espacios diseñados para tu total confort y rejuvenecimiento.' },
      { title: 'Gastronomía', text: 'Disfruta de experiencias culinarias excepcionales que destacan lo mejor de la cocina local e internacional, con sabores innovadores y un toque único.' },
    ],
  },
  location: {
    eyebrow: 'Ubicación',
    title: ['En el centro', 'de todo.'],
    text: 'Restaurantes, galerías, cafés y vida nocturna a pasos de la puerta. Y el resto de la ciudad, muy cerca.',
    image: pg('envy-7', 'Medellín desde el hotel'),
    address: 'Calle 9A #37-16 · El Poblado, Medellín',
    items: [
      { name: 'Parque Lleras', value: 'En la puerta' },
      { name: 'Provenza', value: '5 min a pie' },
      { name: 'Milla de Oro', value: '10 min en carro' },
      { name: 'Centro de Medellín', value: '20 min en carro' },
      { name: 'Aeropuerto José María Córdova', value: '40 min en carro' },
    ],
  },
  strip: {
    eyebrow: 'El edificio',
    title: ['Rincones de', 'The Charlee.'],
    images: [
      pg('hotel-1', 'Fachada y piscina'),
      pg('hotel-5', 'Pasillo'),
      pg('hotel-3', 'Obra en el lobby'),
      pg('hotel-8', 'Lounge'),
      pg('hotel-6', 'El letrero'),
      pg('hotel-2', 'Galería'),
    ],
  },
  links: {
    eyebrow: 'Sigue explorando',
    title: ['Todo pasa', 'bajo un mismo techo.'],
    items: [
      { label: 'Habitaciones', kicker: 'Dormir', href: '/habitaciones', image: img('rooms/spice-bedrooms-1') },
      { label: 'Real Eatery', kicker: 'Comer', href: '/restaurante', image: img('pages/resto-1') },
      { label: 'Envy Rooftop', kicker: 'Brindar', href: '/rooftop', image: img('pages/envy-1') },
    ],
  },
}

// /galeria
const g = (path, alt, cat) => ({ src: img(path), alt, cat })
export const galleryPage = {
  eyebrow: 'Galería',
  title: ['El hotel,', 'en imágenes.'],
  intro: 'Espacios, habitaciones, mesa y rooftop. Filtra por lo que quieras ver y toca cualquier foto para ampliarla.',
  filters: ['Todo', 'Hotel', 'Habitaciones', 'Rooftop', 'Restaurante', 'Experiencias'],
  items: [
    g('hero', 'Balcones del hotel', 'Hotel'),
    g('rooms/spice-bedrooms-1', 'Spice Bedrooms', 'Habitaciones'),
    g('pages/envy-1', 'Piscina del rooftop', 'Rooftop'),
    g('pages/resto-2', 'El pase de Real Eatery', 'Restaurante'),
    g('pages/hotel-2', 'Galería de arte', 'Hotel'),
    g('rooms/envy-3', 'Habitación Envy', 'Habitaciones'),
    g('pages/envy-4', 'Coctel de autor', 'Rooftop'),
    g('pages/exp-2', 'Spa & masajes', 'Experiencias'),
    g('pages/resto-1', 'El salón del restaurante', 'Restaurante'),
    g('rooms/doble-1', 'Habitación Doble', 'Habitaciones'),
    g('pages/hotel-4', 'Patio interior', 'Hotel'),
    g('pages/envy-9', 'Terraza al atardecer', 'Rooftop'),
    g('pages/resto-4', 'Salmón a la brasa', 'Restaurante'),
    g('rooms/king-1', 'Habitación King', 'Habitaciones'),
    g('pages/exp-5', 'Cena privada', 'Experiencias'),
    g('pages/envy-2', 'La barra de Envy', 'Rooftop'),
    g('pages/hotel-5', 'Pasillo', 'Hotel'),
    g('rooms/spice-bedrooms-4', 'Detalle de la Spice Bedrooms', 'Habitaciones'),
    g('pages/resto-9', 'La terraza', 'Restaurante'),
    g('pages/envy-5', 'Noche de DJ', 'Rooftop'),
    g('pages/exp-4', 'Medellín desde arriba', 'Experiencias'),
    g('rooms/envy-1', 'Suite Envy', 'Habitaciones'),
    g('pages/hotel-8', 'Lounge', 'Hotel'),
    g('pages/resto-7', 'Desayuno', 'Restaurante'),
    g('pages/envy-6', 'Hora azul en la piscina', 'Rooftop'),
    g('pages/exp-7', 'Salón de eventos', 'Experiencias'),
    g('rooms/doble-4', 'Baño de la Habitación Doble', 'Habitaciones'),
    g('pages/hotel-7', 'Salón del hotel', 'Hotel'),
  ],
}
