import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { decodeEnsRecordLogs, ENS_TXNAMES_RECORD_SUFFIX } from '@/lib/ens'
import { useGetContractLogsQuery } from '@/queries/contracts'
import { useMemo } from 'react'
import { keccak256, namehash, toHex } from 'viem'
import { useChainId, useConnection, useEnsName, useEnsResolver } from 'wagmi'
import { RecordItem, RecordItemSkeleton } from './components/record-item'

export default function AccountPage() {
  const chainId = useChainId()
  const { address: connectedAddress } = useConnection()

  const { data: ensName, isLoading: isLoadingEnsName } = useEnsName({
    address: connectedAddress || undefined,
    chainId: Number(chainId),
    query: {
      enabled: !!connectedAddress,
    },
  })

  const { data: ensResolver, isLoading: isLoadingEnsResolver } = useEnsResolver({
    name: ensName || undefined,
    chainId,
    query: {
      enabled: !!ensName,
    },
  })

  const {
    data: logs,
    isLoading: isLoadingLogs,
    isError: isErrorLogs,
  } = useGetContractLogsQuery({
    chainId,
    address: ensResolver ?? '',
    topic0: keccak256(toHex('TextChanged(bytes32,string,string,string)')),
    topic1: namehash(ensName ?? ''),
  })

  const decodedLogs = useMemo(() => {
    return !logs ? {} : decodeEnsRecordLogs(logs, ENS_TXNAMES_RECORD_SUFFIX)
  }, [logs])

  let content: React.ReactNode = null
  if (isLoadingEnsName || isLoadingLogs || isLoadingEnsResolver) {
    content = (
      <div className="flex flex-col gap-2">
        <RecordItemSkeleton />
        <RecordItemSkeleton />
      </div>
    )
  } else if (!ensName) {
    content = (
      <Card className="shadow-none p-16 text-center overflow-hidden rounded-none">
        Connect a wallet with an active ENS name to list your named transactions
      </Card>
    )
  } else if (isErrorLogs) {
    content = (
      <Card className="shadow-none p-16 text-center overflow-hidden rounded-none">
        Invalid contract
      </Card>
    )
  } else if (!decodedLogs || Object.keys(decodedLogs).length === 0) {
    content = (
      <Card className="shadow-none p-16 text-center overflow-hidden rounded-none">No logs</Card>
    )
  } else {
    content = (
      <div className="flex flex-col gap-2">
        {Object.entries(decodedLogs).map(([key, value]) => (
          <RecordItem key={key} ensName={ensName} record={{ key, value }} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 flex-1">
      <Card className="shadow-none p-6 gap-4 overflow-hidden rounded-none">
        <CardHeader className="p-0">
          <CardTitle>Named Transactions</CardTitle>
          <CardDescription>Current named transactions for your primary ENS name.</CardDescription>
        </CardHeader>
        {ensName && (
          <CardContent className="flex flex-col gap-2 p-0 text-sm">
            <div className="flex items-center justify-center border rounded-md px-2 h-[36px] text-sm text-green-500">
              {ensName}
            </div>
          </CardContent>
        )}
      </Card>
      {content}
    </div>
  )
}
