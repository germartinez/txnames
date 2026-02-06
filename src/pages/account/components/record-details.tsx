export default function RecordDetails({ value }: { value: string }) {
  return (
    <div className="break-all text-xs text-muted-foreground p-4 pt-2">
      <div className="flex flex-col gap-2">
        <p className="text-sm">{value}</p>
      </div>
    </div>
  )
}
