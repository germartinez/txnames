import { Card } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import type { AbiItem } from '@/repositories/contracts'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import FunctionDetails from './FunctionDetails'

export function FunctionItem({ func }: { func: AbiItem }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="shadow-none p-0 overflow-hidden rounded-none">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        key={`${func.name}>${func.inputs?.map((input) => `${input.name}:${input.type}`).join('-')}`}
        className="flex flex-col"
      >
        <CollapsibleTrigger className={`cursor-pointer ${isOpen ? '' : 'hover:bg-muted'}`}>
          <div
            className={`text-start rounded-lg flex justify-between gap-2 p-2 m-2 items-center ${isOpen ? 'bg-muted' : ''}`}
          >
            <div className="break-all px-2">
              <p className="">{func.name}</p>
              {func.inputs?.map((input) => (
                <p key={`${input.name}-${input.type}`} className="text-xs text-muted-foreground">
                  {input.type} {input.name}
                </p>
              ))}
            </div>
            <div className="p-2 flex items-center justify-center">
              {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <FunctionDetails item={func} />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
