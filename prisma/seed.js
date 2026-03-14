import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const imgs = [
  "https://images.unsplash.com/photo-1594125311687-3b1b3eafa9f4?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1720423738890-37689a6f6b95?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1647507653704-bde7f2d6dbf0?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1750029418982-81ffffaada20?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1750029418926-73f83b93e3c4?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1676347929093-6614fb45bd90?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1720423514789-15a33e59fc81?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1723896762815-d4e3e35dd82b?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1634055769490-dc0a9f22826a?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1689699544816-05b02ea9ee0b?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1602928355784-b05f7a78b842?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1602928374389-6eeee0e5e4ff?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1689699544901-94ec6ba89dbe?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1747915725522-cc1dc4b6d809?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1733582140110-331d170bd055?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1733585683230-6221343e69a8?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1693960794637-42e1cf5baa0b?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1682456589276-b1aa636ff019?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1650462740584-a64b6788eaf3?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1740327123574-05b0efdec29f?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1636730431099-20607b24ded9?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1753389665610-53b0e8a40a66?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1627408727578-172381083156?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1740202579440-dc5b8fa14377?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1680984258298-8fc21dacce9f?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1740327123574-05b0efdec29f?w=500&h=500&fit=crop&q=80&sat=-30",
  "https://images.unsplash.com/photo-1676347929093-6614fb45bd90?w=500&h=500&fit=crop&q=80&sat=20",
  "https://images.unsplash.com/photo-1594125311687-3b1b3eafa9f4?w=500&h=500&fit=crop&q=80&hue=20",
  "https://images.unsplash.com/photo-1602928355784-b05f7a78b842?w=500&h=500&fit=crop&q=80&sat=30",
  "https://images.unsplash.com/photo-1636730431099-20607b24ded9?w=500&h=500&fit=crop&q=80&sat=-20",
  "https://images.unsplash.com/photo-1723896762815-d4e3e35dd82b?w=500&h=500&fit=crop&q=80&sat=10",
  "https://images.unsplash.com/photo-1747915725522-cc1dc4b6d809?w=500&h=500&fit=crop&q=80&sat=-10",
  "https://images.unsplash.com/photo-1650462740584-a64b6788eaf3?w=500&h=500&fit=crop&q=80&sat=20",
  "https://images.unsplash.com/photo-1689699544816-05b02ea9ee0b?w=500&h=500&fit=crop&q=80&sat=-30",
  "https://images.unsplash.com/photo-1753389665610-53b0e8a40a66?w=500&h=500&fit=crop&q=80&sat=30",
  "https://images.unsplash.com/photo-1692945403244-b3fbafd7f539?w=500&h=500&fit=crop&q=80",
  "https://images.unsplash.com/photo-1720423514789-15a33e59fc81?w=500&h=500&fit=crop&q=80&sat=-20",
  "https://images.unsplash.com/photo-1733582140110-331d170bd055?w=500&h=500&fit=crop&q=80&sat=10",
  "https://images.unsplash.com/photo-1627408727578-172381083156?w=500&h=500&fit=crop&q=80&sat=-10",
];

const products = [
  { name: "Sauvage", brand: "Dior", price: 3000, originalPrice: null, category: "hombre", ml: 100, type: "EDP", description: "Un perfume fresco y salvaje inspirado en los amplios espacios abiertos.", notes: { top: "Bergamota calabresa", heart: "Pimienta de Sichuan", base: "Ámbar madera" }, badge: "Bestseller", image: imgs[0] },
  { name: "Bleu de Chanel", brand: "Chanel", price: 3600, originalPrice: null, category: "hombre", ml: 100, type: "EDP", description: "Una fragancia aromática maderera para el hombre que se rehúsa a conformarse.", notes: { top: "Pomelo, Menta", heart: "Jengibre, Nuez moscada", base: "Sándalo, Cedro" }, badge: null, image: imgs[1] },
  { name: "Acqua di Giò", brand: "Giorgio Armani", price: 2450, originalPrice: 2900, category: "hombre", ml: 100, type: "EDT", description: "Inspirado en el mar Mediterráneo. Fresco, marino y absolutamente irresistible.", notes: { top: "Limón, Bergamota, Mar", heart: "Jazmín, Persimón", base: "Cedro, Pachulí" }, badge: "Oferta", image: imgs[2] },
  { name: "Invictus", brand: "Paco Rabanne", price: 2200, originalPrice: null, category: "hombre", ml: 100, type: "EDT", description: "Un campeón olímpico marino y fresco. Victorioso y magnético.", notes: { top: "Pomelo, Laurel marino", heart: "Jazmín, Guayaco", base: "Musgo de roble, Ámbar" }, badge: null, image: imgs[3] },
  { name: "1 Million", brand: "Paco Rabanne", price: 2300, originalPrice: null, category: "hombre", ml: 100, type: "EDT", description: "El perfume del hombre más atractivo del mundo.", notes: { top: "Pomelo, Menta, Sangre", heart: "Rosa, Canela", base: "Cuero, Pachulí" }, badge: "Bestseller", image: imgs[4] },
  { name: "The One", brand: "Dolce & Gabbana", price: 2600, originalPrice: null, category: "hombre", ml: 100, type: "EDP", description: "Cálido, especiado y elegante. La esencia del hombre moderno.", notes: { top: "Pomelo, Albahaca", heart: "Cardamomo, Jengibre", base: "Ámbar, Musgo, Cedro" }, badge: null, image: imgs[5] },
  { name: "Terre d'Hermès", brand: "Hermès", price: 3250, originalPrice: null, category: "hombre", ml: 75, type: "EDP", description: "La tierra como fuente de vida. Una fragancia mineral y vegetal.", notes: { top: "Naranja, Pomelo", heart: "Pimienta, Geranio", base: "Vetiver, Cedro" }, badge: null, image: imgs[6] },
  { name: "Aventus", brand: "Creed", price: 8000, originalPrice: null, category: "hombre", ml: 100, type: "EDP", description: "La fragancia de los líderes. Frutal, ahumada y poderosa.", notes: { top: "Piña, Bergamota, Grosella negra", heart: "Rosa, Jazmín", base: "Musgo de roble, Ámbar" }, badge: "Premium", image: imgs[7] },
  { name: "Fahrenheit", brand: "Dior", price: 2200, originalPrice: 2600, category: "hombre", ml: 100, type: "EDT", description: "Un contraste único entre calidez y frescura.", notes: { top: "Mandarina, Bergamota", heart: "Violeta, Nuez moscada", base: "Ámbar, Cuero, Cedro" }, badge: "Oferta", image: imgs[8] },
  { name: "Tobacco Vanille", brand: "Tom Ford", price: 6900, originalPrice: null, category: "hombre", ml: 50, type: "EDP", description: "Tabaco oriental y vainilla. Lujoso, cálido e irresistiblemente adictivo.", notes: { top: "Tabaco, Especias", heart: "Tonka, Cacao", base: "Vainilla, Madera seca" }, badge: "Premium", image: imgs[9] },
  { name: "Drakkar Noir", brand: "Guy Laroche", price: 1400, originalPrice: null, category: "hombre", ml: 100, type: "EDT", description: "Un clásico atemporal. Aromático, maderero y masculino.", notes: { top: "Lavanda, Albahaca", heart: "Romero, Enebro", base: "Cedro, Cuero" }, badge: null, image: imgs[10] },
  { name: "Boss Bottled", brand: "Hugo Boss", price: 1900, originalPrice: 2200, category: "hombre", ml: 100, type: "EDT", description: "El aroma del éxito. Manzana, canela y cedro en perfecta armonía.", notes: { top: "Manzana, Limón", heart: "Canela, Clavel", base: "Sándalo, Vetiver, Cedro" }, badge: "Oferta", image: imgs[11] },
  { name: "Oud Wood", brand: "Tom Ford", price: 7250, originalPrice: null, category: "hombre", ml: 50, type: "EDP", description: "El oud más refinado del mundo. Exótico, cálido y absolutamente lujoso.", notes: { top: "Cardamomo, Pimienta china", heart: "Oud, Sándalo", base: "Ámbar, Vainilla" }, badge: "Premium", image: imgs[12] },
  { name: "Polo Blue", brand: "Ralph Lauren", price: 2000, originalPrice: null, category: "hombre", ml: 125, type: "EDP", description: "Inspirado en los cielos abiertos y el espíritu libre.", notes: { top: "Melón, Pepino, Salvia", heart: "Geranio, Verbena", base: "Musk, Suede" }, badge: null, image: imgs[13] },
  { name: "Stronger With You", brand: "Emporio Armani", price: 2400, originalPrice: null, category: "hombre", ml: 100, type: "EDT", description: "Dulce, cálido y moderno. La fragancia de la nueva generación.", notes: { top: "Salvia, Cardamomo", heart: "Castaña, Flores", base: "Vainilla, Ámbar, Madera" }, badge: "Nuevo", image: imgs[14] },
  { name: "Coco Mademoiselle", brand: "Chanel", price: 3900, originalPrice: null, category: "mujer", ml: 100, type: "EDP", description: "Fresco, audaz y seductor. La fragancia de la mujer moderna y libre.", notes: { top: "Naranja, Bergamota", heart: "Rosa, Jazmín", base: "Pachulí, Vetiver" }, badge: "Bestseller", image: imgs[15] },
  { name: "La Vie Est Belle", brand: "Lancôme", price: 2800, originalPrice: null, category: "mujer", ml: 100, type: "EDP", description: "La vida es bella. Iris, jazmín y gourmand.", notes: { top: "Grosella negra, Pera", heart: "Iris, Jazmín", base: "Pralinée, Vainilla, Musgo" }, badge: "Bestseller", image: imgs[16] },
  { name: "Miss Dior", brand: "Dior", price: 3400, originalPrice: null, category: "mujer", ml: 100, type: "EDP", description: "La feminidad en su forma más pura.", notes: { top: "Calabaza, Limón, Bergamota", heart: "Rosa de Grasse", base: "Pachulí, Vetiver" }, badge: null, image: imgs[17] },
  { name: "Black Opium", brand: "Yves Saint Laurent", price: 2950, originalPrice: 3500, category: "mujer", ml: 90, type: "EDP", description: "Café, vainilla y flores blancas. Adictivo, oscuro y electrizante.", notes: { top: "Pera, Flor de pimiento rosa", heart: "Café, Jazmín", base: "Vainilla, Cedro, Pachulí" }, badge: "Oferta", image: imgs[18] },
  { name: "Flowerbomb", brand: "Viktor & Rolf", price: 3100, originalPrice: null, category: "mujer", ml: 100, type: "EDP", description: "Una explosión floral. La fragancia más icónica de la perfumería moderna.", notes: { top: "Bergamota, Té", heart: "Jazmín, Rosa, Orquídea", base: "Musgo de roble, Pachulí" }, badge: null, image: imgs[19] },
  { name: "Good Girl", brand: "Carolina Herrera", price: 2700, originalPrice: null, category: "mujer", ml: 80, type: "EDP", description: "Dualidad seductora. Jazmín fresco arriba, tonka y cacao abajo.", notes: { top: "Almendra, Café", heart: "Jazmín tuberosa", base: "Tonka, Cacao, Musgo" }, badge: "Bestseller", image: imgs[20] },
  { name: "Chance Eau Tendre", brand: "Chanel", price: 3700, originalPrice: null, category: "mujer", ml: 100, type: "EDP", description: "Floral frutal y luminoso. La fragancia del momento presente.", notes: { top: "Pomelo, Quince", heart: "Jazmín, Iris", base: "White musks, Ambrette" }, badge: null, image: imgs[21] },
  { name: "Libre", brand: "Yves Saint Laurent", price: 3050, originalPrice: null, category: "mujer", ml: 90, type: "EDP", description: "Libertad y sensualidad en perfecta tensión.", notes: { top: "Mandarina, Grosella negra", heart: "Lavanda, Jazmín", base: "Vainilla, Ámbar, Cedro" }, badge: "Nuevo", image: imgs[22] },
  { name: "Idôle", brand: "Lancôme", price: 2500, originalPrice: 2900, category: "mujer", ml: 100, type: "EDP", description: "Rosa y musgo. Moderna y poderosa.", notes: { top: "Pera, Bergamota", heart: "Rosa, Iris, Jazmín", base: "White musks, Musgo" }, badge: "Oferta", image: imgs[23] },
  { name: "Si", brand: "Giorgio Armani", price: 2750, originalPrice: null, category: "mujer", ml: 100, type: "EDP", description: "Elegante, fresco y femenino.", notes: { top: "Grosella negra, Mandarina", heart: "Rosa, Freesia", base: "Pachulí, Vainilla, Musgo" }, badge: null, image: imgs[24] },
  { name: "Light Blue", brand: "Dolce & Gabbana", price: 2100, originalPrice: null, category: "mujer", ml: 100, type: "EDT", description: "El verano siciliano embotellado.", notes: { top: "Citron siciliano, Manzana, Campanilla", heart: "Bambú, Jazmín", base: "Rosa blanca, Cedro" }, badge: null, image: imgs[25] },
  { name: "Daisy", brand: "Marc Jacobs", price: 2000, originalPrice: null, category: "mujer", ml: 100, type: "EDT", description: "Fresco y femenino como un campo en primavera.", notes: { top: "Fresa, Violeta", heart: "Gardenia, Violeta", base: "Musgo, Vainilla, Sándalo" }, badge: null, image: imgs[26] },
  { name: "J'adore", brand: "Dior", price: 3450, originalPrice: null, category: "mujer", ml: 100, type: "EDP", description: "La elegancia absoluta. Floral dorado e incomparable.", notes: { top: "Ylang ylang, Damascena", heart: "Rosa, Jazmín", base: "Almizcle, Cedro" }, badge: "Bestseller", image: imgs[27] },
  { name: "Olympéa", brand: "Paco Rabanne", price: 2400, originalPrice: null, category: "mujer", ml: 80, type: "EDP", description: "Poderosa como una diosa.", notes: { top: "Toronja fresca, Flor de jengibre", heart: "Gardenia blanca, Néroli", base: "Vainilla salada, Musgo de cachemira" }, badge: null, image: imgs[28] },
  { name: "N°5", brand: "Chanel", price: 4400, originalPrice: null, category: "mujer", ml: 100, type: "EDP", description: "El perfume más famoso del mundo.", notes: { top: "Neroli, Ylang ylang, Bergamota", heart: "Jazmín, Rosa", base: "Sándalo, Vetiver, Vainilla" }, badge: "Icónico", image: imgs[29] },
  { name: "CK One", brand: "Calvin Klein", price: 1400, originalPrice: null, category: "unisex", ml: 200, type: "EDT", description: "El unisex que lo cambió todo en los 90s.", notes: { top: "Bergamota, Cardamomo, Papaya", heart: "Jazmín, Violeta, Rosa", base: "Ámbar, Musgo de roble, Almizcle" }, badge: "Clásico", image: imgs[30] },
  { name: "Molecule 01", brand: "Escentric Molecules", price: 2950, originalPrice: null, category: "unisex", ml: 100, type: "EDT", description: "Una sola molécula: Iso E Super. Misterioso y único.", notes: { top: "Iso E Super", heart: "Iso E Super", base: "Iso E Super" }, badge: "Cult", image: imgs[31] },
  { name: "Santal 33", brand: "Le Labo", price: 5900, originalPrice: null, category: "unisex", ml: 100, type: "EDP", description: "El perfume de la generación creativa.", notes: { top: "Cardamomo, Iris, Violeta", heart: "Ambrox, Papiro", base: "Sándalo, Cedro, Cuero" }, badge: "Premium", image: imgs[32] },
  { name: "Neroli Portofino", brand: "Tom Ford", price: 6500, originalPrice: null, category: "unisex", ml: 50, type: "EDP", description: "La Riviera italiana embotellada.", notes: { top: "Bergamota, Limón, Mandarina", heart: "Neroli, Jazmín, Rosa", base: "Ámbar, Musgo, Vetiver" }, badge: "Premium", image: imgs[33] },
  { name: "Acqua di Parma", brand: "Acqua di Parma", price: 3600, originalPrice: null, category: "unisex", ml: 100, type: "EDC", description: "El elegante italiano. Cítrico, fresco y refinado.", notes: { top: "Limón italiano, Bergamota", heart: "Lavanda, Rosa", base: "Sándalo, Vetiver, Benjuí" }, badge: null, image: imgs[34] },
  { name: "Baccarat Rouge 540", brand: "Maison Francis Kurkdjian", price: 8750, originalPrice: null, category: "unisex", ml: 70, type: "EDP", description: "El perfume de lujo más deseado del mundo.", notes: { top: "Azafrán, Jazmín", heart: "Amberwood, Ambroxan", base: "Cedro, Almizcle" }, badge: "Lujo", image: imgs[35] },
  { name: "Rose 31", brand: "Le Labo", price: 5500, originalPrice: null, category: "unisex", ml: 100, type: "EDP", description: "Una rosa subversiva y elegante.", notes: { top: "Rosa de Grasse, Comino", heart: "Cedro, Vetiver", base: "Oud, Guayaco, Almizcle" }, badge: null, image: imgs[36] },
  { name: "Oud Ispahan", brand: "Dior", price: 7750, originalPrice: null, category: "unisex", ml: 75, type: "EDP", description: "Un viaje al corazón de Oriente Medio.", notes: { top: "Oud", heart: "Rosa damascena", base: "Labdanum, Sándalo" }, badge: "Premium", image: imgs[37] },
  { name: "Silver Mountain Water", brand: "Creed", price: 7400, originalPrice: null, category: "unisex", ml: 100, type: "EDP", description: "La pureza del agua de montaña alpina.", notes: { top: "Bergamota, Mandarina, Té verde", heart: "Petitgrain, Grosella negra", base: "Musgo, Sándalo, Almizcle" }, badge: null, image: imgs[38] },
  { name: "Portrait of a Lady", brand: "Frédéric Malle", price: 8500, originalPrice: null, category: "unisex", ml: 100, type: "EDP", description: "Una rosa intensa y sofisticada. Complejo y cautivador.", notes: { top: "Bergamota, Pimienta negra", heart: "Rosa turca, Especias", base: "Pachulí, Sándalo, Ámbar" }, badge: "Cult", image: imgs[39] },
];

async function main() {
  console.log("Seeding database...");

  // Admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@eliteparfums.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@eliteparfums.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✓ Admin user created (admin@eliteparfums.com / admin123)");

  // Products
  for (const product of products) {
    await prisma.product.create({ data: { ...product, stock: 100 } });
  }
  console.log(`✓ ${products.length} products seeded`);

  console.log("Seed complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
