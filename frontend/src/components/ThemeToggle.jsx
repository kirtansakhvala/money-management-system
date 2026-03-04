import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button onClick={toggleTheme} className="rounded-xl border border-cyan-300/20 bg-slate-950/40 p-2 text-cyan-100 transition duration-300 hover:scale-[1.03] hover:bg-slate-900" type="button">
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
