import { useEffect, useState } from "react"
import { api } from "../api"

type Model = {
  slug: string
  name: string
  basePrice: number
  images?: string[]
  specs?: { horsepower?: number }
}

type Msg = { from: "user" | "bot"; text: string }

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Msg[]>([
    { from: "bot", text: "Hi! Ask me things like: 'Which has the highest horsepower?', 'Recommend under 1 crore', or 'Compare Taycan and Macan'." }
  ])
  const [models, setModels] = useState<Model[]>([])

  useEffect(() => {
    api.get("/models").then(r => setModels(r.data.models || [])).catch(()=>setModels([]))
  }, [])

  // Removed unused bySlug variable

  function parseBudget(msg: string): number | null {
    const m = msg.toLowerCase()
    // grab number like 75, 0.75, 1.2 etc
    const numMatch = m.match(/(\d+(\.\d+)?)/)
    if (!numMatch) return null
    let n = parseFloat(numMatch[0])

    if (m.includes("crore")) n *= 10000000
    else if (m.includes("lakh") || m.includes("lakhs")) n *= 100000
    else if (m.includes("k")) n *= 1000
    // otherwise assume INR amount already
    return Math.round(n)
  }

  function findModelByNameFragment(msg: string): Model[] {
    const q = msg.toLowerCase()
    return models.filter(m =>
      m.name.toLowerCase().includes(q) ||
      q.includes(m.slug.toLowerCase())
    )
  }

  async function onSend() {
    const q = input.trim()
    if (!q) return
    setMessages(m => [...m, { from: "user", text: q }])
    setInput("")

    const L = q.toLowerCase()

    // Highest horsepower
    if (L.includes("horsepower") || L.includes("hp")) {
      const best = [...models].sort((a,b)=>(b.specs?.horsepower||0)-(a.specs?.horsepower||0))[0]
      if (best) {
        setMessages(m => [...m, { from: "bot", text:
          `Highest horsepower: ${best.name} (${best.specs?.horsepower ?? "N/A"} HP). Base price: ₹${best.basePrice.toLocaleString("en-IN")}.`
        }])
        return
      }
    }

    // Budget recommendation
    if (L.includes("budget") || L.includes("under") || L.includes("below") || L.includes("price")) {
      const budget = parseBudget(L)
      if (budget) {
        const hits = models.filter(m => m.basePrice <= budget)
        if (hits.length) {
          const list = hits.map(h => `${h.name} (₹${h.basePrice.toLocaleString("en-IN")})`).join("; ")
          setMessages(m => [...m, { from: "bot", text: `Within your budget: ${list}.` }])
        } else {
          setMessages(m => [...m, { from: "bot", text: "No models fit that budget. Try a higher amount or say 'under 1 crore'." }])
        }
        return
      }
    }

    // Compare two models by horsepower
    if (L.includes("compare")) {
      const names = ["911", "carrera", "taycan", "macan"]
      const found: Model[] = []
      names.forEach(n => { if (L.includes(n)) found.push(...findModelByNameFragment(n)) })
      const unique = Array.from(new Map(found.map(f => [f.slug, f])).values())
      if (unique.length >= 2) {
        const [a,b] = unique.slice(0,2)
        const ah = a.specs?.horsepower ?? 0, bh = b.specs?.horsepower ?? 0
        const stronger = ah === bh ? "Both are similar in power." : (ah > bh ? `${a.name} is more powerful by ${ah-bh} HP.` : `${b.name} is more powerful by ${bh-ah} HP.`)
        setMessages(m => [...m, { from: "bot", text:
          `${a.name}: ${ah} HP; ${b.name}: ${bh} HP. ${stronger}`
        }])
        return
      }
    }

    // Default
    setMessages(m => [...m, { from: "bot", text:
      "I’m still learning 🤖. Try: 'highest horsepower', 'recommend under 75 lakhs', or 'compare Taycan and Macan'."
    }])
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Open assistant"
        style={{
          position: "fixed", right: 20, bottom: 20, width: 60, height: 60,
          borderRadius: "50%", border: "1px solid #2a2f38", background: "#000", color: "#fff",
          boxShadow: "0 12px 30px rgba(0,0,0,.4)", zIndex: 60, cursor: "pointer", fontSize: 22
        }}
      >💬</button>

      {/* Panel */}
      {open && (
        <div style={{
          position: "fixed", right: 20, bottom: 90, width: 320, height: 430, zIndex: 60,
          background: "#0f1115", color: "#e6e8ec", border: "1px solid #2a2f38",
          borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden"
        }}>
          <div style={{ padding: "10px 12px", borderBottom: "1px solid #222", fontWeight: 700 }}>
            MotoMind Assistant
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ margin: "6px 0", textAlign: m.from === "user" ? "right" : "left" }}>
                <span style={{
                  display: "inline-block",
                  background: m.from === "user" ? "#1f2630" : "#141820",
                  border: "1px solid #262b34", borderRadius: 12, padding: "8px 10px", maxWidth: "85%"
                }}>
                  {m.text}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", borderTop: "1px solid #222" }}>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => (e.key === "Enter") && onSend()}
              placeholder="Ask me…"
              style={{ flex: 1, background: "transparent", border: "none", color: "#fff", padding: 10, outline: "none" }}
            />
            <button onClick={onSend} style={{ padding: "10px 12px", background: "#000", color: "#fff", border: "none" }}>➤</button>
          </div>
        </div>
      )}
    </>
  )
}
