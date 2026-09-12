/**
 * AKASIA - Base de Datos Central del Sitio
 * Toda la información de la web se configura directamente desde este archivo:
 *  - Teléfono de WhatsApp
 *  - Disponibilidad de cada collar (isSold: true / false)
 *  - Precios, medidas y fotos
 */

const DEFAULT_CONFIG = {
  brandName: "AKASIA",
  instagramHandle: "ak4sia_",
  instagramUrl: "https://www.instagram.com/ak4sia_/",
  // Número de WhatsApp receptor de pedidos (con código de país, sin espacios ni '+')
  whatsappNumber: "5491123992993",
  currency: "$",
  defaultPrice: "35.000",
  metaTitle: "AKASIA • Joyería de Autor & Piezas Únicas",
  metaDescription: "Piezas de joyería únicas hechas a mano. Estética 90s grunge-luxe, perlas barrocas, cadenas y dijes de autor. Catálogo exclusivo."
};

/**
 * ============================================================================
 * CONFIGURACIÓN DEL BANNER PRINCIPAL (PÁGINA PRINCIPAL)
 * ============================================================================
 * Puedes agregar o quitar rutas de fotos aquí libremente.
 * El banner superior se adapta AUTOMÁTICAMENTE a la cantidad de fotos que pongas
 * (sean 2, 5, 8 o cualquier cantidad), generando los slides y puntos de navegación.
 */
const MAIN_BANNER_IMAGES = [
  "assets/Banner Principal/banner-1.png",
  "assets/Banner Principal/banner-2.png",
  "assets/Banner Principal/banner-3.png",
  "assets/Banner Principal/banner-4.png",
  "assets/Banner Principal/banner-5.png"
];

/**
 * ============================================================================
 * CONFIGURACIÓN DE LOS BOTONES / TARJETAS DINÁMICAS DE DROPS (PÁGINA PRINCIPAL)
 * ============================================================================
 * Puedes agregar o quitar fotos libremente dentro de 'images' para cada Drop.
 * Cada botón se adapta AUTOMÁTICAMENTE a la cantidad de fotos que pongas
 * (sean más o menos de las actuales), calculando la rotación y los indicadores.
 */
const DROPS_PORTAL_CONFIG = [
  {
    id: "drop-1",
    title: "DROP 1",
    subtitle: "",
    badge: "DISPONIBLE",
    badgeType: "available", // 'available' o 'coming-soon'
    buttonText: "EXPLORAR DROP 1",
    url: "drop-1.html",
    // Fotos dinámicas que rotan en la tarjeta del Drop 1 (dentro de assets/Botones Drops/Drop 1/):
    images: [
      "assets/Botones Drops/Drop 1/BotonDrop1-1.png",
      "assets/Botones Drops/Drop 1/BotonDrop1-2.png",
      "assets/Botones Drops/Drop 1/BotonDrop1-3.png",
      "assets/Botones Drops/Drop 1/BotonDrop1-4.png",
      "assets/Botones Drops/Drop 1/BotonDrop1-5.png"
    ]
  },
  {
    id: "drop-2",
    title: "DROP 2",
    subtitle: "",
    badge: "PRÓXIMAMENTE",
    badgeType: "coming-soon",
    buttonText: "COMING SOON DROP 2",
    url: "drop-2.html",
    // Fotos dinámicas que rotan en la tarjeta del Drop 2 (dentro de assets/Botones Drops/Drop 2/):
    images: [
      "assets/Botones Drops/Drop 2/BotonDrop2-1.png",
      "assets/Botones Drops/Drop 2/BotonDrop2-2.png",
      "assets/Botones Drops/Drop 2/BotonDrop2-3.png"
    ]
  }
];

const NECKLACES_DATA = [
  {
    id: "artemisa",
    name: "ARTEMISA",
    length: "40 cm",
    diameter: "12,75 cm",
    price: "36.000",
    isSold: false,
    flatImage: "assets/collares/Drop 1/Artemisa/ArtemisaPrincipal.png",
    wornImage: "assets/collares/Drop 1/Artemisa/ArtemisaModelo.png"
  },
  {
    id: "calipso",
    name: "CALIPSO",
    length: "50 cm",
    diameter: "15,92 cm",
    price: "33.000",
    isSold: true,
    flatImage: "assets/collares/Drop 1/Calipso/CalipsoPrincipal.png",
    wornImage: "assets/collares/Drop 1/Calipso/CalipsoModelo.png"
  },
  {
    id: "ceres",
    name: "CERES",
    length: "70 cm",
    diameter: "22,28 cm",
    price: "42.000",
    isSold: false,
    flatImage: "assets/collares/Drop 1/Ceres/CeresPrincipal.png",
    wornImage: "assets/collares/Drop 1/Ceres/CeresModelo.png"
  },
  {
    id: "daga",
    name: "DAGA",
    length: "50 cm",
    diameter: "15,92 cm",
    price: "38.000",
    isSold: false,
    flatImage: "assets/collares/Drop 1/Daga/DagaPrincipal.png",
    wornImage: "assets/collares/Drop 1/Daga/DagaModelo.png"
  },
  {
    id: "dione",
    name: "DIONE",
    length: "40 cm",
    diameter: "12,75 cm",
    price: "35.000",
    isSold: false,
    flatImage: "assets/collares/Drop 1/Dione/DionePrincipal.png",
    wornImage: "assets/collares/Drop 1/Dione/DioneModelo.png"
  },
  {
    id: "frida",
    name: "FRIDA",
    length: "40 cm",
    diameter: "12,75 cm",
    price: "36.000",
    isSold: false,
    flatImage: "assets/collares/Drop 1/Frida/FridaPrincipal.png",
    wornImage: "assets/collares/Drop 1/Frida/FridaModelo.png"
  },
  {
    id: "gaia",
    name: "GAIA",
    length: "70 cm",
    diameter: "22,28 cm",
    price: "44.000",
    isSold: false,
    flatImage: "assets/collares/Drop 1/Gaia/GaiaPrincipal.png",
    wornImage: "assets/collares/Drop 1/Gaia/GaiaModelo.png"
  },
  {
    id: "hestia",
    name: "HESTIA",
    length: "40 cm",
    diameter: "12,75 cm",
    price: "35.000",
    isSold: false,
    flatImage: "assets/collares/Drop 1/Hestia/HestiaPrincipal.png",
    wornImage: "assets/collares/Drop 1/Hestia/HestiaModelo.png"
  },
  {
    id: "isis",
    name: "ISIS",
    length: "35 cm",
    diameter: "11,15 cm",
    price: "32.000",
    isSold: false,
    flatImage: "assets/collares/Drop 1/Isis/IsisPrincipal.png",
    wornImage: "assets/collares/Drop 1/Isis/IsisModelo.png"
  },
  {
    id: "marija",
    name: "MARIJA",
    length: "60 cm",
    diameter: "19,00 cm",
    price: "39.000",
    isSold: false,
    flatImage: "assets/collares/Drop 1/Marija/MarijaPrincipal.png",
    wornImage: "assets/collares/Drop 1/Marija/MarijaModelo.png"
  },
  {
    id: "rhea",
    name: "RHEA",
    length: "40 cm",
    diameter: "12,75 cm",
    price: "37.000",
    isSold: false,
    flatImage: "assets/collares/Drop 1/Rhea/RheaPrincipal.png",
    wornImage: "assets/collares/Drop 1/Rhea/RheaModelo.png"
  },
  {
    id: "vesna",
    name: "VESNA",
    length: "40 cm",
    diameter: "12,75 cm",
    price: "36.000",
    isSold: false,
    flatImage: "assets/collares/Drop 1/Vesna/VesnaPrincipal.png",
    wornImage: "assets/collares/Drop 1/Vesna/VesnaModelo.png"
  },
  {
    id: "vesta",
    name: "VESTA",
    length: "40 cm",
    diameter: "12,75 cm",
    price: "37.000",
    isSold: false,
    flatImage: "assets/collares/Drop 1/Vesta/VestaPrincipal.png",
    wornImage: "assets/collares/Drop 1/Vesta/VestaModelo.png"
  }
];

const LOOKBOOK_GALLERY = [];

// Exponer en el objeto global (compatible con file:// y servidores web)
window.DEFAULT_CONFIG = DEFAULT_CONFIG;
window.MAIN_BANNER_IMAGES = MAIN_BANNER_IMAGES;
window.DROPS_PORTAL_CONFIG = DROPS_PORTAL_CONFIG;
window.NECKLACES_DATA = NECKLACES_DATA;
window.LOOKBOOK_GALLERY = LOOKBOOK_GALLERY;
