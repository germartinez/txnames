import type { Log } from '@/repositories/contracts'
import { decodeEventLog } from 'viem'

export function truncateAddress(address: string, length: number = 6) {
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`
}

export function decodeEnsRecordLogs(logs: Log[]): [string, string][] {
  if (!logs) return []

  const decodedLogs = logs.map((log) =>
    decodeEventLog({
      data: log.data as `0x${string}`,
      topics: log.topics as [`0x${string}`, ...`0x${string}`[]],
      abi: [
        {
          type: 'event',
          name: 'TextChanged',
          inputs: [
            { indexed: true, name: 'node', type: 'bytes32' },
            { indexed: true, name: 'indexedKey', type: 'string' },
            { indexed: false, name: 'key', type: 'string' },
            { indexed: false, name: 'value', type: 'string' },
          ],
        },
      ],
    }),
  )

  const logsRecords: Record<string, string> = {}
  if (decodedLogs) {
    for (const log of decodedLogs) {
      const { key, value } = log.args
      logsRecords[key] = value
    }
  }

  return Object.entries(logsRecords).sort(([a], [b]) => a.localeCompare(b))
}
