export default function RecordDetails({ record }: { record: { key: string; value: string } }) {
  return (
    <div className="break-all text-xs text-muted-foreground p-2 pt-0 mt-0">
      <div className="flex flex-col gap-2">
        <p className="text-sm">{record.value}</p>
      </div>
    </div>
  )
}
