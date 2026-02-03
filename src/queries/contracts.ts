import { resolveImplementationOfProxyContract } from '@/lib/web3'
import { contractsRepository, type AbiItem } from '@/repositories/contracts'
import { useQuery } from '@tanstack/react-query'
import type { PublicClient } from 'viem'

export function useGetContractFunctionsQuery(args: {
  chainId: number
  address: string
  publicClient: PublicClient
}) {
  return useQuery({
    queryKey: ['contracts', 'abi', args.chainId, args.address],
    queryFn: async () => {
      let abi = await contractsRepository.getContractAbi(args.chainId, args.address)

      const implementation = await resolveImplementationOfProxyContract(
        args.address,
        args.publicClient,
      )

      if (implementation) {
        abi = await contractsRepository.getContractAbi(args.chainId, implementation)
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
}) {
  return useQuery({
    queryKey: ['contracts', 'logs', args.chainId, args.address],
    queryFn: () =>
      contractsRepository.getContractLogs(args.chainId, args.address, args.topic0, args.topic1),
    enabled: !!args.chainId && !!args.address,
  })
}
