export default function RecordDetails({ key, value }: { key: string; value: string }) {
  return (
    <div className="m-2 mt-2 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-sm">{key}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  )
}
