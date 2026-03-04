import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { budgetApi } from "../api/client"
import { useAuth } from "../contexts/AuthContext"

export default function ProfilePage() {
  const { user } = useAuth()
  const [tenDayLimit, setTenDayLimit] = useState("")
  const [budget, setBudget] = useState(null)

  const loadBudget = async () => {
    try {
      const data = await budgetApi.get()
      setBudget(data)
      if (data.tenDayLimit) setTenDayLimit(data.tenDayLimit)
    } catch {
      toast.error("Failed to load budget")
    }
  }

  useEffect(() => {
    loadBudget()
  }, [])

  const saveBudget = async (e) => {
    e.preventDefault()
    try {
      await budgetApi.set({ tenDayLimit: Number(tenDayLimit) })
      toast.success("10-day budget updated")
      loadBudget()
    } catch {
      toast.error("Unable to update budget")
    }
  }

  return (
    <div className="space-y-4">
      <div className="card space-y-1">
        <h3 className="font-semibold text-gradient">Profile</h3>
        <p className="text-sm text-slate-300">Name: {user?.name}</p>
        <p className="text-sm text-slate-300">Email: {user?.email}</p>
      </div>

      <form className="card space-y-3" onSubmit={saveBudget}>
        <h3 className="font-semibold text-gradient">10-Day Budget (INR)</h3>
        <input className="input" type="number" min="1" value={tenDayLimit} onChange={(e) => setTenDayLimit(e.target.value)} placeholder="Spending limit for next 10 days" />
        <button className="btn-primary" type="submit">Save Budget</button>
        {budget ? (
          <div>
            <p className="text-sm text-slate-300">Current usage: {Math.round(budget.usagePct || 0)}% {budget.warning ? "(Warning: above 80%)" : ""}</p>
            <div className="mt-2 h-2 rounded-full bg-slate-900/70">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, budget.usagePct || 0)}%` }}
                transition={{ duration: 0.3 }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
              />
            </div>
          </div>
        ) : null}
      </form>

      <div className="card text-sm text-slate-300">
        Set your spending limit for a rolling 10-day period. Install this app on mobile from your browser menu for a full app-like experience.
      </div>
    </div>
  )
}
