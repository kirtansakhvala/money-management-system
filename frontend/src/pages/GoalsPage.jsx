import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { goalsApi } from '../api/client'

export default function GoalsPage() {
  const [goals, setGoals] = useState([])
  const [form, setForm] = useState({ title: '', targetAmount: '', savedAmount: 0 })

  const loadGoals = async () => {
    try {
      const { data } = await goalsApi.list()
      setGoals(data || [])
    } catch {
      toast.error('Failed to load goals')
    }
  }

  useEffect(() => {
    loadGoals()
  }, [])

  const addGoal = async (e) => {
    e.preventDefault()
    try {
      await goalsApi.add({ ...form, targetAmount: Number(form.targetAmount), savedAmount: Number(form.savedAmount) })
      toast.success('Goal added')
      setForm({ title: '', targetAmount: '', savedAmount: 0 })
      loadGoals()
    } catch {
      toast.error('Failed to add goal')
    }
  }

  const updateGoal = async (goal) => {
    const increment = Number(prompt('Enter new saved amount', goal.savedAmount) || goal.savedAmount)
    try {
      await goalsApi.update(goal.id, { savedAmount: increment })
      toast.success('Goal updated')
      loadGoals()
    } catch {
      toast.error('Failed to update goal')
    }
  }

  return (
    <div className="space-y-4">
      <form className="card grid gap-3 sm:grid-cols-3" onSubmit={addGoal}>
        <input className="input" placeholder="Goal title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="input" type="number" min="1" placeholder="Target amount" required value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} />
        <button className="btn-primary" type="submit">Create Goal</button>
      </form>

      <div className="grid gap-3 md:grid-cols-2">
        {goals.map((goal) => {
          const pct = Math.min(100, (Number(goal.savedAmount) / Number(goal.targetAmount || 1)) * 100)
          return (
            <motion.div key={goal.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} whileHover={{ scale: 1.01 }} className="card">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold">{goal.title}</h3>
                <button className="rounded-lg border border-cyan-300/25 bg-slate-950/40 px-3 py-1 text-sm text-cyan-100" onClick={() => updateGoal(goal)} type="button">Update</button>
              </div>
              <p className="text-sm text-slate-300">₹ {Number(goal.savedAmount).toLocaleString('en-IN')} / ₹ {Number(goal.targetAmount).toLocaleString('en-IN')}</p>
              <div className="mt-2 h-2 rounded-full bg-slate-900/70">
                <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-1 text-xs text-slate-400">{pct.toFixed(1)}% completed</p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
