// src/pages/Login.tsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUser } from "../UserContext"

export default function Login() {
  const { login } = useUser()
  const nav = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", padding: 24, background: "#111", borderRadius: 12, color:"#eaeef2", border:"1px solid #222" }}>
      <h2 style={{marginTop:0}}>Sign in</h2>
      <input
        value={name}
        onChange={e=>setName(e.target.value)}
        placeholder="Name"
        style={{ width:"100%", marginBottom:12, padding:10, borderRadius:8, border:"1px solid #333", background:"#0a0a0a", color:"#eaeef2" }}
      />
      <input
        value={email}
        onChange={e=>setEmail(e.target.value)}
        placeholder="Email"
        style={{ width:"100%", marginBottom:12, padding:10, borderRadius:8, border:"1px solid #333", background:"#0a0a0a", color:"#eaeef2" }}
      />
      <button
        onClick={()=>{
          if (!name || !email) return
          login(name, email)
          nav("/garage")
        }}
        style={{ width:"100%", padding:"12px 14px", borderRadius:10, border:"1px solid #eaeef2", background:"linear-gradient(180deg, rgba(255,255,255,.15), rgba(255,255,255,.08))", color:"#fff", fontWeight:700 }}
      >
        Continue
      </button>
    </div>
  )
}
