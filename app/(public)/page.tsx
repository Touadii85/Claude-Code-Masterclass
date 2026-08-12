// cette page ne doit servir que de page d'accueil pour décider où rediriger l'utilisateur
// si connecté --> vers /heists
// si non connecté --> vers /login
// (page marketing pour les visiteurs non connectés, avec CTA d'inscription)

import { Clock8, Target, Trophy, Sparkles, Users } from "lucide-react"
import Link from "next/link"

const features = [
  { icon: Target, label: "Plan Heists" },
  { icon: Users, label: "Assign Tasks" },
  { icon: Trophy, label: "Earn Glory" },
  { icon: Sparkles, label: "Stay Sneaky" },
]

export default function Home() {
  return (
    <div className="center-content text-center">
      <div className="page-content flex flex-col items-center">
        <div className="-rotate-6 rounded-md border-2 border-secondary px-4 py-1 text-sm font-bold tracking-widest text-secondary uppercase">
          Top Secret
        </div>

        <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-primary md:text-6xl">
          P
          <Clock8
            className="logo inline-block text-heading"
            size={44}
            strokeWidth={2.75}
          />
          cket Heist
        </h1>

        <div className="mt-3 text-2xl font-medium text-secondary italic">
          Perfectly petty.
        </div>

        <p className="mt-6 max-w-2xl text-lg text-body">
          The ultimate platform for organizing harmless office pranks and
          mini-missions. Assign sneaky tasks to your colleagues, track your
          active heists, and earn bragging rights as the office&apos;s most
          mischievous mastermind.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {features.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-body"
            >
              <Icon size={16} className="text-primary" />
              {label}
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3 font-bold text-white transition-opacity hover:opacity-90"
          >
            Start Your First Heist
          </Link>
          <Link
            href="/login"
            className="text-sm text-body underline transition-colors hover:text-heading"
          >
            Already a mastermind? Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
