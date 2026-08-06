// cette page ne doit servir que de page d'accueil pour décider où rediriger l'utilisateur
// si connecté --> vers /heists
// si non connecté --> vers /login

import { Clock8 } from "lucide-react"

export default function Home() {
  return (
    <div className="center-content">
      <div className="page-content">
        <h1>
          P<Clock8 className="logo" strokeWidth={2.75} />cket Heist
        </h1>
        <div>Tiny missions. Big office mischief.</div>
        <p className="mt-4">
          Turn your office into a playground. Pocket Heist drops bite-sized challenges
          into your team&apos;s day — sneak a prank past the boss, swap someone&apos;s
          mouse settings, or start a rumor that spreads by lunchtime. No stakes, just
          mischief. Sign up, pick a heist, and see who cracks first.
        </p>
      </div>
    </div>
  )
}
