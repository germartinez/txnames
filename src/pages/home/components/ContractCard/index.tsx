import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/useDebounce'
import { useGetContractFunctionsQuery } from '@/queries/contracts'
import type { AbiItem } from '@/repositories/contracts'
import { useState } from 'react'
import type { PublicClient } from 'viem'
import { useChainId, usePublicClient } from 'wagmi'
import { FunctionItem, FunctionItemSkeleton } from './FunctionItem'

export default function ContractCard() {
  const [address, setAddress] = useState('')
  const debouncedAddress = useDebounce(address, 300)
  const chainId = useChainId()
  const publicClient = usePublicClient()

  const {
    data: functions,
    isFetching,
    isPending,
    isError,
  } = useGetContractFunctionsQuery({
    chainId: Number(chainId),
    address: debouncedAddress,
    publicClient: publicClient as PublicClient,
  })

  return (
    <div className="flex flex-col gap-8 flex-1">
      <Card className="shadow-none p-6 gap-4 overflow-hidden rounded-none">
        <CardHeader className="p-0">
          <CardTitle>Add Named Transaction</CardTitle>
          <CardDescription>
            Select a contract function and store it as a named transaction in your ENS name.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 p-0 text-sm">
          <Input
            type="text"
            placeholder="Enter contract address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full"
          />
        </CardContent>
      </Card>
      {isFetching ? (
        <div className="flex flex-col gap-2">
          <FunctionItemSkeleton />
          <FunctionItemSkeleton />
        </div>
      ) : isPending ? (
        <Card className="shadow-none p-16 text-center overflow-hidden rounded-none">
          <p>List of contract functions</p>
        </Card>
      ) : isError ? (
        <Card className="shadow-none p-16 text-center overflow-hidden rounded-none">
          Invalid contract
        </Card>
      ) : !functions || functions.length === 0 ? (
        <Card className="shadow-none p-16 text-center overflow-hidden rounded-none">
          No functions
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {functions.map((func: AbiItem) => (
            <FunctionItem
              key={`${func.name}>${func.inputs?.map((input) => `${input.name}:${input.type}`).join('-')}`}
              func={func}
            />
          ))}
        </div>
      )}
    </div>
  )
}
