import { Link } from "react-router-dom"

type Props = {
  title: string
  ctaHref?: string
  ctaText?: string
  src: string          // /videos/xxx.mp4  (served from /public)
  poster?: string      // /videos/xxx.jpg  (fallback)
  caption?: string     // tiny legal line
}

export default function VideoHero({
  title,
  ctaHref = "/models",
  ctaText = "Discover more",
  src,
  poster,
  caption
}: Props) {
  return (
    <section className="relative isolate min-h-[68vh] overflow-hidden rounded-none">
      {/* VIDEO */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* dark gradient for readability */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55),rgba(0,0,0,0.15))]" />

      {/* CONTENT */}
      <div className="relative mx-auto max-w-6xl px-4 pt-24 pb-16">
        <div className="max-w-2xl">
          <h1 className="text-[12vw] leading-none font-extrabold tracking-tight md:text-7xl">
            {title}
          </h1>

          <div className="mt-6">
            <Link
              to={ctaHref}
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-black/30 px-5 py-2.5 text-white backdrop-blur-md transition hover:bg-white/15"
            >
              {ctaText}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        {caption && (
          <div className="mt-10 text-[11px] text-white/70">
            {caption}
          </div>
        )}
      </div>
    </section>
  )
}
