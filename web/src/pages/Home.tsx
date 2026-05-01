// src/pages/Home.tsx
import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div>
      {/* ===== FULLSCREEN VIDEO HERO ===== */}
      <section
        style={{
          position: "relative",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          margin: 0,
          background: "#000"
        }}
      >
        <video
          src="/videos/porsche.mp4"        // make sure this exists in /public/videos
          poster="/videos/landing.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />

        {/* gradient overlay for legibility */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.10) 70%, rgba(0,0,0,0.05) 100%)"
          }}
        />

        {/* Headline + CTA */}
        <div
          style={{
            position: "absolute",
            left: "6vw",
            bottom: "22vh",
            color: "white",
            zIndex: 2
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(56px, 12vw, 128px)",
              fontWeight: 800,
              lineHeight: 1
            }}
          >
            Macan.
          </h1>
          <Link
            to="/models/macan-s"
            style={{
              display: "inline-block",
              marginTop: 24,
              padding: "12px 20px",
              border: "1px solid rgba(255,255,255,.85)",
              borderRadius: 8,
              color: "white",
              background: "rgba(0,0,0,.25)",
              textDecoration: "none",
              backdropFilter: "blur(4px)"
            }}
          >
            Discover more
          </Link>
        </div>

        {/* Scroll cue */}
        <div
          style={{
            position: "absolute",
            bottom: 56,
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            opacity: 0.9,
            fontSize: 22,
            zIndex: 2
          }}
        >
          ↓
        </div>

        {/* Legal line */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            color: "rgba(255,255,255,.85)",
            fontSize: 12,
            textAlign: "center",
            zIndex: 2,
            whiteSpace: "nowrap"
          }}
        >
          Electrical consumption combined (WLTP): 19.8–17.0 kWh/100 km, CO₂ emissions
          combined (WLTP): 0 g/km
        </div>
      </section>

      {/* ===== WELCOME / INTRO ===== */}
      <section
        style={{
          maxWidth: 1200,
          margin: "60px auto",
          padding: "0 16px",
          color: "#eaeef2"
        }}
      >
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
          Welcome to the MotoMind Experience
        </h2>
        <p style={{ color: "#9aa", fontSize: 16, lineHeight: 1.7 }}>
          Explore models, view specs, configure trims, and save to your garage.
        </p>
        <p style={{ marginTop: 16 }}>
          <Link to="/models" style={{ textDecoration: "underline" }}>
            Browse all models →
          </Link>
        </p>
      </section>

      {/* ===== ABOUT / BIO / CREDITS / FOOTER ===== */}
      <section
        style={{ background: "#0b0d10", color: "#eaeef2", padding: "64px 24px" }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {/* About project */}
          <h2
            style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "16px" }}
          >
            About this project
          </h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "#b0b8c1" }}>
            This MotoMind web app was developed by{" "}
            <strong>Karinigam S A</strong> as part of my MCA Capstone Project.
            The goal was to combine <strong>React + Express + Tailwind</strong>{" "}
            with real-time configuration and modern design to replicate the
            Luxury car experience in a learning context.
          </p>

          {/* Bio */}
          <div style={{ marginTop: "32px" }}>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 700 }}>About me</h3>
            <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "#b0b8c1" }}>
              I’m Karinigam, a final-semester MCA student passionate about{" "}
              <strong>AI, Machine Learning, and Full-Stack Development</strong>.
              Through this project, I aimed to showcase my ability to build a
              production-style UI, integrate APIs, and deliver a smooth user
              experience.
            </p>
          </div>

          {/* Credits */}
          <div style={{ marginTop: "32px" }}>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 700 }}>Credits</h3>
            <ul
              style={{
                margin: "8px 0 0 16px",
                color: "#b0b8c1",
                lineHeight: 1.8
              }}
            >
              <li>Frontend: React + Vite + TailwindCSS</li>
              <li>Backend: Node.js + Express</li>
              <li>Styling Inspiration: Porsche Official Website</li>
              <li>Images & videos: Unsplash / Porsche assets</li>
            </ul>
          </div>

          {/* Footer */}
          <footer
            style={{
              marginTop: "48px",
              borderTop: "1px solid #222",
              paddingTop: "24px",
              textAlign: "center"
            }}
          >
            <p style={{ fontSize: "0.9rem", color: "#7d8895", margin: 0 }}>
              © {new Date().getFullYear()} Karinigam S A · All rights reserved.
            </p>
            <p style={{ fontSize: "0.9rem", color: "#7d8895", margin: "6px 0 0" }}>
              Built with pure love for automobiles, academic and learning purposes.
            </p>
          </footer>
        </div>
      </section>
    </div>
  )
}
