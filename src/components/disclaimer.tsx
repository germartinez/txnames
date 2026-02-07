import { cn } from '@/lib/utils'
import { Card, CardContent } from './ui/card'

export function Disclaimer({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        'shadow-none p-6 overflow-hidden rounded-2xl bg-yellow-50 dark:bg-yellow-100/80',
        className,
      )}
    >
      <CardContent className="p-0 dark:text-background">
        This is an experimental product. Use at your own risk and always verify what you sign.
      </CardContent>
    </Card>
  )
}
