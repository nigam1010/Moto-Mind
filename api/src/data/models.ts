export type CarModel = {
  slug: string
  name: string
  year: number
  basePrice: number
  images: string[]
  specs: {
    horsepower: number
    torque: number
    drivetrain: string
    acceleration_0_100: number
    topSpeed: number
    fuelType: string
  }
  trims: { name: string; priceDelta: number; engine: string; transmission: string }[]
  colors: { code: string; name: string; hex: string; priceDelta: number }[]
  wheels: { name: string; size: number; priceDelta: number; image?: string }[]
}

export const MODELS: CarModel[] = [
  {
    slug: "911-carrera",
    name: "911 Carrera",
    year: 2024,
    basePrice: 9850000,
    images: [
      "/videos/carrera3.jpg",
      "/videos/carrera1.jpg",
      "/videos/carrera2.jpg",
      "/videos/carrera4.jpg",
      "/videos/carrera5.jpg",
      "/videos/carrera6.jpg"
    ],
    specs: { horsepower: 379, torque: 450, drivetrain: "RWD", acceleration_0_100: 4.2, topSpeed: 293, fuelType: "Petrol" },
    trims: [
      { name: "Carrera", priceDelta: 0, engine: "3.0L H6", transmission: "PDK" },
      { name: "Carrera S", priceDelta: 1800000, engine: "3.0L H6", transmission: "PDK" }
    ],
    colors: [
      { code: "GTSIL", name: "GT Silver Metallic", hex: "#A3A7AA", priceDelta: 180000 },
      { code: "GUARDSR", name: "Guards Red", hex: "#BE1622", priceDelta: 0 }
    ],
    wheels: [
      { name: "RS Spyder", size: 20, priceDelta: 120000 }
    ]
  },
  {
    slug: "taycan-4s",
    name: "Taycan 4S",
    year: 2025,
    basePrice: 13200000,
    images: [
      "/videos/taycan1.jpg",
      "/videos/taycan2.jpg",
      "/videos/taycan3.jpg"

    ],
    specs: { horsepower: 536, torque: 650, drivetrain: "AWD", acceleration_0_100: 4.0, topSpeed: 250, fuelType: "Electric" },
    trims: [
      { name: "4S", priceDelta: 0, engine: "Dual Motor", transmission: "1-speed" }
    ],
    colors: [
      { code: "BLACK", name: "Black", hex: "#000000", priceDelta: 0 },
      { code: "WHITE", name: "White", hex: "#FFFFFF", priceDelta: 0 }
    ],
    wheels: [
      { name: "Aero", size: 19, priceDelta: 0 }
    ]
  },
  {
    slug: "macan-s",
    name: "Macan S",
    year: 2024,
    basePrice: 7800000,
    images: [
      "/videos/macan1.jpg",
      "/videos/macan2.jpg",
      "/videos/macan3.jpg",
      "/videos/macan4.jpg",
      "/videos/macan5.jpg",
      "/videos/macan6.jpg"
    ],
    specs: { horsepower: 375, torque: 520, drivetrain: "AWD", acceleration_0_100: 4.6, topSpeed: 259, fuelType: "Petrol" },
    trims: [
      { name: "S", priceDelta: 0, engine: "2.9L V6", transmission: "PDK" }
    ],
    colors: [
      { code: "SAPP", name: "Sapphire Blue", hex: "#0F52BA", priceDelta: 80000 }
    ],
    wheels: [
      { name: "Sport", size: 20, priceDelta: 60000 }
    ]
  }
]
