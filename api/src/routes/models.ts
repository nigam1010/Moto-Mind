import { Router } from "express"
import { MODELS } from "../data/models"

const router = Router()

// GET /api/models?search=&year=&hpMin=&hpMax=
router.get("/", (req, res) => {
  const { search, year, hpMin, hpMax } = req.query as Record<string, string | undefined>
  let results = [...MODELS]

  if (year) results = results.filter(m => m.year === Number(year))
  if (search) {
    const s = search.toLowerCase()
    results = results.filter(m => m.name.toLowerCase().includes(s) || m.slug.includes(s))
  }
  if (hpMin) results = results.filter(m => m.specs.horsepower >= Number(hpMin))
  if (hpMax) results = results.filter(m => m.specs.horsepower <= Number(hpMax))

  // lightweight list
  const list = results.map(m => ({
    slug: m.slug,
    name: m.name,
    year: m.year,
    basePrice: m.basePrice,
    images: m.images,
    specs: { horsepower: m.specs.horsepower }
  }))

  res.json({ models: list })
})

// GET /api/models/:slug
router.get("/:slug", (req, res) => {
  const model = MODELS.find(m => m.slug === req.params.slug)
  if (!model) return res.status(404).json({ error: "Not found" })
  res.json({ model })
})

export default router
