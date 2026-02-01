import { contractsRepository } from '@/repositories/contracts'
import { useQuery } from '@tanstack/react-query'

export function useGetContractFunctionsQuery(args: { chainId: number; address: string }) {
  return useQuery({
    queryKey: ['contracts', args.chainId, args.address],
    queryFn: () => contractsRepository.getContractFunctions(args.chainId, args.address),
    enabled: !!args.chainId && !!args.address,
  })
}
