import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

export default function FabButton() {
  return (
    <Link
      to="/add-expense"
      className="fixed bottom-20 right-4 z-20 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 p-4 text-slate-950 shadow-[0_0_26px_rgba(0,240,255,0.35)] transition duration-300 hover:scale-110 md:hidden"
      aria-label="Add Expense"
    >
      <Plus size={20} />
    </Link>
  )
}
