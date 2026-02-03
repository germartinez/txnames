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
        <CardTitle>Add Named Transaction</CardTitle>
        <CardDescription>
          Select a contract function and store it as a named transaction in your ENS name.
        </CardDescription>
        <Input
          type="text"
          placeholder="Enter contract address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full"
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
        ) : functions && functions.length === 0 ? (
          <div className="text-red-500 text-center border rounded-xl py-16">No functions</div>
        ) : (
          functions.map((func: AbiItem) => (
            <div
              key={`${func.name}>${func.inputs?.map((input) => `${input.name}:${input.type}`).join('-')}`}
              className="flex justify-between items-center border rounded-xl p-2 gap-4"
            >
              <div className="break-all">
                {func.name}({func.inputs?.map((input) => `${input.type} ${input.name}`).join(', ')})
              </div>
              <Button className="text-xs">Set name</Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
