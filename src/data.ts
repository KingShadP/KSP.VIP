import { Product } from './types';

export const PRODUCTS: Product[] = [
  // --- GIRAGON COLLECTION (Flagship) ---
  {
    id: 'giragon-jersey',
    name: 'Giragon Insignia Cloaked Jersey',
    price: 185.00,
    collection: 'giragon',
    image: '/01_a_stylized_fashion_product_portrait_studio_image.png', // Classic dark t-shirt
    description: 'An uncompromising 420GSM heavy structured cotton jersey featuring a sculptural high-density matte black puff imprint of the Giraffagon coat of arms. Cleanly finished in deep charcoal voids with a double-folded neckline.',
    color: 'Void Charcoal',
    edition: 'Edition of 100 / Sealed Legacy',
    materials: ['100% Giza 45 Organic Combed Cotton', 'Sculptural silicone-polymer seal', '420GSM ultra-dense ribbing'],
    shipping: 'Ships within 48 hours in a signature lead-lined, vacuum-sealed black structural case.',
    badge: 'Limited Series'
  },
  {
    id: 'heraldry-longsleeve',
    name: 'Heraldry Crest Compression Long Sleeve',
    price: 240.00,
    collection: 'giragon',
    image: '/02_bold_confidence_in_dynamic_motion.png', // Minimalist long sleeve
    description: 'An anatomically paneled compression top engineered in raw oxblood-dyed technical thread. Features distressed jacquard venting across the shoulder blades with a gold-leaf hand-pressed lineage mark.',
    color: 'Raw Oxblood & Ash',
    edition: 'Edition of 75 / Sovereign Release',
    materials: ['70% Mercerized Swiss Cotton', '30% Fine Gauge Elastane', 'Foil-pressed gold pigment'],
    shipping: 'Ships in custom static-shielded structural shipping vault.',
    badge: 'Exclusive Issue'
  },
  {
    id: 'ascendant-longsleeve',
    name: 'Ascendant Linear Armour Sleeve',
    price: 265.00,
    collection: 'giragon',
    image: '/03_bold_fashion_with_motion_blur_effect.png', // Textured black long sleeve
    description: 'A structural double-knit heavy long-sleeve utilizing precise geometric seams. Embedded with an unburnished gold-alloy micro-insignia along the cuffs, showcasing the finality of linear minimalism.',
    color: 'Platinum Obsidian',
    edition: 'Edition of 50 / Atelier Verified',
    materials: ['100% High-Twist Combed Cotton', 'Solid unburnished gold-alloy cuffs', 'Double-locked industrial seams'],
    shipping: 'Ships next-day with signed Certificate of Provenance.',
    badge: 'Sovereign Piece'
  },

  // --- KSP COLLECTION (Core Identity) ---
  {
    id: 'atelier-shorts',
    name: 'Atelier French Terry Drop Shorts',
    price: 210.00,
    collection: 'ksp',
    image: '/05_cinematic_portrait_with_motion_blur_effect.png', // Premium heavy shorts
    description: 'Loopback cotton fleece shorts with an elongated drop-crotch and architectural paneling. Secured by hand-braided cords finished with solid sterling silver aglets and laser-etched KSP monogram.',
    color: 'Soot Black',
    edition: 'Permanent Atelier Core',
    materials: ['480GSM Heavy French Terry Fleece', 'Solid Sterling Silver hardware', 'Dual hand-welded back cavities'],
    shipping: 'Ships in custom linen garment bag and rigid cedar presentation case.',
    badge: 'Atelier Core'
  },
  {
    id: 'lineage-joggers',
    name: 'Lineage Modular Lounge Pant',
    price: 295.00,
    collection: 'ksp',
    image: '/06_confident_style_in_motion_blur.png', // Male joggers/streetwear look
    description: 'Sculpted lounge pants with structural knee articulation and hidden magnetic seams. Embellished with the subtle jacquard-woven crest of the Giragon lineage.',
    color: 'Carbon Obsidian',
    edition: 'Permanent Atelier Core',
    materials: ['85% Heavy Cotton Fleece', '15% High-Tensile Tech Fibers', 'Water-resistant magnetic side-slits'],
    shipping: 'Ships in an archival linen garment dustbag.',
    badge: 'Core Restock'
  },
  {
    id: 'dynasty-crewneck',
    name: 'Dynasty Heavyweight Armor Sweater',
    price: 480.00,
    collection: 'ksp',
    image: '/07_dynamic_fashion_in_motion.png', // Luxury dark crewneck
    description: 'A monument of architectural shape. Features heavy horizontal-grain reverse panels to prevent collapse of the structural silhouette. Finished with cashmere-soft interior loops and a high-density embossed chest moniker.',
    color: 'Royal Oxblood Void',
    edition: 'Atelier Dynasty Release',
    materials: ['90% Extra-Fine Mercerized Cotton', '10% Cashmere Blend', '550GSM Ultra-dense knit'],
    shipping: 'Encased in a custom carbon-alloy frame presentation box.',
    badge: 'Atelier Premium'
  },
  {
    id: 'signature-script-tee',
    name: 'Sovereign Signature Crest Tee',
    price: 135.00,
    collection: 'ksp',
    image: '/11_styled_motion_blur_fashion_portrait.png', // Black luxury tee
    description: 'The foundation of the daily uniform. Cleanly structured shoulder line with hand-threaded platinum embroidery across the left collarbone. Heavyweight drape with high-side lateral slits.',
    color: 'Matte Asphalt',
    edition: 'Atelier Core Base',
    materials: ['100% Peruvian Sea Island Cotton', '250GSM refined high-thread weave', 'Pure silk-thread collar embroidery'],
    shipping: 'Ships next business day.',
    badge: 'Atelier Essential'
  },

  // --- LEGACY COLLECTION (Historic, dated, some locked) ---
  {
    id: 'crest-ring',
    name: 'Solid Platinum & Oxblood Coral Signet',
    price: 1250.00,
    collection: 'museum',
    image: '/08_modern_dragon_blueprint_in_motion.png', // Signet ring detail
    description: 'A massive sculptural hand-cast solid platinum ring set with an hand-carved oxblood-red Mediterranean coral seal. Individually numbered and sulfur-etched to establish an ancient, museum-grade patina.',
    color: 'Aged Platinum & Oxblood Coral',
    edition: 'Release 001 / Year 2024 / Limited 12',
    materials: ['Solid .950 Platinum', 'Hand-carved premium Mediterranean coral', 'Acid-etched structural band'],
    shipping: 'Ships via secure armored carrier. Includes certified microchip of provenance.',
    badge: 'Vaulted 001'
  },
  {
    id: 'dsm-vest',
    name: 'Atelier Kevlar & Black Marble Chest Rig',
    price: 1450.00,
    collection: 'museum',
    image: '/black%20marble%20gallery%20with%20sculptural%20jacket.png', // Avant-garde vest look
    description: 'A strictly protective utility body rig constructed with a black-marble printed aramid ballistic core. Perfected with modular leather harnesses and secure heavy matte-black steel buckles.',
    color: 'Black Marble & Matte Steel',
    edition: 'Release 002 / Year 2024 / Vaulted',
    materials: ['Genuine DuPont Kevlar core', 'Glove-tanned calfskin leather harness', 'Forged steel quick-release buckles'],
    shipping: 'Vault Item: Locked. Access granted solely to verified tier-1 ledger holders.',
    isSealed: true,
    releaseDate: 'Vaulted May 2024',
    badge: 'Locked'
  },
  {
    id: 'sovereign-coat',
    name: 'Obsidian Silk-Wool Cleric Cloak',
    price: 1950.00,
    collection: 'museum',
    image: '/09_moody_fashion_portrait_with_motion_blur.png', // Overcoat photo
    description: 'The definitive outerwear monument. A double-layer floor-length heavy duster coat featuring an structural, enveloping hood, hidden weapon-slits, and magnetic forearm snaps. Pure windproof elegance.',
    color: 'Obsidian Void',
    edition: 'Release 003 / Year 2025 / Locked',
    materials: ['70% Italian Merino Wool', '30% Mulberry Silk', 'Rare horn button structural pillars'],
    shipping: 'Vault Item: Locked. Requires secondary clearance or biometric vault token.',
    isSealed: true,
    releaseDate: 'Locked Legacy',
    badge: 'Locked'
  },
  {
    id: 'dynasty-trench',
    name: 'Oxblood Cashmere Architectural Overcoat',
    price: 2450.00,
    collection: 'museum',
    image: '/12_studio_portrait_with_a_single_male_subject_against.png', // Trench coat
    description: 'A towering double-breasted overcoat tailored in pure high-weight raw virgin cashmere. Features an extreme dropped shoulder posture, premium dark-red silk-satin internal linings, and heavy internal security pockets.',
    color: 'Royal Oxblood',
    edition: 'Release 004 / Year 2025 / Locked',
    materials: ['100% Organic Mongolian Virgin Cashmere', '100% Pure heavy silk-satin backing', 'Laser-carved carbon buttons'],
    shipping: 'Vault Item: Locked. Clearance Level 3 required.',
    isSealed: true,
    releaseDate: 'Locked Legacy',
    badge: 'Locked'
  }
];

export const CONCIERGE_RESPONSES: Record<string, string> = {
  welcome: "Welcome to the sovereign vault of KingShadP. I am the digital caretaker of the collection. How shall we curate your inheritance today?",
  materials: "Our raw materials are selected with architectural permanence in mind. The Giragon collection uses Giza 45 organic cotton combed to 420GSM, ensuring the garments never yield their structural drape. The KSP core items incorporate solid sterling silver hardware and premium loopback French terry. We build objects of permanence.",
  sizing: "To maintain the cold, imposing posture of our silhouettes, items are cut with deep drop-shoulders and structural back lines. Select your exact size to preserve this intended editorial drape. Do not downsize unless a conventional close-fit is required.",
  vault: "The Legacy collection secures previous seasonal dynasties. These items are strictly vaulted and sealed. Access requires verified cryptographic wallet clearance or digital physical-backed credentials.",
  shipping: "All objects are sealed inside vacuum-shrunk static barriers, housed within signature unpolished titanium-finish structural presentation boxes. Standard shipping is executed through bonded luxury couriers.",
  general: "I have transmitted your inquiry directly to the head of the KingShadP vault. Let me know which sovereign specimen you wish to inspect."
};
