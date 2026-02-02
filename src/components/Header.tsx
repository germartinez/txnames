import { truncateAddress } from '@/lib/utils'
import {
  injected,
  useChainId,
  useConnect,
  useConnection,
  useDisconnect,
  useSwitchChain,
} from 'wagmi'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import icon from '/icon.png'

export default function Header() {
  const connect = useConnect()
  const disconnect = useDisconnect()
  const { address } = useConnection()
  const chainId = useChainId()
  const switchChain = useSwitchChain()

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-2 mb-8">
      <div className="flex items-center gap-2">
        <img src={icon} alt="TX_NAMES" className="w-10 h-10 rounded-lg" />
        <h1 className="text-2xl font-bold">TX_NAMES</h1>
      </div>
      <div className="flex items-stretch gap-2">
        {address && (
          <div className="border rounded-md px-3 text-sm flex items-center">
            {truncateAddress(address)}
          </div>
        )}
        <Select
          value={chainId?.toString()}
          onValueChange={(value) => switchChain.mutate({ chainId: Number(value) })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a chain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Ethereum</SelectItem>
            <SelectItem value="11155111">Sepolia</SelectItem>
          </SelectContent>
        </Select>
        {address ? (
          <Button size="icon" onClick={() => disconnect.mutate()} className="text-sm">
            X
          </Button>
        ) : (
          <Button onClick={() => connect.mutate({ connector: injected() })}>Connect Wallet</Button>
        )}
      </div>
    </div>
  )
}
