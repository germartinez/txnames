import { contractsRepository } from '@/repositories/contracts'
import { useQuery } from '@tanstack/react-query'

export function useGetContractFunctionsQuery(args: { chainId: number; address: string }) {
  return useQuery({
    queryKey: ['contracts', 'abi', args.chainId, args.address],
    queryFn: () => contractsRepository.getContractFunctions(args.chainId, args.address),
    enabled: !!args.chainId && !!args.address,
  })
}

export function useGetContractLogsQuery(args: {
  chainId: number
  address: string
  topic1: string
}) {
  return useQuery({
    queryKey: ['contracts', 'logs', args.chainId, args.address],
    queryFn: () => contractsRepository.getContractLogs(args.chainId, args.address, args.topic1),
    enabled: !!args.chainId && !!args.address,
  })
}
