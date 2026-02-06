import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/useDebounce'
import {
  decodeEnsRecordLogs,
  ENS_TXNAMES_RECORD_SUFFIX,
  extractEnsName,
  parseTxNamesEnsRecordKey,
  type EnsName,
} from '@/lib/ens'
import { RecordItemSkeleton } from '@/pages/account/components/EnsCard/RecordItem'
import { useGetContractLogsQuery } from '@/queries/contracts'
import { useEffect, useMemo, useState } from 'react'
import { keccak256, namehash, toHex, zeroAddress } from 'viem'
import { useChainId, useEnsResolver, useSendTransaction } from 'wagmi'

export default function ExecuteCard() {
  const chainId = useChainId()
  const sendTransaction = useSendTransaction()
  const [transactionName, setTransactionName] = useState('')
  const debouncedTransactionName = useDebounce(transactionName, 300)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  const fullEnsName: EnsName | undefined = useMemo(
    () => extractEnsName(debouncedTransactionName),
    [debouncedTransactionName],
  )

  const { data: ensResolver, isError: isErrorEnsResolver } = useEnsResolver({
    name: fullEnsName?.ensName ?? '',
    chainId,
    query: {
      enabled: !!fullEnsName?.ensName,
    },
  })

  const { data: logs, isLoading: isLoadingLogs } = useGetContractLogsQuery({
    chainId,
    address: ensResolver ?? '',
    topic0: keccak256(toHex('TextChanged(bytes32,string,string,string)')),
    topic1: namehash(fullEnsName?.ensName ?? ''),
  })

  useEffect(() => {
    setIsPanelOpen(debouncedTransactionName !== '')
  }, [debouncedTransactionName])

  const decodedLogs = useMemo(() => {
    if (!logs || !fullEnsName?.method) return []

    const search = fullEnsName.method.toLowerCase()

    return Object.entries(decodeEnsRecordLogs(logs, ENS_TXNAMES_RECORD_SUFFIX))
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => {
        const aMatch = search && a.key.toLowerCase().includes(search)
        const bMatch = search && b.key.toLowerCase().includes(search)

        // If one matches and the other doesn't, put the match first
        if (aMatch && !bMatch) return -1
        if (!aMatch && bMatch) return 1

        // Otherwise, sort alphabetically
        return a.key.localeCompare(b.key)
      })
      .slice(0, 5)
  }, [logs, fullEnsName?.method])

  const handleExecute = async () => {
    if (!decodedLogs || !fullEnsName?.ensName) return

    const record = decodedLogs.find(
      (item) =>
        parseTxNamesEnsRecordKey(item.key, fullEnsName.ensName) === debouncedTransactionName,
    )
    if (!record) return

    try {
      const transactionData = JSON.parse(record.value)
      await sendTransaction.mutateAsync({
        to: transactionData.to as `0x${string}`,
        value: BigInt(transactionData.value || 0),
        data: transactionData.data as `0x${string}`,
      })
    } catch (error) {
      console.error('Failed to execute transaction:', error)
    }
  }

  const handleTransactionNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTransactionName(e.target.value)
  }

  const handleSelectTransactionName = (transactionName: string) => {
    setTransactionName(transactionName)
    setIsPanelOpen(false)
  }

  let content: React.ReactNode = null
  if (isPanelOpen) {
    if (isLoadingLogs) {
      content = (
        <div className="flex flex-col gap-2">
          <RecordItemSkeleton />
          <RecordItemSkeleton />
        </div>
      )
    } else if (!ensResolver || ensResolver === zeroAddress || isErrorEnsResolver) {
      content = (
        <Card className="shadow-none p-16 text-center overflow-hidden rounded-none">
          Invalid ENS
        </Card>
      )
    } else if (!decodedLogs || decodedLogs.length === 0) {
      content = (
        <Card className="shadow-none p-16 text-center overflow-hidden rounded-none">
          No named transactions
        </Card>
      )
    } else {
      content = (
        <div className="flex flex-col gap-2">
          {fullEnsName &&
            decodedLogs.map((item) => (
              <Card
                key={item.key}
                className="shadow-none p-4 overflow-hidden rounded-none"
                onClick={() =>
                  handleSelectTransactionName(
                    parseTxNamesEnsRecordKey(item.key, fullEnsName.ensName),
                  )
                }
              >
                <div className="gap break-all text-sm">
                  {parseTxNamesEnsRecordKey(item.key, fullEnsName.ensName)}
                </div>
              </Card>
            ))}
        </div>
      )
    }
  }

  return (
    <div className="flex flex-col gap-8 flex-1">
      <Card className="shadow-none p-6 gap-4 overflow-hidden rounded-none">
        <CardHeader className="p-0">
          <CardTitle>Execute Named Transaction</CardTitle>
          <CardDescription>
            Enter a named transaction (e.g., &quot;something.myens.eth&quot;) to execute it.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-2 p-0 text-sm">
          <Input
            type="text"
            placeholder="something.myens.eth"
            value={transactionName}
            onChange={handleTransactionNameChange}
            className="w-full flex-1"
          />
          <Button onClick={handleExecute} disabled={sendTransaction.isPending} className="min-w-28">
            {sendTransaction.isPending ? 'Executing...' : 'Execute'}
          </Button>
        </CardContent>
      </Card>
      {content}
    </div>
  )
}
