import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, ChevronUp, TrashIcon } from 'lucide-react'
import { useState } from 'react'

export function RecordItem({ record }: { record: { key: string; value: string } }) {
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
            <div className="break-all">{record.key}</div>
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
          <div className="break-all text-xs text-muted-foreground p-2 pt-0 mt-0">
            {record.value}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
