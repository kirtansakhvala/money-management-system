import { NavLink } from "react-router-dom"
import { BarChart3, CircleDollarSign, Home, PlusCircle, User } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

const links = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/add-expense", label: "Add Expense", icon: PlusCircle },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: User },
]

export default function Sidebar() {
  const { user } = useAuth()

  return (
    <aside className="cyber-panel hidden w-72 p-4 md:block">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Pilot</p>
        <h1 className="text-xl font-bold text-gradient">Money Nexus</h1>
        <p className="mt-1 text-sm text-slate-300">{user?.name || "Student"}</p>
      </div>

      <div className="mb-5 space-y-2 rounded-2xl border border-cyan-300/20 bg-slate-950/40 p-3">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Stats</p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Balance</span>
          <span className="font-semibold text-cyan-200">Live on dashboard</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Income</span>
          <span className="font-semibold text-violet-200">Open summary</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Expense</span>
          <span className="font-semibold text-fuchsia-200">Open summary</span>
        </div>
      </div>

      <nav className="space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition " +
              (isActive
                ? "border border-cyan-300/35 bg-cyan-400/12 font-semibold text-cyan-100 shadow-[0_0_14px_rgba(0,240,255,0.2)]"
                : "border border-transparent text-slate-300 hover:border-violet-300/30 hover:bg-violet-500/10 hover:text-violet-100")
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-5 rounded-2xl border border-fuchsia-400/25 bg-fuchsia-500/10 p-3 text-xs text-fuchsia-100">
        <div className="mb-2 flex items-center gap-2 font-semibold">
          <CircleDollarSign size={14} />
          Level System
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-900/70">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
        </div>
        <p className="mt-2 text-[11px] text-fuchsia-100/80">Level 6 • XP 67%</p>
      </div>
    </aside>
  )
}
