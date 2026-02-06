import { Card } from '@/components/ui/card'
import { parseTxNamesEnsRecordKey, type EnsName } from '@/lib/ens'

export default function MatchingFunctionsList({
  matchingFunctions,
  fullEnsName,
  handleSelectTransactionName,
}: {
  matchingFunctions: { key: string; value: string }[]
  fullEnsName: EnsName
  handleSelectTransactionName: (transactionName: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      {matchingFunctions.map((item) => (
        <Card
          key={item.key}
          className="shadow-none p-4 overflow-hidden rounded-2xl cursor-pointer hover:bg-muted"
          onClick={() =>
            handleSelectTransactionName(parseTxNamesEnsRecordKey(item.key, fullEnsName.ensName))
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
