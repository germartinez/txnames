import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/use-debounce'
import { useGetContractFunctionsQuery } from '@/queries/contracts'
import type { AbiItem } from '@/repositories/contracts'
import { useState } from 'react'
import type { PublicClient } from 'viem'
import { useChainId, usePublicClient } from 'wagmi'
import { FunctionItem, FunctionItemSkeleton } from './components/function-item'

export default function ConfigPage() {
  const [address, setAddress] = useState('')
  const debouncedAddress = useDebounce(address, 300)
  const chainId = useChainId()
  const publicClient = usePublicClient()

  const {
    data: contractFunctions,
    isLoading,
    isError,
  } = useGetContractFunctionsQuery({
    chainId: Number(chainId),
    address: debouncedAddress,
    publicClient: publicClient as PublicClient,
  })

  let content: React.ReactNode = null
  if (debouncedAddress) {
    if (isLoading) {
      content = (
        <div className="flex flex-col gap-2">
          <FunctionItemSkeleton />
          <FunctionItemSkeleton />
        </div>
      )
    } else if (isError) {
      content = (
        <Card className="shadow-none p-16 text-center overflow-hidden rounded-none">
          Invalid contract
        </Card>
      )
    } else if (!contractFunctions || contractFunctions.length === 0) {
      content = (
        <Card className="shadow-none p-16 text-center overflow-hidden rounded-none">
          No functions
        </Card>
      )
    } else {
      content = (
        <div className="flex flex-col gap-2">
          {contractFunctions.map((functionAbi: AbiItem) => (
            <FunctionItem
              key={`${functionAbi.name}>${functionAbi.inputs?.map((input) => `${input.name}:${input.type}`).join('-')}`}
              functionAbi={functionAbi}
              contractAddress={debouncedAddress}
            />
          ))}
        </div>
      )
    }
  }

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
      {content}
    </div>
  )
}
