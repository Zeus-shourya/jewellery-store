/*
  THE INVENTORY — every piece shown on the site lives in this file.

  These are SAMPLE pieces. Replace them with the store's real stock.

  Each item:
    id        stock code shown to the customer (must be unique)
    name      piece name
    cat       one of the category ids below
    metal     'gold' or 'silver'
    purity    '22K', '18K', '24K', '925', '999' ...
    weight    approximate weight in grams
    stones    optional — e.g. 'Ruby, kundan'
    desc      one or two sentences
    featured  true to show it on the home page
    price     optional number in rupees. Leave it out and the piece shows
              "Price on request" (usual for gold, which follows the daily rate)
    image     optional photo, e.g. 'assets/img/rajwada-set.jpg' (square works best).
              Without it the site draws an illustration from `art`.
    art       illustration settings: { type, variant, gem }
*/

window.CATEGORIES = [
  { id: 'sets',      label: 'Sets',              metal: 'gold',   art: { type: 'set', variant: 'choker', gem: 'ruby' } },
  { id: 'necklaces', label: 'Necklaces',         metal: 'gold',   art: { type: 'necklace', variant: 'haar', gem: 'emerald' } },
  { id: 'bracelets', label: 'Bracelets',         metal: 'silver', art: { type: 'bracelet', variant: 'tennis', gem: 'diamond' } },
  { id: 'bangles',   label: 'Bangles & Kadas',   metal: 'gold',   art: { type: 'bangle', variant: 'pair' } },
  { id: 'rings',     label: 'Rings',             metal: 'gold',   art: { type: 'ring', variant: 'solitaire', gem: 'diamond' } },
  { id: 'earrings',  label: 'Earrings',          metal: 'gold',   art: { type: 'earrings', variant: 'jhumka', gem: 'ruby' } },
  { id: 'chains',    label: 'Chains & Pendants', metal: 'silver', art: { type: 'pendant', variant: 'drop', gem: 'sapphire' } },
  { id: 'coins',     label: 'Coins & Bars',      metal: 'gold',   art: { type: 'coin', label: ['24K', '999'] } },
  { id: 'anklets',   label: 'Anklets',           metal: 'silver', art: { type: 'anklet' } }
];

window.CATALOG = [
  /* ------------------------------ GOLD ------------------------------ */
  { id: 'SR-G101', name: 'Rajwada Bridal Set', cat: 'sets', metal: 'gold', purity: '22K', weight: 86.4, stones: 'Ruby, kundan',
    featured: true, art: { type: 'set', variant: 'choker', gem: 'ruby' },
    desc: 'A broad kundan collar with ruby drops and matching jhumkas, made for the wedding day and kept for the next generation.' },

  { id: 'SR-G102', name: 'Rani Haar Set', cat: 'sets', metal: 'gold', purity: '22K', weight: 72.8, stones: 'Emerald',
    art: { type: 'set', variant: 'haar', gem: 'emerald' },
    desc: 'Two layered strands meeting at an emerald medallion, paired with chandbali earrings.' },

  { id: 'SR-G103', name: 'Temple Coin Necklace', cat: 'necklaces', metal: 'gold', purity: '22K', weight: 48.7, stones: 'Ruby',
    featured: true, art: { type: 'necklace', variant: 'temple', gem: 'ruby' },
    desc: 'A strand of hand-finished gold beads hung with five temple-style coin medallions.' },

  { id: 'SR-G104', name: 'Layered Bead Haar', cat: 'necklaces', metal: 'gold', purity: '22K', weight: 61.2, stones: 'Emerald',
    art: { type: 'necklace', variant: 'haar', gem: 'emerald' },
    desc: 'A long double strand with a carved medallion and a single emerald drop.' },

  { id: 'SR-G105', name: 'Kundan Choker', cat: 'necklaces', metal: 'gold', purity: '22K', weight: 54.0, stones: 'Sapphire, kundan',
    art: { type: 'necklace', variant: 'choker', gem: 'sapphire' },
    desc: 'A close-fitting collar set with blue stones and graduated drops.' },

  { id: 'SR-G106', name: 'Everyday Drop Necklace', cat: 'necklaces', metal: 'gold', purity: '18K', weight: 9.4, stones: 'Diamond',
    art: { type: 'necklace', variant: 'pendant', gem: 'diamond' },
    desc: 'A fine bead strand with one bright drop. Light enough to wear every day.' },

  { id: 'SR-G107', name: 'Classic Link Bracelet', cat: 'bracelets', metal: 'gold', purity: '22K', weight: 11.8,
    featured: true, art: { type: 'bracelet', variant: 'link' },
    desc: 'Solid oval links with a secure clasp. Simple, weighty and made to be worn daily.' },

  { id: 'SR-G108', name: 'Diamond Tennis Bracelet', cat: 'bracelets', metal: 'gold', purity: '18K', weight: 9.6, stones: 'Diamond',
    featured: true, art: { type: 'bracelet', variant: 'tennis', gem: 'diamond' },
    desc: 'An unbroken line of matched stones in a slim gold setting.' },

  { id: 'SR-G109', name: 'Ruby Charm Bracelet', cat: 'bracelets', metal: 'gold', purity: '22K', weight: 8.9, stones: 'Ruby',
    art: { type: 'bracelet', variant: 'charm', gem: 'ruby' },
    desc: 'A link bracelet carrying a gold heart and two ruby charms.' },

  { id: 'SR-G110', name: 'Antique Kada', cat: 'bangles', metal: 'gold', purity: '22K', weight: 42.0, stones: 'Ruby',
    featured: true, art: { type: 'bangle', variant: 'kada', gem: 'ruby' },
    desc: 'An open kada with engraved work and ruby-set ends.' },

  { id: 'SR-G111', name: 'Plain Bangles, Set of Four', cat: 'bangles', metal: 'gold', purity: '22K', weight: 48.0,
    art: { type: 'bangle', variant: 'stack' },
    desc: 'Four slim bangles, two plain and two engraved, to wear together or apart.' },

  { id: 'SR-G112', name: 'Engraved Bangle Pair', cat: 'bangles', metal: 'gold', purity: '22K', weight: 36.5,
    art: { type: 'bangle', variant: 'pair' },
    desc: 'A matched pair of broad bangles with a fine engraved pattern.' },

  { id: 'SR-G113', name: 'Solitaire Ring', cat: 'rings', metal: 'gold', purity: '18K', weight: 3.8, stones: 'Diamond',
    featured: true, art: { type: 'ring', variant: 'solitaire', gem: 'diamond' },
    desc: 'A single stone held high on a slim band. The classic engagement ring.' },

  { id: 'SR-G114', name: 'Three Stone Ruby Ring', cat: 'rings', metal: 'gold', purity: '22K', weight: 6.2, stones: 'Ruby',
    art: { type: 'ring', variant: 'trio', gem: 'ruby' },
    desc: 'A centre ruby flanked by two smaller stones on a rounded band.' },

  { id: 'SR-G115', name: 'Gents Signet Ring', cat: 'rings', metal: 'gold', purity: '22K', weight: 8.4, stones: 'Onyx',
    art: { type: 'ring', variant: 'signet', gem: 'onyx' },
    desc: 'A heavy oval signet with a black onyx face.' },

  { id: 'SR-G116', name: 'Emerald Eternity Band', cat: 'rings', metal: 'gold', purity: '18K', weight: 4.1, stones: 'Emerald',
    art: { type: 'ring', variant: 'band', gem: 'emerald' },
    desc: 'A row of small emeralds across the top of a polished band.' },

  { id: 'SR-G117', name: 'Ruby Jhumkas', cat: 'earrings', metal: 'gold', purity: '22K', weight: 14.5, stones: 'Ruby',
    featured: true, art: { type: 'earrings', variant: 'jhumka', gem: 'ruby' },
    desc: 'Domed jhumkas with a ruby stud and a fringe of gold beads.' },

  { id: 'SR-G118', name: 'Chandbali Earrings', cat: 'earrings', metal: 'gold', purity: '22K', weight: 18.2, stones: 'Emerald',
    art: { type: 'earrings', variant: 'chandbali', gem: 'emerald' },
    desc: 'Crescent chandbalis edged with emeralds and gold beads.' },

  { id: 'SR-G119', name: 'Halo Studs', cat: 'earrings', metal: 'gold', purity: '18K', weight: 2.9, stones: 'Diamond',
    art: { type: 'earrings', variant: 'stud', gem: 'diamond' },
    desc: 'A bright centre stone inside a beaded gold halo.' },

  { id: 'SR-G120', name: 'Rope Chain', cat: 'chains', metal: 'gold', purity: '22K', weight: 12.3,
    art: { type: 'chain', variant: 'rope' },
    desc: 'A twisted rope chain that catches the light from every side.' },

  { id: 'SR-G121', name: 'Figaro Chain', cat: 'chains', metal: 'gold', purity: '22K', weight: 18.6,
    art: { type: 'chain', variant: 'figaro' },
    desc: 'The long-and-short Figaro pattern in solid gold.' },

  { id: 'SR-G122', name: 'Heart Pendant with Chain', cat: 'chains', metal: 'gold', purity: '18K', weight: 4.6, stones: 'Ruby',
    art: { type: 'pendant', variant: 'heart', gem: 'ruby' },
    desc: 'A polished gold heart with a ruby centre on a fine chain.' },

  { id: 'SR-G123', name: 'Lotus Gold Coin, 10 g', cat: 'coins', metal: 'gold', purity: '24K', weight: 10.0,
    featured: true, art: { type: 'coin', label: ['24K', '999'] },
    desc: 'A 24 karat coin for gifting and saving, sealed with its purity certificate.' },

  { id: 'SR-G124', name: 'Gold Bar, 20 g', cat: 'coins', metal: 'gold', purity: '24K', weight: 20.0,
    art: { type: 'coin', variant: 'bar', label: ['FINE GOLD', '999.9', '20 g'] },
    desc: 'A 24 karat bar, the simplest way to hold gold.' },

  /* ----------------------------- SILVER ----------------------------- */
  { id: 'SR-S201', name: 'Oxidised Coin Set', cat: 'sets', metal: 'silver', purity: '925', weight: 96.0, stones: 'Sapphire',
    art: { type: 'set', variant: 'temple', gem: 'sapphire' },
    desc: 'A beaded silver necklace with coin medallions and matching drop earrings.' },

  { id: 'SR-S202', name: 'Silver Choker Set', cat: 'sets', metal: 'silver', purity: '925', weight: 78.5, stones: 'Emerald',
    art: { type: 'set', variant: 'choker', gem: 'emerald' },
    desc: 'A sterling silver collar with green stone drops and jhumkas.' },

  { id: 'SR-S203', name: 'Beaded Silver Bracelet', cat: 'bracelets', metal: 'silver', purity: '925', weight: 21.0, stones: 'Sapphire',
    featured: true, art: { type: 'bracelet', variant: 'beaded', gem: 'sapphire' },
    desc: 'Polished silver beads with two blue stones, strung on a strong core.' },

  { id: 'SR-S204', name: 'Silver Link Bracelet', cat: 'bracelets', metal: 'silver', purity: '925', weight: 26.4,
    art: { type: 'bracelet', variant: 'link' },
    desc: 'A heavy sterling link bracelet for men and women.' },

  { id: 'SR-S205', name: 'Silver Tennis Bracelet', cat: 'bracelets', metal: 'silver', purity: '925', weight: 14.2, stones: 'Zircon',
    art: { type: 'bracelet', variant: 'tennis', gem: 'diamond' },
    desc: 'A line of bright zircons set in sterling silver.' },

  { id: 'SR-S206', name: 'Gents Silver Kada', cat: 'bangles', metal: 'silver', purity: '925', weight: 62.0, stones: 'Onyx',
    art: { type: 'bangle', variant: 'kada', gem: 'onyx' },
    desc: 'A solid open kada with engraved work and onyx-set ends.' },

  { id: 'SR-S207', name: 'Silver Bangle Pair', cat: 'bangles', metal: 'silver', purity: '925', weight: 44.0,
    art: { type: 'bangle', variant: 'pair' },
    desc: 'Two broad sterling bangles with a fine engraved pattern.' },

  { id: 'SR-S208', name: 'Payal Pair with Ghungroo', cat: 'anklets', metal: 'silver', purity: '925', weight: 58.0,
    featured: true, art: { type: 'anklet' },
    desc: 'A pair of rope-work anklets hung with small silver bells.' },

  { id: 'SR-S209', name: 'Toe Ring Pair', cat: 'rings', metal: 'silver', purity: '925', weight: 6.0, stones: 'Ruby',
    art: { type: 'ring', variant: 'pair', gem: 'ruby' },
    desc: 'A pair of flower-top toe rings in sterling silver.' },

  { id: 'SR-S210', name: 'Silver Jhumkas', cat: 'earrings', metal: 'silver', purity: '925', weight: 16.0, stones: 'Sapphire',
    art: { type: 'earrings', variant: 'jhumka', gem: 'sapphire' },
    desc: 'Domed silver jhumkas with a blue stone stud.' },

  { id: 'SR-S211', name: 'Curb Chain', cat: 'chains', metal: 'silver', purity: '925', weight: 34.0,
    art: { type: 'chain', variant: 'curb' },
    desc: 'A flat, close-linked curb chain in sterling silver.' },

  { id: 'SR-S212', name: 'Pearl Pendant with Chain', cat: 'chains', metal: 'silver', purity: '925', weight: 9.0, stones: 'Pearl',
    art: { type: 'pendant', variant: 'pearl', gem: 'pearl' },
    desc: 'A single pearl in a silver cap on a fine bead chain.' },

  { id: 'SR-S213', name: 'Silver Coin, 50 g', cat: 'coins', metal: 'silver', purity: '999', weight: 50.0,
    art: { type: 'coin', label: ['FINE', '999'] },
    desc: 'A fine silver coin for festivals, gifting and pooja.' },

  { id: 'SR-S214', name: 'Silver Bar, 100 g', cat: 'coins', metal: 'silver', purity: '999', weight: 100.0,
    art: { type: 'coin', variant: 'bar', label: ['FINE SILVER', '999', '100 g'] },
    desc: 'A fine silver bar with its weight and purity stamped on the face.' }
];
