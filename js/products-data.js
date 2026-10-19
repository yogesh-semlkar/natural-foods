/**
 * Initial Organic & Natural Products Catalog
 * Includes weight variants, pricing, nutrition info, and farm purity stories.
 */
const INITIAL_PRODUCTS = [
  {
    id: "ghee-01",
    name: "A2 Bilona Desi Cow Ghee (Gir Cow)",
    hindiName: "पारंपरिक बिलोना देसी गाय का घी",
    category: "ghee",
    badge: "Bilona Method",
    badgeType: "badge-bilona",
    image: "assets/images/desi-ghee.jpg",
    rating: 4.9,
    reviewCount: 184,
    shortDesc: "Handcrafted from curd of grass-fed Gir cows using traditional wooden bilona churning.",
    purityStory: "Unlike commercial butter-boiled ghee, our ghee is made using the 5,000-year-old Vedic Bilona method. Whole curd from indigenous Gir cows is churned at sunrise with a bi-directional wooden bilona to separate makkhan, which is then slow-simmered on low flame. The result is golden, aromatic, and rich in natural butyric acid.",
    nutrition: {
      "Energy": "898 kcal",
      "Total Fat": "99.8g",
      "Saturated Fat": "64g",
      "A2 Beta-Casein": "100% Natural",
      "Preservatives": "0% (Zero)"
    },
    inStock: true,
    variants: [
      { weight: "500 ml", price: 899, originalPrice: 999, perUnit: "₹1,798/L" },
      { weight: "1 Litre", price: 1699, originalPrice: 1950, perUnit: "₹1,699/L", isPopular: true },
      { weight: "2 Litre", price: 3250, originalPrice: 3800, perUnit: "₹1,625/L" },
      { weight: "5 Litre", price: 7999, originalPrice: 9500, perUnit: "₹1,599/L" }
    ]
  },
  {
    id: "atta-01",
    name: "Stone-Ground Organic Multigrain Atta",
    hindiName: "पत्थर चक्की शुद्ध मल्टीग्रेन आटा",
    category: "atta",
    badge: "100% Organic",
    badgeType: "badge-organic",
    image: "assets/images/multigrain-atta.jpg",
    rating: 4.8,
    reviewCount: 216,
    shortDesc: "Slow stone-ground blend of Sharbati wheat, Bajra, Jowar, Ragi, Oats, and Chana.",
    purityStory: "Ground in traditional slow-speed emery stone chakkis to prevent heating and nutrient destruction. Packed with complete dietary fiber, wheat germ, and complex carbs. Keeps rotis exceptionally soft while supporting healthy digestion and stable sugar levels.",
    nutrition: {
      "Dietary Fiber": "12.4g / 100g",
      "Protein": "14.2g / 100g",
      "Carbohydrates": "68g / 100g",
      "Millet Composition": "40% Ancient Millets",
      "Bleaching Agents": "None (Unbleached)"
    },
    inStock: true,
    variants: [
      { weight: "1 kg", price: 95, originalPrice: 110, perUnit: "₹95/kg" },
      { weight: "2 kg", price: 185, originalPrice: 220, perUnit: "₹92.5/kg" },
      { weight: "5 kg", price: 445, originalPrice: 520, perUnit: "₹89/kg", isPopular: true },
      { weight: "10 kg", price: 849, originalPrice: 990, perUnit: "₹84.9/kg" }
    ]
  },
  {
    id: "atta-02",
    name: "Traditional Heirloom Khapli (Emmer) Atta",
    hindiName: "प्राचीन खापली (एमर) गेहूं का आटा",
    category: "atta",
    badge: "Ancient Heirloom",
    badgeType: "badge-organic",
    image: "assets/images/multigrain-atta.jpg",
    rating: 4.9,
    reviewCount: 98,
    shortDesc: "Ancient 10,000-year-old unhybridized wheat. Naturally low gluten index and diabetic friendly.",
    purityStory: "Khapli (Emmer wheat) is an ancient therapeutic grain mentioned in Ayurveda. It has twice the fiber of modern hybrid wheats and naturally low glycemic index, making it light on the gut and ideal for those with gluten sensitivities.",
    nutrition: {
      "Protein": "15.8g / 100g",
      "Dietary Fiber": "13.6g / 100g",
      "Glycemic Index": "Low (< 45)",
      "Iron": "4.2 mg / 100g"
    },
    inStock: true,
    variants: [
      { weight: "1 kg", price: 115, originalPrice: 135, perUnit: "₹115/kg" },
      { weight: "5 kg", price: 540, originalPrice: 650, perUnit: "₹108/kg", isPopular: true }
    ]
  },
  {
    id: "pulses-01",
    name: "Organic Unpolished Pulses (Toor, Moong & Chana)",
    hindiName: "बिना पॉलिश की शुद्ध देशी दालें",
    category: "pulses",
    badge: "Unpolished",
    badgeType: "badge-organic",
    image: "assets/images/organic-pulses.jpg",
    rating: 4.9,
    reviewCount: 142,
    shortDesc: "100% chemical-free and unpolished lentils with natural nutrition and aroma intact.",
    purityStory: "Commercial dals are treated with leather polish, water, and artificial luster. Our pulses are sourced directly from traditional organic farmers, naturally sun-dried, and milled without artificial polishing. You get authentic rich dal flavor and uncompromised protein.",
    nutrition: {
      "Protein": "22.5g / 100g",
      "Iron & Folate": "High",
      "Polish & Dyes": "Zero",
      "Chemical Pesticides": "Nil (Lab Tested)"
    },
    inStock: true,
    variants: [
      { weight: "1 kg (Toor Dal)", price: 185, originalPrice: 215, perUnit: "₹185/kg" },
      { weight: "1 kg (Moong Dal)", price: 175, originalPrice: 205, perUnit: "₹175/kg" },
      { weight: "3 kg Trio Pack (Toor + Moong + Chana)", price: 510, originalPrice: 625, perUnit: "₹170/kg", isPopular: true }
    ]
  },
  {
    id: "oil-01",
    name: "Wood-Pressed Yellow Mustard Oil (Kachi Ghani)",
    hindiName: "लकड़ी घानी पीली सरसों का शुद्ध तेल",
    category: "oils",
    badge: "Wood Pressed",
    badgeType: "badge-bilona",
    image: "assets/images/cold-pressed-oil.jpg",
    rating: 4.8,
    reviewCount: 89,
    shortDesc: "Extracted in traditional wooden expeller (Kolhu) at low temperature without chemical refining.",
    purityStory: "Cold-pressed in slow-moving wooden churners under 38°C to retain all natural antioxidants, vitamin E, and optimal Omega-3 to Omega-6 ratios. Unfiltered and raw with distinct natural yellow mustard pungency.",
    nutrition: {
      "Monounsaturated Fat": "65%",
      "Omega-3 Fatty Acids": "High",
      "Hexane Solvent": "0% (Zero chemical extraction)",
      "Trans Fat": "0g"
    },
    inStock: true,
    variants: [
      { weight: "500 ml", price: 185, originalPrice: 210, perUnit: "₹370/L" },
      { weight: "1 Litre", price: 340, originalPrice: 395, perUnit: "₹340/L", isPopular: true },
      { weight: "5 Litre Tin", price: 1590, originalPrice: 1850, perUnit: "₹318/L" }
    ]
  },
  {
    id: "sweetener-01",
    name: "Raw Himalayan Forest Honey & Desi Khand",
    hindiName: "कच्चा जंगली शहद और देसी खांड",
    category: "sweeteners",
    badge: "NMR Tested",
    badgeType: "badge-organic",
    image: "assets/images/natural-sweeteners.jpg",
    rating: 4.9,
    reviewCount: 112,
    shortDesc: "Unpasteurized wild multifloral forest honey and sulfur-free traditional Desi Khand.",
    purityStory: "Harvested ethically by traditional tribal beekeepers in the Himalayan foothills. Never heated above hive temperature, preserving all live enzymes, pollen, and propolis. NMR tested to verify zero added sugar syrup or corn starch.",
    nutrition: {
      "Enzyme Activity": "Active Diastase & Invertase",
      "Added Sugar / Adulterants": "0% (NMR Verified)",
      "Sulfur in Khand": "Zero",
      "Minerals": "Potassium, Magnesium, Zinc"
    },
    inStock: true,
    variants: [
      { weight: "400g Honey", price: 399, originalPrice: 460, perUnit: "₹997/kg" },
      { weight: "1kg Desi Khand", price: 125, originalPrice: 150, perUnit: "₹125/kg" },
      { weight: "Combo (400g Honey + 1kg Khand)", price: 499, originalPrice: 610, perUnit: "Best Value", isPopular: true }
    ]
  }
];
