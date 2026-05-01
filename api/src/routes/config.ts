import { Router } from "express"
import { MODELS } from "../data/models"
import { SAVED_CONFIGS } from "../data/store"

const router = Router()

// POST /api/config/price  -> { breakdown, total }
router.post("/price", (req, res) => {
  const { modelSlug, trimName, colorCode, wheelName } = req.body || {}

  const car = MODELS.find(m => m.slug === modelSlug)
  if (!car) return res.status(404).json({ error: "Model not found" })

  const trim  = car.trims.find(t => t.name === trimName)
  const color = car.colors.find(c => c.code === colorCode)
  const wheel = car.wheels.find(w => w.name === wheelName)

  if (!trim || !color || !wheel) {
    return res.status(400).json({ error: "Invalid options" })
  }

  const base = car.basePrice || 0
  const breakdown = {
    base,
    trim : trim.priceDelta || 0,
    color: color.priceDelta || 0,
    wheel: wheel.priceDelta || 0
  }
  const total = breakdown.base + breakdown.trim + breakdown.color + breakdown.wheel

  res.json({ breakdown, total })
})

// POST /api/config/save -> saves and returns { config }
router.post("/save", (req, res) => {
  const { userId = "demo-user", modelSlug, trimName, colorCode, wheelName } = req.body || {}

  const car = MODELS.find(m => m.slug === modelSlug)
  if (!car) return res.status(404).json({ error: "Model not found" })

  const trim  = car.trims.find(t => t.name === trimName)
  const color = car.colors.find(c => c.code === colorCode)
  const wheel = car.wheels.find(w => w.name === wheelName)
  if (!trim || !color || !wheel) return res.status(400).json({ error: "Invalid options" })

  const base = car.basePrice || 0
  const total = base + (trim.priceDelta||0) + (color.priceDelta||0) + (wheel.priceDelta||0)

  const cfg = {
    id: Math.random().toString(36).slice(2),
    userId,
    modelSlug,
    trimName,
    colorCode,
    wheelName,
    calculatedPrice: total,
    createdAt: new Date().toISOString()
  }

  SAVED_CONFIGS.unshift(cfg)
  res.json({ config: cfg })
})

// GET /api/config/mine?userId=demo-user -> { configs: [...] }
router.get("/mine", (req, res) => {
  const userId = (req.query.userId as string) || "demo-user"
  const items = SAVED_CONFIGS.filter(x => x.userId === userId)
  res.json({ configs: items })
})

export default router
