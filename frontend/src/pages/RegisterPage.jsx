import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { authApi } from '../api/client'
import { useAuth } from '../contexts/AuthContext'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const getErrorMessage = (error) => {
    const payload = error?.response?.data
    if (!payload) return 'Cannot reach server. Start backend on port 5000.'
    if (payload.errors?.length) return payload.errors[0].msg || payload.message
    return payload.message || 'Registration failed'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const { data } = await authApi.register({
        ...form,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
      })
      login({ accessToken: data.token, profile: data.user })
      toast.success('Account created')
      navigate('/')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0f1a] p-4">
      <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="card w-full max-w-md space-y-4">
        <h1 className="text-xl font-bold text-gradient">Create Account</h1>
        <input className="input" placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Password" type="password" minLength={6} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn-primary w-full" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
        <p className="text-center text-sm text-slate-300">Already have an account? <Link className="text-cyan-300" to="/login">Login</Link></p>
      </motion.form>
    </div>
  )
}
