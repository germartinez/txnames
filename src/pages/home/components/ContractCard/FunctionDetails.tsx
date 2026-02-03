import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { AbiItem } from '@/repositories/contracts'
import { useChainId, useConnection, useEnsName } from 'wagmi'

export default function FunctionDetails({ item }: { item: AbiItem }) {
  const chainId = useChainId()
  const { address } = useConnection()
  const { data: ensName } = useEnsName({ address, chainId })

  return (
    <div className="m-2 mt-2 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-sm">Parameters</p>
        {item.inputs?.map((input) => (
          <div key={input.name}>
            <Input type="text" placeholder={`${input.name} (${input.type})`} />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm">Transaction name</p>
        <div className="flex gap-2">
          <Input type="text" placeholder={`${item.name.toLowerCase()}-1`} className="flex-1" />
          {ensName && <div className="flex items-center justify-center mr-1">.{ensName}</div>}
        </div>
      </div>
      <Button className="w-full" disabled={!ensName}>
        Save
      </Button>
    </div>
  )
}
