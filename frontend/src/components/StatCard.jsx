import { motion } from 'framer-motion'

export default function StatCard({ title, value, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="card"
    >
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{title}</p>
      <h3 className="mt-2 text-xl font-bold text-gradient">₹ {Number(value || 0).toLocaleString('en-IN')}</h3>
      {subtitle ? <p className="mt-1 text-xs text-slate-400">{subtitle}</p> : null}
    </motion.div>
  )
}
