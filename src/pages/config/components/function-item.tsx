import { Card } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Skeleton } from '@/components/ui/skeleton'
import type { AbiItem } from '@/repositories/contracts'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import FunctionDetails from './function-details'

export function FunctionItemSkeleton() {
  return (
    <Card className="flex flex-row gap-4 shadow-none p-4 overflow-hidden rounded-2xl items-center justify-between">
      <div className="flex flex-col gap-2 w-full">
        <Skeleton className="h-6 w-1/2 animate-pulse" />
        <Skeleton className="h-4 w-1/4 animate-pulse" />
        <Skeleton className="h-4 w-1/4 animate-pulse" />
      </div>
      <Skeleton className="h-8 w-8 animate-pulse" />
    </Card>
  )
}

export function FunctionItem({
  functionAbi,
  contractAddress,
}: {
  functionAbi: AbiItem
  contractAddress: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="shadow-none p-0 overflow-hidden rounded-2xl">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        key={`${functionAbi.name}>${functionAbi.inputs?.map((input) => `${input.name}:${input.type}`).join('-')}`}
        className="flex flex-col"
      >
        <CollapsibleTrigger className={`cursor-pointer ${isOpen ? '' : 'hover:bg-muted'}`}>
          <div
            className={`text-start rounded-lg flex justify-between gap-2 p-2 m-2 items-center ${isOpen ? 'bg-muted' : ''}`}
          >
            <div className="break-all">
              <p className="font-medium">{functionAbi.name}</p>
              {functionAbi.inputs?.map((input) => (
                <p key={`${input.name}-${input.type}`} className="text-sm text-muted-foreground">
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
          <FunctionDetails functionAbi={functionAbi} contractAddress={contractAddress} />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
