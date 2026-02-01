import { performRequest } from '@/client/apiClient'

export type AbiItem = {
  type: string
  name?: string
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

export const contractsRepository = {
  getContractFunctions: async (chainId: number, address: string): Promise<AbiItem[]> => {
    const response = await performRequest(
      `https://api.etherscan.io/v2/api?module=contract&action=getabi&address=${address}&chainid=${chainId}&apikey=${import.meta.env.VITE_ETHERSCAN_API_KEY}`,
    )
    if (response.status === '0') {
      throw new Error(response.result)
    }
    const abi = JSON.parse(response.result)
    return abi.filter((item: AbiItem) => item.type === 'function')
  },
}
