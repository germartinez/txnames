import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { decodeEnsRecordLogs, ENS_TXNAMES_RECORD_SUFFIX } from '@/lib/ens'
import { useGetContractLogsQuery } from '@/queries/contracts'
import { useMemo } from 'react'
import { keccak256, namehash, toHex } from 'viem'
import {
  useChainId,
  useConnection,
  useEnsAvatar,
  useEnsName,
  useEnsResolver,
  useEnsText,
} from 'wagmi'
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

  const { data: ensUserName, isLoading: isLoadingEnsUserName } = useEnsText({
    name: ensName || undefined,
    key: 'name',
    query: {
      enabled: !!ensName,
    },
  })

  const { data: ensAvatar, isLoading: isLoadingEnsAvatar } = useEnsAvatar({
    name: ensName || undefined,
    query: {
      enabled: !!ensName,
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
      <Card className="shadow-none p-16 text-center overflow-hidden rounded-2xl">
        <p className="text-muted-foreground">
          Connect a wallet with an active ENS name to list your named transactions
        </p>
      </Card>
    )
  } else if (isErrorLogs) {
    content = (
      <Card className="shadow-none p-16 text-center overflow-hidden rounded-2xl">
        <p className="text-muted-foreground">Invalid contract</p>
      </Card>
    )
  } else if (!decodedLogs || Object.keys(decodedLogs).length === 0) {
    content = (
      <Card className="shadow-none p-16 text-center overflow-hidden rounded-2xl">
        <p className="text-muted-foreground">No logs</p>
      </Card>
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
    <div className="flex flex-col gap-2 flex-1">
      <Card className="shadow-none p-6 gap-4 overflow-hidden rounded-2xl">
        <CardHeader className="p-0">
          <CardTitle className="text-2xl">My Named Transactions</CardTitle>
          <CardDescription className="text-md text-muted-foreground">
            List of configured transactions for your primary ENS name.
          </CardDescription>
        </CardHeader>
        {ensName && (
          <CardContent className="flex flex-col gap-2 p-0 text-sm">
            <div className="flex items-center gap-4">
              {ensAvatar && <img src={ensAvatar} alt={ensName} className="size-18 rounded-full" />}
              <div className="flex flex-col gap-1">
                <p className="text-xl font-semibold">{ensName}</p>
                {ensUserName && <p className="text-muted-foreground/80">{ensUserName}</p>}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
      {content}
    </div>
  )
}
