export default function LoadingSpinner({ fullScreen = false }) {
  const content = (
    <div className="flex items-center justify-center py-6">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-300 border-t-violet-400" />
    </div>
  )

  if (fullScreen) {
    return <div className="flex min-h-screen items-center justify-center bg-[#0b0f1a]">{content}</div>
  }
  return content
}
