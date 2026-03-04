import { NavLink } from "react-router-dom"
import { BarChart3, Home, PlusCircle, User } from "lucide-react"

const links = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/add-expense", icon: PlusCircle, label: "Add" },
  { to: "/reports", icon: BarChart3, label: "Reports" },
  { to: "/profile", icon: User, label: "Profile" },
]

export default function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-cyan-300/20 bg-[#0b0f1a]/95 pb-safe backdrop-blur-xl md:hidden">
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            "flex flex-col items-center justify-center gap-1 py-2 text-xs " +
            (isActive ? "font-semibold text-cyan-200" : "text-slate-400")
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
