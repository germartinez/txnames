import { resolveImplementationOfProxyContract } from '@/lib/web3'
import { contractsRepository, type AbiItem, type Log } from '@/repositories/contracts'
import type { UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { zeroAddress, type PublicClient } from 'viem'

export function useGetContractFunctionsQuery(args: {
  chainId: number
  address: string
  publicClient: PublicClient
}): UseQueryResult<AbiItem[]> {
  return useQuery({
    queryKey: ['contracts', 'abi', args.chainId, args.address],
    queryFn: async ({ signal }) => {
      let abi = await contractsRepository.getContractAbi(args.chainId, args.address, signal)

      const implementation = await resolveImplementationOfProxyContract(
        args.address,
        args.publicClient,
      )

      if (implementation) {
        abi = await contractsRepository.getContractAbi(args.chainId, implementation, signal)
      }

      return (
        abi.filter(
          (item: AbiItem) =>
            item.type === 'function' &&
            (item.stateMutability === 'payable' || item.stateMutability === 'nonpayable'),
        ) ?? []
      )
    },
    enabled: !!args.chainId && !!args.address,
  })
}

export function useGetContractLogsQuery(args: {
  chainId: number
  address: string
  topic0: string
  topic1: string
}): UseQueryResult<Log[]> {
  const isValidAddress = !!args.address && args.address !== zeroAddress
  return useQuery({
    queryKey: ['contracts', 'logs', args.chainId, args.address, args.topic0, args.topic1],
    queryFn: ({ signal }) =>
      contractsRepository.getContractLogs(
        args.chainId,
        args.address,
        args.topic0,
        args.topic1,
        signal,
      ),
    enabled: !!args.chainId && isValidAddress,
  })
}
