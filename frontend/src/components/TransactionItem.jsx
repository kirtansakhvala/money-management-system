import { useSwipeable } from 'react-swipeable'

export default function TransactionItem({ item, onDelete }) {
  const handlers = useSwipeable({
    onSwipedLeft: () => onDelete?.(item.id),
    preventScrollOnSwipe: true,
    trackMouse: true,
  })

  return (
    <div {...handlers} className="rounded-xl border border-cyan-300/20 bg-slate-950/40 p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{item.category}</p>
          <p className="text-xs text-slate-400">{item.note || 'No note'} • {item.date?.slice(0, 10)}</p>
        </div>
        <p className="font-semibold text-fuchsia-300">₹ {Number(item.amount).toLocaleString('en-IN')}</p>
      </div>
      <p className="mt-2 text-[11px] text-cyan-300/70">Swipe left to delete</p>
    </div>
  )
}
