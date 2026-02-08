import { performRequest } from '@/client/api-client'
import { env } from '@/config/env'

export type AbiItem = {
  type: string
  name: string
  inputs?: Array<{
    name: string
    type: string
    indexed?: boolean
  }>
  outputs?: Array<{
    name: string
    type: string
  }>
  stateMutability?: string
  anonymous?: boolean
}

export type Log = {
  address: string
  data: string
  topics: string[]
  blockNumber: string
  blockHash: string
  timeStamp: string
  gasUsed: string
  gasPrice: string
  logIndex: string
  transactionHash: string
  transactionIndex: string
}

export const contractsRepository = {
  getContractAbi: async (
    chainId: number,
    address: string,
    signal?: AbortSignal,
  ): Promise<AbiItem[]> => {
    const response = await performRequest(
      `https://api.etherscan.io/v2/api?module=contract&action=getabi&address=${address}&chainid=${chainId}&apikey=${env.etherscanApiKey}`,
      { signal },
    )
    if (response.status === '0') {
      throw new Error(response.result)
    }
    const abi = JSON.parse(response.result)
    return abi
  },

  getContractLogs: async (
    chainId: number,
    address: string,
    topic0: string,
    topic1: string,
    signal?: AbortSignal,
  ): Promise<Log[]> => {
    const response = await performRequest(
      `https://api.etherscan.io/v2/api?module=logs&action=getlogs&address=${address}&chainid=${chainId}&topic0=${topic0}&topic1=${topic1}&apikey=${env.etherscanApiKey}`,
      { signal },
    )
    if (response.status === '0') {
      throw new Error(response.result)
    }
    return response.result
  },
}
