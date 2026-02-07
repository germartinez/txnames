import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { encodeSetEnsRecordData } from '@/lib/ens'
import type { AbiItem } from '@/repositories/contracts'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { encodeFunctionData } from 'viem'
import {
  useChainId,
  useConnection,
  useEnsName,
  useEnsResolver,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi'

type FormData = {
  functionName: string
  transactionAlias: string
  [key: string]: string
}

export default function FunctionDetails({
  functionAbi,
  contractAddress,
}: {
  functionAbi: AbiItem
  contractAddress: string
}) {
  const chainId = useChainId()
  const { address } = useConnection()
  const { data: ensName } = useEnsName({ address, chainId })
  const { data: ensResolver } = useEnsResolver({
    name: ensName ?? '',
    chainId,
    query: {
      enabled: !!ensName,
    },
  })

  const { data: hash, mutateAsync: sendTx, isPending: isSigning } = useSendTransaction()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
    confirmations: 1,
    query: {
      enabled: !!hash,
    },
  })

  const { register, handleSubmit, reset } = useForm<FormData>()
  useEffect(() => {
    if (isConfirmed) {
      reset()
    }
  }, [isConfirmed, reset])

  const handleSave = async (data: FormData) => {
    if (!ensResolver || !ensName) return

    const inputValues: string[] = []
    functionAbi.inputs?.forEach((_input, index) => {
      const value = data[`input_${index}`]
      inputValues.push(value)
    })

    const encodedFunctionData = encodeFunctionData({
      abi: [functionAbi],
      functionName: functionAbi.name,
      args: inputValues,
    })
    const ensRecordData = encodeSetEnsRecordData(ensName, {
      key: data.transactionName,
      value: JSON.stringify({
        to: contractAddress,
        value: 0,
        data: encodedFunctionData,
      }),
    })

    try {
      await sendTx({ to: ensResolver, data: ensRecordData })
    } catch (error) {
      console.error(error)
    }
  }

  const isDisabled = !ensName || isSigning || isConfirming
  const buttonLabel = isSigning ? 'Signing...' : isConfirming ? 'Confirming...' : 'Save'

  return (
    <form onSubmit={handleSubmit(handleSave)} className="m-4 mt-2 flex flex-col gap-4">
      {functionAbi.inputs && functionAbi.inputs.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm">Parameters</p>
          {functionAbi.inputs?.map((input, index) => (
            <div key={input.name || index}>
              <Input
                type="text"
                placeholder={`${input.name} (${input.type})`}
                {...register(`input_${index}`)}
                required
              />
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <p className="text-sm">Transaction name</p>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder={`${functionAbi.name.toLowerCase()}-1`}
            className="flex-1"
            {...register('transactionName')}
            required
          />
          {ensName && <div className="flex items-center justify-center mr-1">.{ensName}</div>}
        </div>
      </div>
      <Button type="submit" className="w-full cursor-pointer shadow-none" disabled={isDisabled}>
        {buttonLabel}
      </Button>
    </form>
  )
}
