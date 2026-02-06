import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/use-debounce'
import {
  decodeEnsRecordLogs,
  ENS_TXNAMES_RECORD_SUFFIX,
  extractEnsName,
  parseTxNamesEnsRecordKey,
  type EnsName,
} from '@/lib/ens'
import { RecordItemSkeleton } from '@/pages/account/components/record-item'
import { useGetContractLogsQuery } from '@/queries/contracts'
import { useEffect, useMemo, useState } from 'react'
import { keccak256, namehash, toHex, zeroAddress } from 'viem'
import { useChainId, useEnsResolver, useSendTransaction } from 'wagmi'
import MatchingFunctionsList from './components/matching-functions-list'

export default function ExecutionPage() {
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

  const matchingFunctions = useMemo(() => {
    if (!logs) return []

    const logsRecords = decodeEnsRecordLogs(logs, ENS_TXNAMES_RECORD_SUFFIX)
    const results = Object.entries(logsRecords).map(([key, value]) => ({ key, value }))

    const search = fullEnsName?.method?.toLowerCase() ?? ''

    return results.sort((a, b) => {
      if (!search) return a.key.localeCompare(b.key)

      const aMatch = a.key.toLowerCase().includes(search)
      const bMatch = b.key.toLowerCase().includes(search)

      if (aMatch && !bMatch) return -1
      if (!aMatch && bMatch) return 1
      return a.key.localeCompare(b.key)
    })
    //.slice(0, 5)
  }, [logs, fullEnsName])

  const handleExecute = async () => {
    if (!matchingFunctions || !fullEnsName?.ensName) return

    const record = matchingFunctions.find(
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
        <Card className="shadow-none p-16 text-center overflow-hidden rounded-2xl">
          <p className="text-muted-foreground">Invalid ENS</p>
        </Card>
      )
    } else if (!matchingFunctions || matchingFunctions.length === 0) {
      content = (
        <Card className="shadow-none p-16 text-center overflow-hidden rounded-2xl">
          <p className="text-muted-foreground">No named transactions</p>
        </Card>
      )
    } else if (fullEnsName) {
      content = (
        <MatchingFunctionsList
          matchingFunctions={matchingFunctions}
          fullEnsName={fullEnsName}
          handleSelectTransactionName={handleSelectTransactionName}
        />
      )
    }
  }

  return (
    <div className="flex flex-col gap-2 flex-1">
      <Card className="shadow-none p-6 gap-4 overflow-hidden rounded-2xl">
        <CardHeader className="p-0">
          <CardTitle className="text-2xl">Execute Named Transaction</CardTitle>
          <CardDescription className="text-md text-muted-foreground">
            Enter a named transaction to execute it or an ENS name to explore its named
            transactions.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-0 text-sm">
          <Input
            type="text"
            placeholder="method.ensname.eth"
            value={transactionName}
            onChange={handleTransactionNameChange}
            className="w-full"
          />
          <Button
            onClick={handleExecute}
            disabled={sendTransaction.isPending}
            className="w-full cursor-pointer shadow-none"
          >
            {sendTransaction.isPending ? 'Executing...' : 'Execute'}
          </Button>
        </CardContent>
      </Card>
      {content}
    </div>
  )
}
