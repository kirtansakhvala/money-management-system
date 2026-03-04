import { useState } from "react"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { Camera, ShieldCheck, Trash2, Trophy, Zap } from "lucide-react"
import { dashboardApi, expenseApi } from "../api/client"
import StatCard from "../components/StatCard"
import LoadingSkeleton from "../components/LoadingSkeleton"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState("total")
  const [summary, setSummary] = useState(null)
  const [showTodayModal, setShowTodayModal] = useState(false)
  const [todayExpenses, setTodayExpenses] = useState([])
  const [imageModal, setImageModal] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const summaryRes = await dashboardApi.summary(mode)
      setSummary(summaryRes)
      if (summaryRes?.budget?.warning) {
        toast.error("Budget usage crossed 80%")
      }
    } catch {
      toast.error("Failed to load dashboard")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [mode])

  const handleDelete = async (id) => {
    try {
      await expenseApi.remove(id)
      toast.success("Transaction deleted")
      loadData()
    } catch {
      toast.error("Delete failed")
    }
  }

  const handleTodayClick = async () => {
    try {
      const today = new Date().toISOString().slice(0, 10)
      const res = await expenseApi.list({ from: today, to: today })
      setTodayExpenses(res.data || [])
      setShowTodayModal(true)
    } catch {
      toast.error("Failed to load today expenses")
    }
  }

  if (loading) return <LoadingSkeleton rows={5} />

  const usagePct = Math.round(summary?.budget?.usagePct || 0)
  const levelProgress = Math.max(8, Math.min(100, Math.round((Number(summary?.balance || 0) / Math.max(Number(summary?.totalIncome || 1), 1)) * 100)))

  return (
    <div className="space-y-4">
      <div className="card flex gap-2">
        <button onClick={() => setMode("total")} className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition duration-300 ${mode === "total" ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 shadow-[0_0_14px_rgba(0,240,255,0.28)]" : "bg-slate-950/40 text-slate-300 hover:bg-slate-900"}`}>Total Overview</button>
        <button onClick={() => setMode("10day")} className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition duration-300 ${mode === "10day" ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 shadow-[0_0_14px_rgba(0,240,255,0.28)]" : "bg-slate-950/40 text-slate-300 hover:bg-slate-900"}`}>10 Day Overview</button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard title="Total Income" value={summary?.totalIncome} />
        <StatCard title="Total Expenses" value={summary?.totalExpense} />
        <StatCard title="Remaining Balance" value={summary?.balance} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} onClick={handleTodayClick} className="card cursor-pointer transition duration-300 hover:scale-[1.01]">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Today Expense</p>
        <h3 className="mt-2 text-xl font-bold text-fuchsia-300">₹ {Number(summary?.todayExpense || 0).toLocaleString("en-IN")}</h3>
        <p className="mt-1 text-xs text-cyan-200/80">Click to open transaction details</p>
      </motion.div>

      <div className="card">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold text-gradient">10-Day Budget Progress</h3>
          <span className="text-sm text-cyan-200">{usagePct}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-900/70">
          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, summary?.budget?.usagePct || 0)}%` }} transition={{ duration: 0.3 }} className={`h-2 rounded-full bg-gradient-to-r ${(summary?.budget?.usagePct || 0) >= 80 ? "from-fuchsia-400 to-rose-400" : "from-cyan-400 to-violet-500"}`} />
        </div>
        <p className="mt-2 text-xs text-slate-400">₹ {Number(summary?.budget?.tenDayLimit || 0).toLocaleString("en-IN")} limit</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-gradient">Level System</h3>
            <span className="rounded-full border border-violet-300/30 bg-violet-500/15 px-2 py-1 text-xs text-violet-200">Level {Math.max(1, Math.ceil(levelProgress / 20))}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-900/70">
            <motion.div initial={{ width: 0 }} animate={{ width: `${levelProgress}%` }} transition={{ duration: 0.3 }} className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
          </div>
          <p className="mt-2 text-xs text-slate-400">XP based on remaining balance efficiency</p>
        </div>

        <div className="card">
          <h3 className="mb-3 font-semibold text-gradient">Achievements</h3>
          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="rounded-xl border border-cyan-300/25 bg-cyan-500/10 p-2 text-cyan-100"><Trophy size={14} className="mx-auto mb-1" />Saver</div>
            <div className="rounded-xl border border-violet-300/25 bg-violet-500/10 p-2 text-violet-100"><ShieldCheck size={14} className="mx-auto mb-1" />Planner</div>
            <div className="rounded-xl border border-fuchsia-300/25 bg-fuchsia-500/10 p-2 text-fuchsia-100"><Zap size={14} className="mx-auto mb-1" />Streak</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-3 font-semibold">Recent Transactions</h3>
        <div className="space-y-2">
          {(summary?.recentTransactions || []).length === 0 ? (
            <p className="text-sm text-slate-400">No transactions yet.</p>
          ) : (
            summary.recentTransactions.map((item) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} whileHover={{ scale: 1.01 }} className="flex items-start justify-between rounded-xl border border-cyan-300/20 bg-slate-950/40 p-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.category}</p>
                  <p className="text-xs text-slate-400">{item.note || "No note"} • {item.date?.slice(0, 10)}</p>
                  {item.image_url && (
                    <button onClick={() => setImageModal(item.image_url)} className="mt-1 flex items-center gap-1 text-xs text-cyan-200">
                      <Camera size={12} /> View image
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-fuchsia-300">₹ {Number(item.amount).toLocaleString("en-IN")}</p>
                  <button onClick={() => handleDelete(item.id)} className="rounded p-1 text-slate-300 transition hover:bg-slate-900">
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {showTodayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-h-96 w-full max-w-md space-y-3 overflow-auto rounded-2xl border border-cyan-300/20 bg-[rgba(20,25,45,0.95)] p-4 backdrop-blur-xl">
            <h2 className="text-lg font-bold text-gradient">Today Transactions</h2>
            {todayExpenses.length === 0 ? (
              <p className="text-sm text-slate-400">No expenses today.</p>
            ) : (
              todayExpenses.map((exp) => (
                <div key={exp.id} className="rounded-xl border border-cyan-300/20 bg-slate-950/40 p-3">
                  <div className="flex items-start justify-between">
                    <div><p className="text-sm font-medium">{exp.category}</p><p className="text-xs text-slate-400">{exp.note}</p>
                      {exp.image_url && (
                        <button onClick={() => setImageModal(exp.image_url)} className="mt-1 flex items-center gap-1 text-xs text-cyan-200">
                          <Camera size={12} /> View image
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2"><p className="font-semibold text-fuchsia-300">₹ {Number(exp.amount).toLocaleString("en-IN")}</p>
                      <button onClick={() => {handleDelete(exp.id); setShowTodayModal(false)}} className="rounded p-1 text-slate-300 transition hover:bg-slate-900">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
            <button onClick={() => setShowTodayModal(false)} className="w-full rounded-xl border border-cyan-300/25 bg-slate-950/40 py-2 text-cyan-100">Close</button>
          </motion.div>
        </div>
      )}

      {imageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setImageModal(null)}>
          <motion.img initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} src={imageModal} alt="Expense" className="max-h-96 max-w-md rounded-2xl" />
        </div>
      )}
    </div>
  )
}
