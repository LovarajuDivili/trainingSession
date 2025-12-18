require("dotenv").config();
const mongoose = require("mongoose");
const AccountantItem = require("./models/AccountantItem");

const MONGO_URL = process.env.MONGOURI;

async function seedData() {
  await mongoose.connect(MONGO_URL);
  console.log("MongoDB Connected");

  const items = [
    { category: "Laptop", brand: "Dell", model: "Inspiron", price: 65000 },
    { category: "Laptop", brand: "HP", model: "Pavilion", price: 72000 },
    { category: "Laptop", brand: "Lenovo", model: "ThinkPad", price: 78000 },
    { category: "Laptop", brand: "Asus", model: "VivoBook", price: 68000 },
    { category: "Laptop", brand: "Acer", model: "Aspire", price: 60000 },
    { category: "Laptop", brand: "Apple", model: "MacBook Air", price: 125000 },
    { category: "Laptop", brand: "Microsoft", model: "Surface", price: 145000 },
    { category: "Laptop", brand: "DellPro", model: "Latitude", price: 135000 },
    { category: "Laptop", brand: "HPPro", model: "EliteBook", price: 110000 },
    { category: "Laptop", brand: "LenovoPro", model: "IdeaPad", price: 95000 },
    { category: "Laptop", brand: "MSI", model: "GF63", price: 88000 },
    {
      category: "Laptop",
      brand: "Samsung",
      model: "Galaxy Book",
      price: 99000,
    },
    {
      category: "Laptop",
      brand: "ApplePro",
      model: "MacBook Pro",
      price: 185000,
    },

    { category: "Monitor", brand: "Dell", model: "24-inch IPS", price: 12000 },
    {
      category: "Monitor",
      brand: "Samsung",
      model: "Curve 27-inch",
      price: 18000,
    },
    { category: "Monitor", brand: "LG", model: "Ultrawide", price: 16000 },
    { category: "Monitor", brand: "HP", model: "Full HD", price: 14000 },
    {
      category: "Monitor",
      brand: "Acer",
      model: "Basic 24-inch",
      price: 11000,
    },

    { category: "Keyboard", brand: "Logitech", model: "K120", price: 1500 },
    { category: "Keyboard", brand: "Dell", model: "Multimedia", price: 1700 },
    { category: "Keyboard", brand: "HP", model: "Basic", price: 1600 },
    { category: "Keyboard", brand: "Lenovo", model: "Slim", price: 1800 },

    { category: "Mouse", brand: "Logitech", model: "M170", price: 900 },
    { category: "Mouse", brand: "Dell", model: "Optical", price: 850 },
    { category: "Mouse", brand: "HP", model: "Wireless", price: 950 },
    { category: "Mouse", brand: "Lenovo", model: "USB Mouse", price: 800 },

    { category: "Headphones", brand: "Boat", model: "Bassheads", price: 1500 },
    { category: "Headphones", brand: "Sony", model: "MDR", price: 2500 },
    { category: "Headphones", brand: "JBL", model: "Tune 500", price: 2800 },
    {
      category: "Headphones",
      brand: "Zebronics",
      model: "Zeb-Thunder",
      price: 1200,
    },

    { category: "Webcam", brand: "Logitech", model: "C270", price: 3500 },
    { category: "Webcam", brand: "Dell", model: "HD Webcam", price: 3000 },
    { category: "Webcam", brand: "HP", model: "HD 720p", price: 2800 },
    { category: "Webcam", brand: "Lenovo", model: "FHD Cam", price: 3200 },
  ];

  await AccountantItem.insertMany(items);
  console.log("ALL ITEMS SEEDED SUCCESSFULLY!");

  process.exit();
}

seedData().catch((err) => {
  console.error(err);
  process.exit(1);
});
