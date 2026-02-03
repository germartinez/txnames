import type { Log } from '@/repositories/contracts'
import { decodeEventLog, zeroAddress, zeroHash, type PublicClient } from 'viem'

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

export async function resolveImplementationOfProxyContract(
  address: string,
  publicClient: PublicClient,
): Promise<string | undefined> {
  // EIP-1967 proxy contracts
  const EIP1967_SLOT = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'
  const implFromSlot = await publicClient.getStorageAt({
    address: address as `0x${string}`,
    slot: EIP1967_SLOT,
  })
  if (implFromSlot && implFromSlot !== zeroHash) {
    return `0x${implFromSlot.slice(-40)}`
  }

  // Transparent/UUPS proxy contracts
  try {
    const impl = await publicClient.readContract({
      address: address as `0x${string}`,
      abi: [
        {
          inputs: [],
          name: 'implementation',
          outputs: [{ type: 'address' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      functionName: 'implementation',
    })
    if (impl && impl !== zeroAddress) {
      return impl
    }
  } catch {} // eslint-disable-line no-empty

  // Safe proxy contracts
  try {
    const impl = await publicClient.readContract({
      address: address as `0x${string}`,
      abi: [
        {
          inputs: [],
          name: 'masterCopy',
          outputs: [{ type: 'address' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      functionName: 'masterCopy',
    })
    if (impl && impl !== zeroAddress) {
      return impl
    }
  } catch {} // eslint-disable-line no-empty
}
