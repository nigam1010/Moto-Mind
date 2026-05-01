import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { api } from "../api"

type Model = {
  slug: string
  name: string
  year: number
  basePrice: number
  images: string[]
}

export default function Models() {
  const [models, setModels] = useState<Model[]>([])
  useEffect(() => {
    api.get("/models").then(r => setModels(r.data.models || []))
  }, [])

  return (
    <div style={{ color: "#eaeef2" }}>
      <h1 style={{ margin: "0 0 20px", fontSize: 28, fontWeight: 800 }}>Models</h1>

      {/* one-by-one vertical list */}
      <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
        {models.map(m => (
          <Link
            key={m.slug}
            to={`/models/${m.slug}`}
            style={{
              display: "flex",
              flexDirection: "column",
              background: "#111",
              border: "1px solid #222",
              borderRadius: 18,
              overflow: "hidden",
              textDecoration: "none",
              color: "inherit",
              boxShadow: "0 4px 12px rgba(0,0,0,.4)",
              transform: "translateY(0) scale(1)",
              transition: "transform .35s ease, box-shadow .35s ease",
            }}
            onMouseEnter={(e) => {
              const card = e.currentTarget
              card.style.transform = "translateY(-6px) scale(1.05)"
              card.style.boxShadow = "0 16px 36px rgba(0,0,0,.65)"
              const img = card.querySelector("img") as HTMLImageElement | null
              if (img) img.style.transform = "scale(1.15)"
            }}
            onMouseLeave={(e) => {
              const card = e.currentTarget
              card.style.transform = "translateY(0) scale(1)"
              card.style.boxShadow = "0 4px 12px rgba(0,0,0,.4)"
              const img = card.querySelector("img") as HTMLImageElement | null
              if (img) img.style.transform = "scale(1)"
            }}
          >
            <div style={{ position: "relative", overflow: "hidden" }}>
              {m.images?.[0] && (
                <img
                  src={m.images[0]}
                  alt={m.name}
                  style={{ width: "100%", height: 340, objectFit: "cover", transition: "transform .6s ease" }}
                  loading="lazy"
                />
              )}
            </div>

            <div style={{ padding: "20px 24px" }}>
              <div style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px" }}>{m.name}</div>
              <div style={{ fontSize: 15, color: "#aaa" }}>
                Starting at ₹{m.basePrice.toLocaleString("en-IN")}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
