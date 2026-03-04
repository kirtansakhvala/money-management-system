import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { Bar, Line } from "react-chartjs-2"
import { motion } from "framer-motion"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend } from "chart.js"
import { expenseApi, reportsApi } from "../api/client"
import useDebounce from "../hooks/useDebounce"
import LoadingSkeleton from "../components/LoadingSkeleton"

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend)

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState({ dateWise: [], monthly: [] })
  const [rows, setRows] = useState([])
  const [filters, setFilters] = useState({ category: "", from: "", to: "", search: "" })
  const debouncedSearch = useDebounce(filters.search, 500)

  const loadData = async () => {
    setLoading(true)
    try {
      const [analyticsRes, expensesRes] = await Promise.all([
        reportsApi.analytics(filters.from || undefined, filters.to || undefined),
        expenseApi.list({
          page: 1,
          limit: 100,
          category: filters.category || undefined,
          from: filters.from || undefined,
          to: filters.to || undefined,
          search: debouncedSearch || undefined,
        }),
      ])

      setAnalytics(analyticsRes)
      setRows(expensesRes.data || [])
    } catch {
      toast.error("Unable to fetch reports")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [filters.category, filters.from, filters.to, debouncedSearch])

  const barData = useMemo(
    () => ({
      labels: (analytics.dateWise || []).map((d) => d.date),
      datasets: [
        {
          label: "Daily Expense (INR)",
          data: (analytics.dateWise || []).map((d) => Number(d.total)),
          backgroundColor: "rgba(0, 240, 255, 0.65)",
          borderColor: "#00f0ff",
          borderWidth: 1,
        },
      ],
    }),
    [analytics.dateWise]
  )

  const lineData = useMemo(
    () => ({
      labels: (analytics.monthly || []).map((m) => m.month),
      datasets: [
        {
          label: "Monthly Expense",
          data: (analytics.monthly || []).map((m) => Number(m.total)),
          borderColor: "#8b5cf6",
          backgroundColor: "#8b5cf6",
        },
      ],
    }),
    [analytics.monthly]
  )

  const exportPDF = (filtered = false) => {
    const doc = new jsPDF()
    const title = filtered && (filters.from || filters.to) ? `Expense Report (${filters.from} to ${filters.to})` : "All Expense Report"
    doc.text(title, 14, 15)

    const dataToExport = filtered ? rows : rows
    doc.setFontSize(10)
    autoTable(doc, {
      startY: 22,
      head: [["Date", "Category", "Note", "Amount (INR)"]],
      body: dataToExport.map((r) => [r.date?.slice(0, 10), r.category, r.note || "-", Number(r.amount).toFixed(2)]),
    })

    const fileName = filtered && (filters.from || filters.to) ? `expense-report-${filters.from}-to-${filters.to}.pdf` : "expense-report-all.pdf"
    doc.save(fileName)
  }

  if (loading) return <LoadingSkeleton rows={5} />

  return (
    <div className="space-y-4">
      <div className="card grid gap-2 sm:grid-cols-4">
        <select className="input" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Study">Study</option>
          <option value="Entertainment">Entertainment</option>
        </select>
        <input className="input" type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} placeholder="From date" />
        <input className="input" type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} placeholder="To date" />
        <input className="input" placeholder="Search note/category" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="card">
          <h3 className="mb-3 font-semibold text-gradient">Date-wise Expense</h3>
          <Bar
            data={barData}
            options={{
              indexAxis: "x",
              maintainAspectRatio: true,
              plugins: { legend: { labels: { color: "#a0aec0" } } },
              scales: {
                x: { ticks: { color: "#a0aec0" }, grid: { color: "rgba(160,174,192,0.1)" } },
                y: { ticks: { color: "#a0aec0" }, grid: { color: "rgba(160,174,192,0.1)" } },
              },
            }}
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }} className="card">
          <h3 className="mb-3 font-semibold text-gradient">Monthly Spending Trend</h3>
          <Line
            data={lineData}
            options={{
              plugins: { legend: { labels: { color: "#a0aec0" } } },
              scales: {
                x: { ticks: { color: "#a0aec0" }, grid: { color: "rgba(160,174,192,0.1)" } },
                y: { ticks: { color: "#a0aec0" }, grid: { color: "rgba(160,174,192,0.1)" } },
              },
            }}
          />
        </motion.div>
      </div>

      <div className="card space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold text-gradient">Filtered Transactions ({rows.length})</h3>
          <div className="flex gap-2">
            <button className="btn-primary text-sm" onClick={() => exportPDF(true)}>
              Download Filtered PDF
            </button>
            <button className="btn-secondary text-sm" onClick={() => exportPDF(false)}>
              Download All PDF
            </button>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          {rows.slice(0, 20).map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-xl border border-cyan-300/20 bg-slate-950/40 px-3 py-2">
              <span>
                {r.date?.slice(0, 10)} • {r.category} • {r.note || "-"}
              </span>
              <span className="font-semibold text-fuchsia-300">₹ {Number(r.amount).toLocaleString("en-IN")}</span>
            </div>
          ))}
          {rows.length === 0 && <p className="text-slate-400">No transactions found</p>}
        </div>
      </div>
    </div>
  )
}
