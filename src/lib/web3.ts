import type { Log } from '@/repositories/contracts'
import {
  decodeEventLog,
  encodeFunctionData,
  namehash,
  zeroAddress,
  zeroHash,
  type Address,
  type PublicClient,
} from 'viem'

export function truncateAddress(address: string, length: number = 6) {
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`
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

export function decodeEnsRecordLogs(logs: Log[]): Record<string, string> {
  if (!logs) return {}

  const logsRecords: Record<string, string> = {}
  for (const log of logs) {
    try {
      const decoded = decodeEventLog({
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
      })
      const { key, value } = decoded.args
      if (key.endsWith('.tx-names')) {
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
    args: [node, option.key + '.tx-names', option.value],
  })
  return data
}

export function extractEnsName(input: string): { method?: string; ensName: string } | undefined {
  const parts = input.trim().toLowerCase().split('.')
  if (parts.length < 2) return
  return {
    method: parts.length > 2 ? parts.slice(0, 1)[0] : undefined,
    ensName: parts.slice(-2).join('.'),
  }
}
