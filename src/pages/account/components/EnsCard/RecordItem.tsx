import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Skeleton } from '@/components/ui/skeleton'
import { parseTxNamesEnsRecordKey } from '@/lib/ens'
import { ChevronDown, ChevronUp, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import RecordDetails from './RecordDetails'

export function RecordItemSkeleton() {
  return (
    <Card className="flex flex-row gap-4 shadow-none p-4 overflow-hidden rounded-none items-center justify-between">
      <Skeleton className="h-6 w-1/4 animate-pulse" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8 animate-pulse" />
        <Skeleton className="h-8 w-8 animate-pulse" />
      </div>
    </Card>
  )
}

export function RecordItem({
  record,
  ensName,
}: {
  record: { key: string; value: string }
  ensName: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  return (
    <Card className="shadow-none p-0 overflow-hidden rounded-none">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        key={record.key}
        className={`flex flex-col`}
      >
        <CollapsibleTrigger className={`cursor-pointer ${isOpen ? '' : 'hover:bg-muted'}`}>
          <div
            className={`text-start rounded-lg flex items-center justify-between gap-2 p-2 m-2 ${isOpen ? 'bg-muted' : ''}`}
          >
            <div className="break-all">{parseTxNamesEnsRecordKey(record.key, ensName)}</div>
            <div className="flex items-center justify-center">
              <Button
                variant="ghost"
                className="cursor-pointer hover:opacity-50"
                onClick={handleDelete}
              >
                <TrashIcon className="size-4 text-muted-foreground" />
              </Button>
              <div className="p-2 flex items-center justify-center">
                {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </div>
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <RecordDetails value={record.value} />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
