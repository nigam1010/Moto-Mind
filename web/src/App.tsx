import { Link, Outlet, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import MenuOverlay from "./components/MenuOverlay"
import Chatbot from "./components/Chatbot"

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === "/"

  useEffect(() => {
    const open = () => setMenuOpen(true)
    window.addEventListener("open-menu", open as any)
    return () => window.removeEventListener("open-menu", open as any)
  }, [])

  return (
    <div style={{ minHeight: "100%", background: "#0a0a0a", color: "#f5f5f5" }}>
      {/* TOP BAR — transparent over hero on home, solid on inner pages */}
      <header
        style={{
          position: isHome ? "absolute" : "sticky",
          top: 0, left: 0, right: 0, zIndex: 30,
          padding: "16px 24px",
          background: isHome ? "transparent" : "rgba(0,0,0,.85)",
          borderBottom: isHome ? "none" : "1px solid rgba(255,255,255,.08)",
          backdropFilter: isHome ? "none" : "saturate(160%) blur(6px)"
        }}
      >
        {/* center logo: parent is relative; left/right controls, centered absolute */}
        <div style={{ position: "relative", height: 40 }}>
          {/* Left: Menu */}
          <div
            style={{
              position: "absolute", left: 43, top: 4, height: 40,
              display: "flex", alignItems: "center"
            }}
          >
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              style={{
                background: "transparent", border: 0, color: "#fff", cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 8, fontSize: 16,
                textShadow: "0 0 6px rgba(43,40,40,0.5)"
              }}
            >
              <span style={{ fontSize: 22, lineHeight: 1 }}>≡</span>
              <span>Menu</span>
            </button>
          </div>

          {/* Center: Brand */}
          <Link
            to="/"
            style={{
              position: "absolute",
              left: "50%", top: 0, transform: "translateX(-50%)",
              height: 40, display: "flex", alignItems: "center",
              color: "#fff", letterSpacing: ".35em",
              textTransform: "uppercase", fontWeight: 800, textDecoration: "none"
            }}
          >
            MotoMind
          </Link>

          {/* Right: Account dot → Garage */}
          <div style={{ position: "absolute", right: 0, top: 0, height: 40, display: "flex", alignItems: "center" }}>
            <Link
              to="/garage"
              aria-label="My Garage"
              style={{
                width: 36, height: 36, borderRadius: 18,
                border: "1px solid rgba(255,255,255,.5)",
                background: "rgba(0,0,0,.25)",
                display: "grid", placeItems: "center",
                color: "#fff", textDecoration: "none"
              }}
              title="My Garage"
            >
              ∘
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN — full-bleed on home (no container), container on inner pages */}
      <main
        style={
          isHome
            ? { padding: 0 }
            : { maxWidth: 1200, margin: "0 auto", padding: "16px" }
        }
      >
        <Outlet />
      </main>

      {!isHome && (
        <footer style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px 24px", color: "#9aa" }}>
          © {new Date().getFullYear()} Capstone
        </footer>
      )}

      {/* Overlays / Floating UI */}
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      <Chatbot />
    </div>
  )
}
