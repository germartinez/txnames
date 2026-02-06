import type { Log } from '@/repositories/contracts'
import { decodeEventLog, encodeFunctionData, namehash, type Address } from 'viem'

export const ENS_TXNAMES_RECORD_SUFFIX = '.tx-names'

export function formatTxNamesEnsRecordKey(transactionName: string): string {
  return `${transactionName.trim().toLowerCase()}${ENS_TXNAMES_RECORD_SUFFIX}`
}

export function parseTxNamesEnsRecordKey(key: string, ensName: string): string {
  return key.replace(ENS_TXNAMES_RECORD_SUFFIX, ensName)
}

export function decodeEnsRecordLogs(logs: Log[], domainFilter: string): Record<string, string> {
  if (!logs) return {}

  const logsRecords: Record<string, string> = {}
  for (const log of logs) {
    try {
      const decoded = decodeEventLog({
        data: log.data as `0x${string}`,
        topics: log.topics as [`0x${string}`, ...`0x${string}`[]],
        abi: [
          {
            inputs: [
              { indexed: true, name: 'node', type: 'bytes32' },
              { indexed: true, name: 'indexedKey', type: 'string' },
              { indexed: false, name: 'key', type: 'string' },
              { indexed: false, name: 'value', type: 'string' },
            ],
            name: 'TextChanged',
            type: 'event',
          },
        ],
      })
      const { key, value } = decoded.args
      if (key.endsWith(domainFilter)) {
        logsRecords[key] = value
      }
    } catch (error) {
      continue
    }
  }

  for (const key in logsRecords) {
    if (logsRecords[key] === '') {
      delete logsRecords[key]
    }
  }

  return logsRecords
}

export function encodeSetEnsRecordData(
  ensName: string,
  option: { key: string; value: string },
): Address {
  const node = namehash(ensName)
  const data = encodeFunctionData({
    abi: [
      {
        inputs: [
          { name: 'node', type: 'bytes32' },
          { name: 'key', type: 'string' },
          { name: 'value', type: 'string' },
        ],
        name: 'setText',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'setText',
    args: [node, option.key + ENS_TXNAMES_RECORD_SUFFIX, option.value],
  })
  return data
}

export type EnsName = {
  method?: string
  ensName: string
}

export function extractEnsName(input: string): EnsName | undefined {
  const parts = input.trim().toLowerCase().split('.')
  if (parts.length < 2) return
  return {
    method: parts.length > 2 ? parts.slice(0, 1)[0] : undefined,
    ensName: parts.slice(-2).join('.'),
  }
}
