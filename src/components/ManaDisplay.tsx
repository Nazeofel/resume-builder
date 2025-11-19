import { cn } from '@/lib/utils'

interface ManaDisplayProps {
  mana?: number
  maxMana?: number
  onClick?: () => void
  className?: string
}

export function ManaDisplay({ mana, maxMana, onClick, className }: ManaDisplayProps) {
  const percentage = mana && maxMana ? (mana / maxMana) * 100 : 0

  return (
    <button
      type="button"
      className={cn(
        "flex items-center gap-2 hover:scale-105 transition-transform duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md p-2",
        className
      )}
      aria-label={`Mana balance: ${mana ?? 0} out of ${maxMana ?? 0}`}
      role="button"
      onClick={onClick}
    >
      <span className="text-primary text-lg" aria-hidden="true">
        ⚡
      </span>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-foreground">
          {mana ?? '--'}/{maxMana ?? '--'} Mana
        </span>
        <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </button>
  )
}
