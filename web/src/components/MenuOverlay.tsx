import { Link, useNavigate } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import { api } from "../api"
import { useUser } from "../UserContext" // NEW: user

type Car = {
  slug: string
  name: string
  images?: string[]
  specs?: { fuelType?: string }
}

type Props = { open: boolean; onClose: () => void }
type ActiveTab = "home" | "models" | "garage" | "config"

export default function MenuOverlay({ open, onClose }: Props) {
  const [active, setActive] = useState<ActiveTab>("models")
  const [models, setModels] = useState<Car[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useUser() // NEW: user

  // fetch models when opening (for the Models pane)
  useEffect(() => {
    if (!open) return
    let cancelled = false
    setLoading(true)
    api.get("/models")
      .then(r => { if (!cancelled) setModels(r.data.models || []) })
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [open])

  // close on ESC
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  const go = (path: string) => {
    navigate(path)
    onClose()
  }

  const rightPane = useMemo(() => {
    switch (active) {
      case "models":
        return <ModelsPane items={models} loading={loading} onClose={onClose} />
      case "home":
      case "garage":
      case "config":
      default:
        return <NeutralPane />
    }
  }, [active, models, loading, onClose])

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 50, pointerEvents: open ? "auto" : "none" }}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute", inset: 0,
          background: open ? "rgba(0,0,0,.45)" : "transparent",
          backdropFilter: open ? "blur(3px)" : "none",
          transition: "background .2s ease"
        }}
      />

      {/* Two-pane panel */}
      <div
        style={{
          position: "absolute", top: 0, left: 0, bottom: 0,
          width: "min(1120px, 96vw)",
          display: "grid",
          gridTemplateColumns: "360px 1fr",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform .28s ease",
          boxShadow: "0 40px 80px rgba(0,0,0,.35)",
          borderRight: "1px solid rgba(0,0,0,.08)"
        }}
      >
        {/* Left rail */}
        <aside style={{ background: "rgba(20,20,20,.96)", color: "#fff", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,.12)" }}>
            <div style={{ fontWeight: 800, letterSpacing: ".35em", textTransform: "uppercase" }}>Menu</div>
            <button onClick={onClose} aria-label="Close"
              style={{ background: "transparent", border: 0, color: "#fff", fontSize: 22, cursor: "pointer" }}>×</button>
          </div>

          <nav style={{ padding: 18, display: "grid", gap: 8 }}>
            <RailButton label="Home" onClick={() => go("/")} trailing="›" />
            <RailButton label="Models" active={active === "models"} onClick={() => setActive("models")} trailing="›" />
            <RailButton label="My Garage" onClick={() => go("/garage")} trailing="›" />
            <RailButton label="Configuration" onClick={() => go("/models")} trailing="›" />
          </nav>

          {/* NEW: bottom account */}
          <div style={{ marginTop: "auto", padding: 18, borderTop: "1px solid rgba(255,255,255,.12)" }}>
            {user ? (
              <div style={{ display: "grid", gap: 8 }}>
                <div style={{ fontSize: 13, color: "#cbd3df" }}>
                  Signed in as <strong>{user.name}</strong>
                </div>
                <button
                  onClick={logout}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #2a2f38",
                    background: "rgba(255,255,255,.06)",
                    color: "#eaeef2",
                    cursor: "pointer",
                    fontWeight: 700
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={onClose}
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #2a2f38",
                  background: "rgba(255,255,255,.06)",
                  color: "#eaeef2",
                  textDecoration: "none",
                  fontWeight: 700
                }}
              >
                Login
              </Link>
            )}
          </div>
        </aside>

        {/* Right content */}
        <section style={{ background: "#eef0f3", overflow: "auto" }}>
          {rightPane}
        </section>
      </div>
    </div>
  )
}

/* ---------- Left rail button ---------- */
function RailButton({
  label, onClick, active, trailing
}: { label: string; onClick: () => void; active?: boolean; trailing?: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 14px",
        borderRadius: 12,
        border: active ? "1px solid rgba(255,255,255,.35)" : "1px solid rgba(255,255,255,.12)",
        background: active ? "rgba(255,255,255,.08)" : "rgba(255,255,255,.04)",
        color: "#fff",
        cursor: "pointer"
      }}
    >
      <span>{label}</span>
      {trailing && <span style={{ opacity: .7, fontSize: 18 }}>{trailing}</span>}
    </button>
  )
}

/* ---------- Right pane: models grid ---------- */
function ModelsPane({ items, loading, onClose }:{ items: Car[]; loading: boolean; onClose: () => void }) {
  if (loading) {
    return <div style={{ padding: 24, color: "#3a3a3a" }}>Loading models…</div>
  }
  return (
    <div style={{ padding: "20px 22px" }}>
      <h3 style={{ margin: "6px 0 14px 4px", fontSize: 18, letterSpacing: ".08em", color: "#2b2b2b" }}>Models</h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {items.map(car => (
          <Link
            key={car.slug}
            to={`/models/${car.slug}`}
            onClick={onClose}
            style={{
              display: "block",
              borderRadius: 14,
              overflow: "hidden",
              textDecoration: "none",
              color: "#111",
              background: "#fff",
              border: "1px solid rgba(0,0,0,.06)"
            }}
          >
            <div style={{ aspectRatio: "16/9", background: "#f1f3f6" }}>
              {car.images?.[0] && (
                <img
                  src={car.images[0]}
                  alt={car.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              )}
            </div>
            <div style={{ padding: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700 }}>{car.name}</div>
              <Badge>{(car.specs?.fuelType || guessFuel(car)).toString()}</Badge>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

/* ---------- Right pane placeholder ---------- */
function NeutralPane() { return <div style={{ padding: 24 }} /> }

function Badge({ children }:{children: any}) {
  return (
    <span style={{
      fontSize: 12, color: "#1f1f1f", background: "#eef2f7",
      border: "1px solid rgba(0,0,0,.08)", borderRadius: 999, padding: "3px 8px"
    }}>
      {children}
    </span>
  )
}
function guessFuel(car: Car) {
  const n = car.name.toLowerCase()
  if (n.includes("taycan")) return "Electric"
  return "Gasoline"
}
