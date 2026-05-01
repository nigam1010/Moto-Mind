import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { api } from "../api"
import { useUser } from "../UserContext"

type Model = {
  slug: string
  name: string
  images?: string[]
  trims?: { name: string; price?: number }[]
  colors?: { code: string; name: string; price?: number }[]
  wheels?: { name: string; price?: number }[]
}

export default function Configurator() {
  const { slug } = useParams()
  const { user } = useUser()
  const nav = useNavigate()

  const [car, setCar] = useState<Model | null>(null)
  const [trimName, setTrimName] = useState("")
  const [colorCode, setColorCode] = useState("")
  const [wheelName, setWheelName] = useState("")
  const [price, setPrice] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  // 1) load selected model
  useEffect(() => {
    if (!slug) return
    api.get(`/models/${slug}`).then((r) => {
      const m: Model = r.data.model
      setCar(m)
      setTrimName(m.trims?.[0]?.name || "")
      setColorCode(m.colors?.[0]?.code || "")
      setWheelName(m.wheels?.[0]?.name || "")
    })
  }, [slug])

  // 2) price whenever any option changes
  useEffect(() => {
    if (!car || !trimName || !colorCode || !wheelName) return
    api
      .post("/config/price", {
        modelSlug: car.slug,
        trimName,
        colorCode,
        wheelName,
      })
      .then((r) => setPrice(r.data))
  }, [car, trimName, colorCode, wheelName])

  // simple live preview image (use first image for now)
  const preview = useMemo(() => car?.images?.[0] ?? "", [car])

  if (!car) return <div style={{ padding: 20 }}>Loading…</div>

  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1.1fr .9fr" }}>
      {/* Left: Visual preview */}
      <div style={{ position: "sticky", top: 16, alignSelf: "start" }}>
        <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid #222", background: "#0c0c0c" }}>
          {preview && (
            <img
              src={preview}
              alt={car.name}
              style={{ width: "100%", height: "58vh", objectFit: "cover" }}
            />
          )}
        </div>
      </div>

      {/* Right: Controls + price */}
      <div>
        <h2 style={{ marginTop: 0, marginBottom: 8, fontSize: 28, fontWeight: 800 }}>
          Configure {car.name}
        </h2>

        {/* TRIM */}
        <Section title="Trim">
          <PillRow
            options={car.trims?.map((t) => ({ key: t.name, label: t.name })) ?? []}
            value={trimName}
            onChange={setTrimName}
          />
        </Section>

        {/* COLOR */}
        <Section title="Color">
          <PillRow
            options={car.colors?.map((c) => ({ key: c.code, label: c.name })) ?? []}
            value={colorCode}
            onChange={setColorCode}
          />
        </Section>

        {/* WHEELS */}
        <Section title="Wheels">
          <PillRow
            options={car.wheels?.map((w) => ({ key: w.name, label: w.name })) ?? []}
            value={wheelName}
            onChange={setWheelName}
          />
        </Section>

        {/* PRICE */}
        <div style={{ border: "1px solid #222", borderRadius: 12, padding: 16, marginTop: 18, background: "#101010" }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Price</div>
          {price ? (
            <div style={{ fontSize: 14 }}>
              <div>Base: ₹{price.breakdown.base.toLocaleString("en-IN")}</div>
              <div>Trim: ₹{price.breakdown.trim.toLocaleString("en-IN")}</div>
              <div>Color: ₹{price.breakdown.color.toLocaleString("en-IN")}</div>
              <div>Wheels: ₹{price.breakdown.wheel.toLocaleString("en-IN")}</div>
              <div
                style={{
                  borderTop: "1px solid #222",
                  marginTop: 8,
                  paddingTop: 8,
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                Total: ₹{price.total.toLocaleString("en-IN")}
              </div>
            </div>
          ) : (
            <div>Calculating…</div>
          )}

          {/* SAVE */}
          <button
            onClick={async () => {
              if (!user) {
                // send to login and return back here after
                nav("/login")
                return
              }
              try {
                setSaving(true)
                await api.post("/config/save", {
                  userId: user.id,
                  modelSlug: car.slug,
                  trimName,
                  colorCode,
                  wheelName,
                  // include an image so Garage can show a thumbnail instantly
                  image: preview,
                })
                alert("Saved to your garage!")
                nav("/garage")
              } finally {
                setSaving(false)
              }
            }}
            disabled={!price || saving}
            style={{
              marginTop: 14,
              width: "100%",
              padding: "12px 14px",
              border: "1px solid #2a2f38",
              borderRadius: 10,
              background: "#fff",
              color: "#000",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {saving ? "Saving…" : "Save configuration"}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------- UI bits ---------- */
function Section({ title, children }: { title: string; children: any }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  )
}

function PillRow({
  options,
  value,
  onChange,
}: {
  options: { key: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {options.map((o) => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          style={{
            padding: "8px 12px",
            borderRadius: 999,
            border: value === o.key ? "1px solid #eaeef2" : "1px solid #2a2f38",
            background: value === o.key ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.06)",
            color: "#eaeef2",
            cursor: "pointer",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
