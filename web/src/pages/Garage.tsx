import { useEffect, useMemo, useState } from "react"
import { api } from "../api"
import { useUser } from "../UserContext"
import { Link } from "react-router-dom"

/* ----------------------------- Types ----------------------------- */
type Item = {
  id: string
  modelSlug: string
  trimName: string
  colorCode: string
  wheelName: string
  calculatedPrice: number
  createdAt: string
  image?: string
}

type Model = {
  slug: string
  name: string
  basePrice: number
  images?: string[]
  specs?: { horsepower?: number }
}

declare global { interface Window { paypal?: any } }

/* ------------------------- Helper functions ---------------------- */

const categoryOf = (m: Model) => {
  const s = m.slug.toLowerCase()
  if (s.includes("taycan")) return "electric"
  if (s.includes("macan"))  return "suv"
  if (s.includes("911") || s.includes("carrera")) return "sports"
  return "other"
}

const median = (nums: number[]) => {
  if (!nums.length) return 0
  const a = [...nums].sort((x,y)=>x-y)
  const mid = Math.floor(a.length/2)
  return a.length % 2 ? a[mid] : (a[mid-1] + a[mid]) / 2
}

/** choose at most one per category from ranked list */
const diverseTop = (ranked: Model[], limit = 3) => {
  const seen = new Set<string>()
  const out: Model[] = []
  for (const m of ranked) {
    const c = categoryOf(m)
    if (!seen.has(c)) {
      out.push(m)
      seen.add(c)
      if (out.length === limit) break
    }
  }
  return out
}

/* ----------------------------- UI ------------------------------- */

export default function Garage() {
  const { user } = useUser()

  const [items, setItems] = useState<Item[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [buyingId, setBuyingId] = useState<string | null>(null)

  // Load garage + models
  useEffect(() => {
    api.get("/models")
      .then(r => setModels(r.data.models || []))
      .catch(() => setModels([]))

    if (user) {
      api.get("/config/mine", { params: { userId: user.id } })
        .then(r => setItems(r.data.configs || []))
        .catch(() => setItems([]))
    } else {
      setItems([])
    }
  }, [user])

  // Find model by slug (for fallbacks like images & basePrice)
  const modelBySlug = useMemo(() => {
    const map = new Map<string, Model>()
    for (const m of models) map.set(m.slug, m)
    return map
  }, [models])

  // Render PayPal smart buttons for a given item when `buyingId` set
  useEffect(() => {
    if (!buyingId) return
    const item = items.find(i => i.id === buyingId)
    if (!item) return
    const target = document.getElementById(`paypal-${buyingId}`)
    if (!target || !window.paypal) return
    target.innerHTML = ""

    // NOTE: demo INR->USD rough conversion to visualize sandbox checkout
    const usd = Math.max(item.calculatedPrice / 100000, 1).toFixed(2)

    window.paypal.Buttons({
      style: {
        color:  "gold",
        shape:  "rect",
        label:  "paypal",
        layout: "vertical",
      },
      createOrder: (_: any, actions: any) =>
        actions.order.create({ purchase_units: [{ amount: { value: usd } }] }),
      onApprove: async (_: any, actions: any) => {
        await actions.order.capture()
        alert("Purchase complete! 🚗")
        setBuyingId(null)
      },
      onCancel: () => setBuyingId(null),
    }).render(`#paypal-${buyingId}`)
  }, [buyingId, items])

  /* ------------------ Recommendations (Always On) ------------------ */

  const recommendations = useMemo(() => {
    if (!models.length) return []

    // CASE A: Based on saved items (content-based)
    if (items.length) {
      const savedSlugs = new Set(items.map(i => i.modelSlug))
      const savedModels = models.filter(m => savedSlugs.has(m.slug))
      const avgPrice = savedModels.reduce((a,m)=>a+(m.basePrice||0),0) / Math.max(savedModels.length,1)
      const savedCats = new Set(savedModels.map(categoryOf))

      const candidates = models.filter(m => !savedSlugs.has(m.slug))
      const ranked = candidates
        .map(m => ({
          m,
          score: (savedCats.has(categoryOf(m)) ? 1000 : 0)
               - Math.abs((m.basePrice||0) - (avgPrice||0)) / 10000
               + (m.specs?.horsepower || 0) / 10
        }))
        .sort((a,b)=>b.score-a.score)
        .map(x=>x.m)

      return diverseTop(ranked, 3)
    }

    // CASE B: Cold-start using last viewed seed
    const seedSlug = localStorage.getItem("mm:lastViewed") || ""
    const seed = models.find(m => m.slug === seedSlug)

    if (seed) {
      const seedCat = categoryOf(seed)
      const target = seed.basePrice || median(models.map(m=>m.basePrice||0))
      const ranked = models
        .filter(m => m.slug !== seed.slug)
        .map(m => ({
          m,
          score: (categoryOf(m) === seedCat ? 1000 : 0)
               - Math.abs((m.basePrice||0) - target) / 10000
               + (m.specs?.horsepower || 0) / 10
        }))
        .sort((a,b)=>b.score-a.score)
        .map(x=>x.m)

      return diverseTop(ranked, 3)
    }

    // CASE C: True cold-start — diverse mid-price picks
    const med = median(models.map(m=>m.basePrice||0))
    const ranked = models
      .map(m => ({
        m,
        score: - Math.abs((m.basePrice||0) - med) / 10000
             + (m.specs?.horsepower || 0) / 10
      }))
      .sort((a,b)=>b.score-a.score)
      .map(x=>x.m)

    return diverseTop(ranked, 3)
  }, [items, models])

  /* ---------------------------- Render ----------------------------- */

  if (!user) {
    return (
      <div style={{ padding: 16 }}>
        Please <Link to="/login" style={{ textDecoration: "underline" }}>login</Link> to view your garage.
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ marginBottom: 16 }}>My Garage</h1>

      {/* Saved configurations list */}
      {items.length === 0 ? (
        <div style={{ color: "#b5bdc8", marginBottom: 16 }}>
          You haven’t saved any configurations yet.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {items.map((it) => {
            const model = modelBySlug.get(it.modelSlug)
            const imgSrc = it.image || model?.images?.[0] || ""
            return (
              <div
                key={it.id}
                style={{
                  border: "1px solid #222",
                  borderRadius: 12,
                  padding: 12,
                  background: "#101010",
                  display: "grid",
                  gridTemplateColumns: "240px 1fr",
                  gap: 16,
                  alignItems: "center",
                }}
              >
                <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #222", background: "#0a0a0a" }}>
                  {imgSrc
                    ? <img src={imgSrc} alt={it.modelSlug} style={{ width: "100%", height: 160, objectFit: "cover" }} />
                    : <div style={{ width: "100%", height: 160 }} />
                  }
                </div>

                <div>
                  <div style={{ fontWeight: 800, fontSize: 18 }}>
                    {model?.name || it.modelSlug}
                  </div>

                  <div style={{ fontSize: 13, color: "#c9c9c9", marginTop: 4 }}>
                    Trim: {it.trimName} · Color: {it.colorCode} · Wheels: {it.wheelName}
                  </div>

                  <div style={{ fontWeight: 800, marginTop: 6 }}>
                    ₹{it.calculatedPrice.toLocaleString("en-IN")}
                  </div>

                  <div style={{ fontSize: 12, color: "#888" }}>
                    {new Date(it.createdAt).toLocaleString()}
                  </div>

                  {/* PayPal CTA */}
                  <div style={{ marginTop: 10 }}>
                    <button
                      onClick={() => setBuyingId(it.id)}
                      style={{
                        padding: "10px 12px",
                        background: "#0070ba",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      Buy with PayPal
                    </button>

                    {/* PayPal smart buttons mount point */}
                    {buyingId === it.id && (
                      <div
                        id={`paypal-${it.id}`}
                        style={{
                          marginTop: 12,
                          border: "1px solid #222",
                          borderRadius: 10,
                          overflow: "hidden",
                          background: "#0b0b0b",
                          padding: 12,
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Recommendations — ALWAYS VISIBLE */}
      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 20, marginBottom: 6 }}>Recommended for you</h2>
        <div style={{ color: "#9aa", fontSize: 13, marginBottom: 10 }}>
          {items.length
            ? "Because of the cars you saved in your garage."
            : localStorage.getItem("mm:lastViewed")
              ? "Based on your last viewed model."
              : "Popular mid-range picks to help you get started."
          }
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {recommendations.map(rec => (
            <Link
              key={rec.slug}
              to={`/models/${rec.slug}`}
              style={{
                display: "grid",
                gridTemplateColumns: "220px 1fr",
                gap: 14,
                alignItems: "center",
                padding: 10,
                border: "1px solid #222",
                borderRadius: 12,
                background: "#0f0f0f",
                textDecoration: "none",
                color: "#eaeef2",
                transition: "transform .15s ease, box-shadow .15s ease, border-color .15s ease"
              }}
              onMouseEnter={(e)=>{ e.currentTarget.style.transform="translateY(-2px) scale(1.01)"; e.currentTarget.style.borderColor="#2a2f38" }}
              onMouseLeave={(e)=>{ e.currentTarget.style.transform=""; e.currentTarget.style.borderColor="#222" }}
            >
              <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #222", background: "#0a0a0a" }}>
                {rec.images?.[0]
                  ? <img src={rec.images[0]} alt={rec.name} style={{ width: "100%", height: 140, objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: 140 }} />
                }
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{rec.name}</div>
                <div style={{ fontSize: 13, color: "#b8c0cc", marginTop: 4 }}>
                  Category: {categoryOf(rec).toUpperCase()} • Base: ₹{rec.basePrice.toLocaleString("en-IN")}
                </div>
                <div style={{ fontSize: 12, color: "#8aa", marginTop: 4 }}>
                  {rec.specs?.horsepower ? `${rec.specs.horsepower} HP` : "HP: N/A"}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
