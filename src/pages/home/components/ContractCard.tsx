import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/useDebounce'
import { useGetContractFunctionsQuery } from '@/queries/contracts'
import type { AbiItem } from '@/repositories/contracts'
import { useState } from 'react'
import { useChainId } from 'wagmi'

export default function ContractCard() {
  const [address, setAddress] = useState('')
  const debouncedAddress = useDebounce(address, 300)
  const chainId = useChainId()

  const {
    data: functions,
    isFetching,
    isPending,
    isError,
  } = useGetContractFunctionsQuery({ chainId: Number(chainId), address: debouncedAddress })

  return (
    <Card className="shadow-none rounded-3xl p-2 gap-2 flex-1">
      <CardHeader className="p-6 border rounded-xl">
        <CardTitle>Search for a contract</CardTitle>
        <CardDescription>
          Enter the contract address and select the chain to search for the contract functions.
        </CardDescription>
        <Input
          type="text"
          placeholder="Enter contract address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full"
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-0">
        {isFetching ? (
          <div className="text-gray-500 text-center border rounded-xl p-16">Loading...</div>
        ) : isPending ? (
          <div className="text-gray-500 text-center border rounded-xl p-16">
            <p>TX_NAMES allows you to name your transactions.</p>
            <p>Search for a contract to get started.</p>
          </div>
        ) : isError ? (
          <div className="text-red-500 text-center border rounded-xl py-16">Invalid contract</div>
        ) : functions && functions.length === 0 ? (
          <div className="text-red-500 text-center border rounded-xl py-16">No functions</div>
        ) : (
          functions &&
          functions.length > 0 &&
          functions.map((func: AbiItem) => (
            <div
              key={`${func.name}>${func.inputs?.map((input) => `${input.name}:${input.type}`).join('-')}`}
              className="flex justify-between items-center border rounded-xl p-2 gap-4"
            >
              <div className="break-all">
                {func.name}({func.inputs?.map((input) => input.name).join(', ')})
              </div>
              <Button>Set name</Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
