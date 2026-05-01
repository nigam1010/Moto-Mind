import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { api } from "../api"

export default function ModelDetails() {
  const { slug } = useParams()
  const [item, setItem] = useState<any>(null)

  useEffect(() => {
    api.get(`/models/${slug}`).then(r => setItem(r.data.model))
  }, [slug])

  if (!item) return <div>Loading…</div>

  const specs = [
    { label: "Base price", value: `₹${item.basePrice.toLocaleString("en-IN")}` },
    item?.specs?.horsepower != null && { label: "Horsepower", value: `${item.specs.horsepower} hp` },
    item?.specs?.torque != null && { label: "Torque", value: `${item.specs.torque} Nm` },
    item?.specs?.acceleration_0_100 && { label: "0–100 km/h", value: `${item.specs.acceleration_0_100}s` },
    item?.specs?.topSpeed && { label: "Top speed", value: `${item.specs.topSpeed} km/h` },
    item?.specs?.drivetrain && { label: "Drivetrain", value: item.specs.drivetrain }
  ].filter(Boolean) as {label:string; value:string}[]

  const imgs: string[] = item.images?.length ? item.images : []

  return (
    <div>
      {/* Fullscreen hero */}
      <section style={{ position: "relative", height: "100vh", width: "100vw", overflow: "hidden",right: 195}}>
        {imgs[0] && (
          <img
            src={imgs[0]}
            alt={item.name}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
        <div
          style={{
            position: "absolute", inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.10) 70%, rgba(0,0,0,0.05) 100%)"
          }}
        />
        <div style={{ position: "absolute", left: "6vw", bottom: "22vh", color: "#fff", zIndex: 2 }}>
          <h1 style={{ margin: 0, fontSize: "clamp(56px, 12vw, 128px)", fontWeight: 800, lineHeight: 1 }}>
            {item.name}
          </h1>
          <Link
            to={`/configure/${item.slug}`}
            style={{
              display: "inline-block",
              marginTop: 24,
              padding: "12px 20px",
              border: "1px solid rgba(255,255,255,.85)",
              borderRadius: 8,
              color: "#fff",
              background: "rgba(0,0,0,.25)",
              textDecoration: "none",
              backdropFilter: "blur(4px)"
            }}
          >
            Configure
          </Link>
        </div>
      </section>

      {/* Showcase specs: one per image */}
      <section style={{ textAlign: "center", margin: "80px 0" }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 40 }}>Specifications</h2>

        <div style={{ display: "grid", gap: 60 }}>
          {specs.map((spec, idx) => (
            <div key={idx} style={{ position: "relative", height: "80vh", overflow: "hidden" }}>
              {/* Background car image */}
              <img
                src={imgs[idx % imgs.length]}
                alt={spec.label}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }}
              />
              {/* Overlay text */}
              <div
                style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.2))",
                  display: "flex", flexDirection: "column",
                  alignItems: "end", justifyContent: "flex-end",
                  color: "#fff", textAlign:"center", padding: 20
                }}
              >
                <h3 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>{spec.label}</h3>
                <p style={{ fontSize: 22, fontWeight: 500 }}>{spec.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All specs again (document style) */}
      <section style={{ maxWidth: 800, margin: "80px auto", padding: "0 16px" }}>
        <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 700, marginBottom: 24 }}>
          Full Specification Sheet
        </h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 18, lineHeight: 1.8, color: "#ddd" }}>
          {specs.map((spec, i) => (
            <li key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,.1)", padding: "8px 0" }}>
              <span style={{ fontWeight: 600 }}>{spec.label}</span>
              <span>{spec.value}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
