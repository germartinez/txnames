import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { decodeEnsRecordLogs } from '@/lib/web3'
import { useGetContractLogsQuery } from '@/queries/contracts'
import { TrashIcon } from 'lucide-react'
import { useMemo } from 'react'
import { keccak256, namehash, toHex } from 'viem'
import { useChainId, useConnection, useEnsName, useEnsResolver } from 'wagmi'

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
    <Card className="shadow-none rounded-3xl p-2 gap-2 flex-1 border-0">
      <CardHeader className="p-6 border rounded-xl bg-muted">
        <CardTitle>Named Transactions</CardTitle>
        <CardDescription>Current named transactions for your primary ENS name.</CardDescription>
        {isErrorEnsName ? (
          <div className="flex items-center justify-center border rounded-md px-2 h-[36px] text-sm text-red-500 bg-white">
            ERROR
          </div>
        ) : ensName === null ? (
          <div className="flex items-center justify-center border rounded-md px-2 h-[36px] text-sm text-red-500 bg-white">
            No ENS name
          </div>
        ) : ensName ? (
          <div className="flex items-center justify-center border rounded-md px-2 h-[36px] text-sm text-green-500 bg-white">
            {ensName}
          </div>
        ) : (
          <div className="flex items-center justify-center border rounded-md px-2 h-[36px] text-sm text-gray-500"></div>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-0 text-sm">
        {isFetchingLogs || isFetchingEnsResolver ? (
          <div className="text-gray-500 text-center border rounded-xl p-16">Loading...</div>
        ) : isPendingLogs ? (
          <div className="text-gray-500 text-center border rounded-xl p-16">
            <p>List of named transactions</p>
          </div>
        ) : isErrorLogs ? (
          <div className="text-red-500 text-center border rounded-xl py-16">Invalid contract</div>
        ) : !decodedLogs || decodedLogs.length === 0 ? (
          <div className="text-red-500 text-center border rounded-xl py-16">No logs</div>
        ) : (
          decodedLogs.map(([key, value]) => (
            <div key={key} className="flex justify-between items-center border rounded-xl p-2">
              <div className="flex flex-col">
                <div className="break-all">{key}</div>
                <div className="break-all text-xs text-muted-foreground">{value}</div>
              </div>
              <Button variant="ghost" className="cursor-pointer">
                <TrashIcon className="size-4 text-muted-foreground" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
