import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/useDebounce'
import { useGetContractFunctionsQuery } from '@/queries/contracts'
import type { AbiItem } from '@/repositories/contracts'
import { useState } from 'react'
import type { PublicClient } from 'viem'
import { useChainId, usePublicClient } from 'wagmi'
import { FunctionItem } from './FunctionItem'

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
    <Card className="shadow-none rounded-3xl p-2 gap-2 flex-1 border-0">
      <CardHeader className="p-6 border rounded-xl bg-muted">
        <CardTitle>Add Named Transaction</CardTitle>
        <CardDescription>
          Select a contract function and store it as a named transaction in your ENS name.
        </CardDescription>
        <Input
          type="text"
          placeholder="Enter contract address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full bg-white"
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-0 text-sm">
        {isFetching ? (
          <div className="text-gray-500 text-center border rounded-xl p-16">Loading...</div>
        ) : isPending ? (
          <div className="text-gray-500 text-center border rounded-xl p-16">
            <p>List of contract functions</p>
          </div>
        ) : isError ? (
          <div className="text-red-500 text-center border rounded-xl py-16">Invalid contract</div>
        ) : !functions || functions.length === 0 ? (
          <div className="text-red-500 text-center border rounded-xl py-16">No functions</div>
        ) : (
          functions.map((func: AbiItem) => (
            <FunctionItem
              key={`${func.name}>${func.inputs?.map((input) => `${input.name}:${input.type}`).join('-')}`}
              func={func}
            />
          ))
        )}
      </CardContent>
    </Card>
  )
}
