import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { decodeEnsRecordLogs } from '@/lib/web3'
import { useGetContractLogsQuery } from '@/queries/contracts'
import { useMemo } from 'react'
import { keccak256, namehash, toHex } from 'viem'
import { useChainId, useConnection, useEnsName, useEnsResolver } from 'wagmi'
import { RecordItem } from './RecordItem'

export default function EnsCard() {
  const chainId = useChainId()
  const { address: connectedAddress } = useConnection()

  const { data: ensName, isError: isErrorEnsName } = useEnsName({
    address: connectedAddress || undefined,
    chainId: Number(chainId),
    query: {
      enabled: !!connectedAddress,
    },
  })

  const { data: ensResolver, isFetching: isFetchingEnsResolver } = useEnsResolver({
    name: ensName || undefined,
    chainId,
    query: {
      enabled: !!ensName,
    },
  })

  const {
    data: logs,
    isFetching: isFetchingLogs,
    isError: isErrorLogs,
    isPending: isPendingLogs,
  } = useGetContractLogsQuery({
    chainId,
    address: ensResolver ?? '',
    topic0: keccak256(toHex('TextChanged(bytes32,string,string,string)')),
    topic1: namehash(ensName ?? ''),
  })

  const decodedLogs: [string, string][] = useMemo(() => {
    if (!logs) return []
    return decodeEnsRecordLogs(logs)
  }, [logs])

  return (
    <div className="flex flex-col gap-8 flex-1">
      <Card className="shadow-none p-6 gap-4 overflow-hidden rounded-none">
        <CardHeader className="p-0">
          <CardTitle>Named Transactions</CardTitle>
          <CardDescription>Current named transactions for your primary ENS name.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 p-0 text-sm">
          {isErrorEnsName ? (
            <div className="flex items-center justify-center border rounded-md px-2 h-[36px] text-sm text-red-500">
              ERROR
            </div>
          ) : ensName === null ? (
            <div className="flex items-center justify-center border rounded-md px-2 h-[36px] text-sm text-red-500">
              No ENS name
            </div>
          ) : ensName ? (
            <div className="flex items-center justify-center border rounded-md px-2 h-[36px] text-sm text-green-500">
              {ensName}
            </div>
          ) : (
            <div className="flex items-center justify-center border rounded-md px-2 h-[36px]"></div>
          )}
        </CardContent>
      </Card>
      {isFetchingLogs || isFetchingEnsResolver ? (
        <Card className="shadow-none p-16 text-center overflow-hidden rounded-none">
          Loading...
        </Card>
      ) : isPendingLogs ? (
        <Card className="shadow-none p-16 text-center overflow-hidden rounded-none">
          <p>List of named transactions</p>
        </Card>
      ) : isErrorLogs ? (
        <Card className="shadow-none p-16 text-center overflow-hidden rounded-none">
          Invalid contract
        </Card>
      ) : !decodedLogs || decodedLogs.length === 0 ? (
        <Card className="shadow-none p-16 text-center overflow-hidden rounded-none">No logs</Card>
      ) : (
        <div className="flex flex-col gap-2">
          {decodedLogs.map(([key, value]) => (
            <RecordItem key={key} record={{ key, value }} />
          ))}
        </div>
      )}
    </div>
  )
}
