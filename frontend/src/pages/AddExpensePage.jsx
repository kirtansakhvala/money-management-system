import { useMemo, useState } from "react"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { Mic, Upload } from "lucide-react"
import { expenseApi, incomeApi } from "../api/client"

const categories = ["Food", "Travel", "Study", "Entertainment"]

const parseVoiceExpense = (text) => {
  const amountMatch = text.match(/(\d+(?:\.\d+)?)/)
  const amount = amountMatch ? Number(amountMatch[1]) : 0
  const lowered = text.toLowerCase()
  const category = categories.find((c) => lowered.includes(c.toLowerCase())) || "Food"
  return { amount, category, note: text }
}

export default function AddExpensePage() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [expenseForm, setExpenseForm] = useState({ amount: "", category: "Food", note: "", date: today })
  const [incomeForm, setIncomeForm] = useState({ amount: "", source: "", date: today })
  const [expenseImage, setExpenseImage] = useState(null)
  const [expenseImagePreview, setExpenseImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const submitExpense = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await expenseApi.add(expenseForm, expenseImage)
      toast.success("Expense added")
      setExpenseForm((prev) => ({ ...prev, amount: "", note: "" }))
      setExpenseImage(null)
      setExpenseImagePreview(null)
    } catch {
      toast.error("Unable to add expense")
    } finally {
      setLoading(false)
    }
  }

  const submitIncome = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await incomeApi.add({ ...incomeForm, amount: Number(incomeForm.amount) })
      toast.success("Income added")
      setIncomeForm((prev) => ({ ...prev, amount: "", source: "" }))
    } catch {
      toast.error("Unable to add income")
    } finally {
      setLoading(false)
    }
  }

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      toast.error("Voice input not supported in this browser")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = "en-IN"
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      const parsed = parseVoiceExpense(transcript)
      if (!parsed.amount) {
        toast.error("Could not detect amount from voice input")
        return
      }
      setExpenseForm((prev) => ({ ...prev, ...parsed }))
      toast.success("Voice parsed successfully")
    }
    recognition.start()
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB")
        return
      }
      setExpenseImage(file)
      const reader = new FileReader()
      reader.onload = (evt) => setExpenseImagePreview(evt.target?.result)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="card space-y-3" onSubmit={submitExpense}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gradient">Add Expense</h3>
          <button type="button" onClick={startVoiceInput} className="rounded-xl border border-cyan-300/25 bg-slate-950/40 p-2 text-cyan-100 transition duration-300 hover:scale-[1.03]">
            <Mic size={16} />
          </button>
        </div>
        <input className="input" placeholder="Amount (INR)" type="number" min="1" required value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} />
        <select className="input" value={expenseForm.category} onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <input className="input" placeholder="Note" value={expenseForm.note} onChange={(e) => setExpenseForm({ ...expenseForm, note: e.target.value })} />
        <input className="input" type="date" required value={expenseForm.date} onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })} />
        
        <div className="rounded-xl border-2 border-dashed border-cyan-300/25 bg-slate-950/35 p-4 text-center">
          <label className="flex flex-col items-center gap-2">
            <Upload size={20} className="text-cyan-200" />
            <span className="text-sm text-slate-300">Click to upload image</span>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>
        
        {expenseImagePreview && (
          <div className="relative">
            <img src={expenseImagePreview} alt="Preview" className="h-32 w-full rounded-xl object-cover" />
            <button type="button" onClick={() => { setExpenseImage(null); setExpenseImagePreview(null) }} className="absolute right-2 top-2 rounded-full bg-fuchsia-500 p-1 text-white">
              ✕
            </button>
          </div>
        )}
        
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Saving..." : "Add Expense"}
        </button>
      </motion.form>

      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }} className="card space-y-3" onSubmit={submitIncome}>
        <h3 className="font-semibold text-gradient">Add Income</h3>
        <input className="input" placeholder="Amount (INR)" type="number" min="1" required value={incomeForm.amount} onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })} />
        <input className="input" placeholder="Source" required value={incomeForm.source} onChange={(e) => setIncomeForm({ ...incomeForm, source: e.target.value })} />
        <input className="input" type="date" required value={incomeForm.date} onChange={(e) => setIncomeForm({ ...incomeForm, date: e.target.value })} />
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Saving..." : "Add Income"}
        </button>
      </motion.form>
    </div>
  )
}
