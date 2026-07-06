/**
 * Données FAQ du site, par langue.
 * Utilisées par app/[locale]/faq/page.tsx (affichage + schéma FAQPage).
 */

export interface FaqCategory {
  category: string;
  questions: { question: string; answer: string }[];
}

const FAQ_FR: FaqCategory[] = [
  {
    category: "L'agence Voyages Authentiques Maroc",
    questions: [
      {
        question: "Qu'est-ce qu'Voyages Authentiques Maroc ?",
        answer:
          "Voyages Authentiques Maroc est un opérateur touristique marocain agréé, spécialisé dans les circuits privés et en petits groupes à travers le Maroc. Nous proposons des expériences de voyage authentiques, alliant culture, aventure et confort.",
      },
      {
        question: 'Dans quelles langues travaillez-vous ?',
        answer:
          "Notre équipe travaille en français, anglais, espagnol et italien. Tous nos chauffeurs et guides parlent au minimum le français et l'anglais.",
      },
      {
        question: 'Êtes-vous un opérateur agréé ?',
        answer:
          'Oui, Voyages Authentiques Maroc est un opérateur touristique officiellement agréé au Maroc. Nous travaillons avec des guides locaux certifiés et des chauffeurs professionnels expérimentés.',
      },
      {
        question: 'Depuis quelles villes proposez-vous vos circuits ?',
        answer:
          'Nous pouvons vous prendre en charge depuis toutes les grandes villes du Maroc : Marrakech, Fès, Casablanca, Rabat, Tanger, Agadir. Les itinéraires peuvent débuter et se terminer dans des villes différentes selon votre programme de voyage.',
      },
    ],
  },
  {
    category: 'Réservation & prix',
    questions: [
      {
        question: 'Comment réserver un circuit ?',
        answer:
          "La réservation s'effectue en contactant notre équipe par e-mail, téléphone ou WhatsApp. Nous vous envoyons un devis personnalisé sous 24 heures. Un acompte est requis pour confirmer la réservation, le solde étant réglé à l'arrivée ou selon les modalités convenues.",
      },
      {
        question: 'Les prix sont-ils fixes ou sur devis ?',
        answer:
          'Toutes nos prestations sont proposées sur devis et sur mesure, en fonction de votre programme, du nombre de participants et de votre point de départ. Contactez-nous pour un devis personnalisé gratuit et sans engagement.',
      },
      {
        question: 'Quels moyens de paiement acceptez-vous ?',
        answer:
          "Nous acceptons le virement bancaire international et le paiement en espèces (EUR ou MAD). D'autres modalités peuvent être discutées lors de votre demande de réservation.",
      },
      {
        question: 'Un acompte est-il requis ?',
        answer:
          "Oui, un acompte est demandé pour confirmer votre réservation. Le montant et les modalités sont précisés dans votre devis. Le solde est généralement réglé à l'arrivée ou selon les termes convenus.",
      },
      {
        question: "Quelle est votre politique d'annulation ?",
        answer:
          "Les conditions d'annulation sont précisées dans chaque devis. En règle générale, plus l'annulation intervient tôt avant la date de départ, plus le remboursement de l'acompte est important. En cas d'imprévu, contactez-nous au plus vite : nous privilégions toujours le report de votre voyage sans frais plutôt que l'annulation.",
      },
    ],
  },
  {
    category: 'Les circuits',
    questions: [
      {
        question: 'Vos circuits sont-ils privés ou en groupe ?',
        answer:
          "Tous nos circuits sont privés : vous voyagez uniquement avec vos proches (famille, amis, couple), sans partager votre véhicule ou votre itinéraire avec d'autres voyageurs inconnus. Nous proposons également des circuits en petits groupes sur demande.",
      },
      {
        question: 'Les circuits sont-ils personnalisables ?',
        answer:
          'Oui, tous nos itinéraires sont adaptables selon votre rythme, vos envies et votre budget. Vous pouvez allonger ou raccourcir un circuit, modifier les étapes, changer les hébergements ou ajouter des activités. Contactez-nous pour un programme sur mesure.',
      },
      {
        question: 'Combien de personnes peut-on être dans un circuit privé ?',
        answer:
          'Nos circuits privés accueillent de 1 à 6 personnes dans un véhicule standard (berline ou SUV climatisé). Pour les groupes plus importants (7 à 16 personnes), nous disposons de minibus. Contactez-nous pour votre configuration.',
      },
      {
        question: "Quelle est la durée minimale d'un circuit ?",
        answer:
          'Nous proposons des excursions à la journée (1 jour) ainsi que des circuits de 2 à 10 jours. La durée est entièrement adaptable à votre emploi du temps.',
      },
    ],
  },
  {
    category: 'Le désert de Merzouga (Erg Chebbi)',
    questions: [
      {
        question: 'La nuit dans le désert est-elle sous tente ou en camp ?',
        answer:
          'Nos nuits dans le désert se déroulent en camp berbère : tentes équipées de lits confortables, salle de bain partagée ou privative selon le camp. Nous proposons aussi des camps de luxe (Beldi Luxury Camp) pour les voyageurs recherchant plus de confort.',
      },
      {
        question: 'La balade à dromadaire est-elle incluse ?',
        answer:
          'Oui, la balade à dromadaire au coucher et au lever du soleil (1 dromadaire par personne) est incluse dans tous nos circuits incluant une nuit à Merzouga.',
      },
      {
        question: 'Quelle est la meilleure période pour visiter le désert ?',
        answer:
          "Les meilleures périodes pour le désert de Merzouga sont l'automne (septembre à novembre) et le printemps (mars à mai) : températures agréables de jour comme de nuit. L'été peut être très chaud (40°C+). L'hiver est froid la nuit mais les journées restent douces et ensoleillées.",
      },
      {
        question: 'Y a-t-il du Wi-Fi dans le camp désert ?',
        answer:
          "La couverture réseau dans le désert est limitée. Certains camps disposent d'un accès Wi-Fi basique, mais la connexion est généralement faible. Nous conseillons de considérer la nuit dans le désert comme une opportunité de déconnexion totale.",
      },
    ],
  },
  {
    category: 'Hébergements',
    questions: [
      {
        question: "Quel type d'hébergement proposez-vous ?",
        answer:
          "Nous travaillons avec une sélection de riads de charme dans les médinas, d'hôtels confortables dans les villes, de maisons d'hôtes berbères dans la montagne et de camps désert pour les nuits à Merzouga. Tous les hébergements sont sélectionnés pour leur qualité et leur authenticité.",
      },
      {
        question: 'Le petit-déjeuner est-il inclus ?',
        answer:
          "Oui, le petit-déjeuner est inclus dans toutes nos nuits d'hébergement. Les dîners sont inclus dans les camps désert et parfois dans d'autres étapes selon le circuit choisi. Les déjeuners sont généralement libres (non inclus) pour vous laisser la liberté de découvrir les restaurants locaux.",
      },
    ],
  },
  {
    category: 'Transport',
    questions: [
      {
        question: 'Quel type de véhicule utilisez-vous ?',
        answer:
          'Nous utilisons des véhicules confortables et climatisés : berlines (Toyota Camry, Mercedes ou similaire) pour les petits groupes, 4×4 pour les pistes et zones désertiques, minibus pour les groupes de 7 à 16 personnes. Tous nos véhicules sont récents, bien entretenus et équipés de la climatisation.',
      },
      {
        question: 'Le carburant est-il inclus dans le tarif ?',
        answer: 'Oui, le carburant est toujours inclus dans le tarif de nos circuits privés.',
      },
      {
        question: 'Proposez-vous des transferts aéroport ?',
        answer:
          'Oui, les transferts aéroport (arrivée et départ) sont inclus dans certains de nos circuits (comme le grand tour 9 jours). Pour les autres circuits, ils peuvent être ajoutés sur demande. Précisez vos horaires de vol lors de votre demande de devis.',
      },
    ],
  },
];

const FAQ_EN: FaqCategory[] = [
  {
    category: 'The Authentic Morocco Tours agency',
    questions: [
      {
        question: 'What is Authentic Morocco Tours?',
        answer:
          'Authentic Morocco Tours is a licensed Moroccan tour operator specialising in private and small-group tours across Morocco. We offer authentic travel experiences combining culture, adventure and comfort.',
      },
      {
        question: 'Which languages do you work in?',
        answer:
          'Our team works in French, English, Spanish and Italian. All our drivers and guides speak at least French and English.',
      },
      {
        question: 'Are you a licensed operator?',
        answer:
          'Yes, Authentic Morocco Tours is an officially licensed tour operator in Morocco. We work with certified local guides and experienced professional drivers.',
      },
      {
        question: 'From which cities do you offer your tours?',
        answer:
          'We can pick you up from all major Moroccan cities: Marrakech, Fes, Casablanca, Rabat, Tangier, Agadir. Itineraries can start and end in different cities depending on your travel plans.',
      },
    ],
  },
  {
    category: 'Booking & prices',
    questions: [
      {
        question: 'How do I book a tour?',
        answer:
          'Booking is done by contacting our team by email, phone or WhatsApp. We send you a personalised quote within 24 hours. A deposit is required to confirm the booking, with the balance paid on arrival or as agreed.',
      },
      {
        question: 'Are prices fixed or quoted individually?',
        answer:
          'All our services are quoted individually and tailor-made, depending on your programme, the number of participants and your departure point. Contact us for a free, no-obligation personalised quote.',
      },
      {
        question: 'Which payment methods do you accept?',
        answer:
          'We accept international bank transfers and cash payments (EUR or MAD). Other arrangements can be discussed when you request your booking.',
      },
      {
        question: 'Is a deposit required?',
        answer:
          'Yes, a deposit is required to confirm your booking. The amount and terms are specified in your quote. The balance is usually paid on arrival or as agreed.',
      },
      {
        question: 'What is your cancellation policy?',
        answer:
          'Cancellation terms are specified in each quote. As a general rule, the earlier you cancel before the departure date, the larger the refund of your deposit. In case of unforeseen events, contact us as soon as possible: we always favour rescheduling your trip free of charge rather than cancelling.',
      },
    ],
  },
  {
    category: 'The tours',
    questions: [
      {
        question: 'Are your tours private or in groups?',
        answer:
          'All our tours are private: you travel only with your loved ones (family, friends, partner), without sharing your vehicle or itinerary with strangers. We also offer small-group tours on request.',
      },
      {
        question: 'Can the tours be customised?',
        answer:
          'Yes, all our itineraries can be adapted to your pace, wishes and budget. You can extend or shorten a tour, modify stops, change accommodation or add activities. Contact us for a tailor-made programme.',
      },
      {
        question: 'How many people can join a private tour?',
        answer:
          'Our private tours accommodate 1 to 6 people in a standard vehicle (air-conditioned sedan or SUV). For larger groups (7 to 16 people), we have minibuses. Contact us for your configuration.',
      },
      {
        question: 'What is the minimum tour length?',
        answer:
          'We offer day trips (1 day) as well as tours of 2 to 10 days. The duration is fully adaptable to your schedule.',
      },
    ],
  },
  {
    category: 'The Merzouga desert (Erg Chebbi)',
    questions: [
      {
        question: 'Is the desert night in a tent or a camp?',
        answer:
          'Our desert nights take place in a Berber camp: tents equipped with comfortable beds, shared or private bathroom depending on the camp. We also offer luxury camps (Beldi Luxury Camp) for travellers seeking more comfort.',
      },
      {
        question: 'Is the camel ride included?',
        answer:
          'Yes, the camel ride at sunset and sunrise (1 camel per person) is included in all our tours featuring a night in Merzouga.',
      },
      {
        question: 'When is the best time to visit the desert?',
        answer:
          'The best times for the Merzouga desert are autumn (September to November) and spring (March to May): pleasant temperatures day and night. Summer can be very hot (40°C+). Winter nights are cold but days remain mild and sunny.',
      },
      {
        question: 'Is there Wi-Fi at the desert camp?',
        answer:
          'Network coverage in the desert is limited. Some camps have basic Wi-Fi access, but the connection is generally weak. We recommend treating the desert night as an opportunity for a complete digital detox.',
      },
    ],
  },
  {
    category: 'Accommodation',
    questions: [
      {
        question: 'What type of accommodation do you offer?',
        answer:
          'We work with a selection of charming riads in the medinas, comfortable hotels in the cities, Berber guesthouses in the mountains and desert camps for nights in Merzouga. All accommodation is selected for its quality and authenticity.',
      },
      {
        question: 'Is breakfast included?',
        answer:
          'Yes, breakfast is included with every night of accommodation. Dinners are included at desert camps and sometimes at other stops depending on the chosen tour. Lunches are generally free (not included) so you can discover local restaurants.',
      },
    ],
  },
  {
    category: 'Transport',
    questions: [
      {
        question: 'What type of vehicle do you use?',
        answer:
          'We use comfortable, air-conditioned vehicles: sedans (Toyota Camry, Mercedes or similar) for small groups, 4x4s for tracks and desert areas, minibuses for groups of 7 to 16 people. All our vehicles are recent, well maintained and air-conditioned.',
      },
      {
        question: 'Is fuel included in the price?',
        answer: 'Yes, fuel is always included in the price of our private tours.',
      },
      {
        question: 'Do you offer airport transfers?',
        answer:
          'Yes, airport transfers (arrival and departure) are included in some of our tours (such as the 9-day grand tour). For other tours, they can be added on request. Please specify your flight times when requesting your quote.',
      },
    ],
  },
];

const FAQ_ES: FaqCategory[] = [
  {
    category: 'La agencia Viajes Auténticos Marruecos',
    questions: [
      {
        question: '¿Qué es Viajes Auténticos Marruecos?',
        answer:
          'Viajes Auténticos Marruecos es un operador turístico marroquí autorizado, especializado en tours privados y en grupos reducidos por todo Marruecos. Ofrecemos experiencias de viaje auténticas que combinan cultura, aventura y confort.',
      },
      {
        question: '¿En qué idiomas trabajáis?',
        answer:
          'Nuestro equipo trabaja en francés, inglés, español e italiano. Todos nuestros conductores y guías hablan como mínimo francés e inglés.',
      },
      {
        question: '¿Sois un operador autorizado?',
        answer:
          'Sí, Viajes Auténticos Marruecos es un operador turístico oficialmente autorizado en Marruecos. Trabajamos con guías locales certificados y conductores profesionales con experiencia.',
      },
      {
        question: '¿Desde qué ciudades ofrecéis vuestros tours?',
        answer:
          'Podemos recogerte en todas las grandes ciudades de Marruecos: Marrakech, Fez, Casablanca, Rabat, Tánger, Agadir. Los itinerarios pueden empezar y terminar en ciudades diferentes según tu plan de viaje.',
      },
    ],
  },
  {
    category: 'Reserva y precios',
    questions: [
      {
        question: '¿Cómo reservo un tour?',
        answer:
          'La reserva se realiza contactando con nuestro equipo por email, teléfono o WhatsApp. Te enviamos un presupuesto personalizado en 24 horas. Se requiere un depósito para confirmar la reserva, y el resto se paga a la llegada o según lo acordado.',
      },
      {
        question: '¿Los precios son fijos o con presupuesto?',
        answer:
          'Todos nuestros servicios se ofrecen con presupuesto y a medida, según tu programa, el número de participantes y tu punto de salida. Contáctanos para un presupuesto personalizado gratuito y sin compromiso.',
      },
      {
        question: '¿Qué métodos de pago aceptáis?',
        answer:
          'Aceptamos transferencia bancaria internacional y pago en efectivo (EUR o MAD). Otras modalidades pueden acordarse al solicitar tu reserva.',
      },
      {
        question: '¿Se requiere un depósito?',
        answer:
          'Sí, se solicita un depósito para confirmar tu reserva. El importe y las condiciones se detallan en tu presupuesto. El resto se paga generalmente a la llegada o según lo acordado.',
      },
      {
        question: '¿Cuál es vuestra política de cancelación?',
        answer:
          'Las condiciones de cancelación se detallan en cada presupuesto. Como norma general, cuanto antes se cancele respecto a la fecha de salida, mayor será el reembolso del depósito. En caso de imprevisto, contáctanos lo antes posible: siempre priorizamos reprogramar tu viaje sin coste en lugar de cancelarlo.',
      },
    ],
  },
  {
    category: 'Los tours',
    questions: [
      {
        question: '¿Vuestros tours son privados o en grupo?',
        answer:
          'Todos nuestros tours son privados: viajas únicamente con los tuyos (familia, amigos, pareja), sin compartir vehículo ni itinerario con desconocidos. También ofrecemos tours en grupos reducidos bajo petición.',
      },
      {
        question: '¿Se pueden personalizar los tours?',
        answer:
          'Sí, todos nuestros itinerarios se adaptan a tu ritmo, tus deseos y tu presupuesto. Puedes alargar o acortar un tour, modificar las etapas, cambiar los alojamientos o añadir actividades. Contáctanos para un programa a medida.',
      },
      {
        question: '¿Cuántas personas pueden participar en un tour privado?',
        answer:
          'Nuestros tours privados acogen de 1 a 6 personas en un vehículo estándar (berlina o SUV climatizado). Para grupos más grandes (7 a 16 personas), disponemos de minibuses. Contáctanos para tu configuración.',
      },
      {
        question: '¿Cuál es la duración mínima de un tour?',
        answer:
          'Ofrecemos excursiones de un día (1 día) así como tours de 2 a 10 días. La duración es totalmente adaptable a tu agenda.',
      },
    ],
  },
  {
    category: 'El desierto de Merzouga (Erg Chebbi)',
    questions: [
      {
        question: '¿La noche en el desierto es en tienda o en campamento?',
        answer:
          'Nuestras noches en el desierto transcurren en campamento bereber: jaimas equipadas con camas cómodas, baño compartido o privado según el campamento. También ofrecemos campamentos de lujo (Beldi Luxury Camp) para los viajeros que buscan más confort.',
      },
      {
        question: '¿El paseo en dromedario está incluido?',
        answer:
          'Sí, el paseo en dromedario al atardecer y al amanecer (1 dromedario por persona) está incluido en todos nuestros tours con noche en Merzouga.',
      },
      {
        question: '¿Cuál es la mejor época para visitar el desierto?',
        answer:
          'Las mejores épocas para el desierto de Merzouga son el otoño (septiembre a noviembre) y la primavera (marzo a mayo): temperaturas agradables de día y de noche. El verano puede ser muy caluroso (40°C+). El invierno es frío por la noche, pero los días siguen siendo suaves y soleados.',
      },
      {
        question: '¿Hay Wi-Fi en el campamento del desierto?',
        answer:
          'La cobertura de red en el desierto es limitada. Algunos campamentos disponen de Wi-Fi básico, pero la conexión suele ser débil. Recomendamos considerar la noche en el desierto como una oportunidad de desconexión total.',
      },
    ],
  },
  {
    category: 'Alojamientos',
    questions: [
      {
        question: '¿Qué tipo de alojamiento ofrecéis?',
        answer:
          'Trabajamos con una selección de riads con encanto en las medinas, hoteles confortables en las ciudades, casas de huéspedes bereberes en la montaña y campamentos del desierto para las noches en Merzouga. Todos los alojamientos están seleccionados por su calidad y autenticidad.',
      },
      {
        question: '¿El desayuno está incluido?',
        answer:
          'Sí, el desayuno está incluido en todas nuestras noches de alojamiento. Las cenas están incluidas en los campamentos del desierto y a veces en otras etapas según el tour elegido. Los almuerzos son generalmente libres (no incluidos) para dejarte la libertad de descubrir los restaurantes locales.',
      },
    ],
  },
  {
    category: 'Transporte',
    questions: [
      {
        question: '¿Qué tipo de vehículo utilizáis?',
        answer:
          'Utilizamos vehículos cómodos y climatizados: berlinas (Toyota Camry, Mercedes o similar) para grupos pequeños, 4x4 para pistas y zonas desérticas, minibuses para grupos de 7 a 16 personas. Todos nuestros vehículos son recientes, están bien mantenidos y equipados con aire acondicionado.',
      },
      {
        question: '¿El combustible está incluido en el precio?',
        answer: 'Sí, el combustible está siempre incluido en el precio de nuestros tours privados.',
      },
      {
        question: '¿Ofrecéis traslados al aeropuerto?',
        answer:
          'Sí, los traslados al aeropuerto (llegada y salida) están incluidos en algunos de nuestros tours (como el gran tour de 9 días). Para los demás tours, pueden añadirse bajo petición. Indica tus horarios de vuelo al solicitar tu presupuesto.',
      },
    ],
  },
];

const FAQ_BY_LOCALE: Record<string, FaqCategory[]> = {
  fr: FAQ_FR,
  en: FAQ_EN,
  es: FAQ_ES,
};

export function getFaqItems(locale: string): FaqCategory[] {
  return FAQ_BY_LOCALE[locale] ?? FAQ_FR;
}
