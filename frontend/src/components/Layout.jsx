import { Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, Sparkles } from 'lucide-react'
import Sidebar from './Sidebar'
import ThemeToggle from './ThemeToggle'
import MobileBottomNav from './MobileBottomNav'
import FabButton from './FabButton'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-4 px-3 py-3 md:gap-6 md:px-6 md:py-6">
        <Sidebar />
        <main className="flex-1 pb-24 md:pb-6">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="cyber-panel mb-4 flex items-center justify-between p-4"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Welcome back</p>
              <h2 className="text-lg font-bold text-gradient">{user?.name || 'Student'}</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-2 rounded-xl border border-fuchsia-400/30 bg-fuchsia-400/10 px-3 py-2 text-xs text-fuchsia-200 md:flex">
                <Sparkles size={14} />
                Cyber Mode
              </span>
              <ThemeToggle />
              <button onClick={handleLogout} className="rounded-xl border border-cyan-300/25 bg-slate-950/40 p-2 text-cyan-100 transition hover:scale-[1.03] hover:bg-slate-900" type="button">
                <LogOut size={18} />
              </button>
            </div>
          </motion.header>
          <Outlet />
        </main>
      </div>
      <FabButton />
      <MobileBottomNav />
    </div>
  )
}
