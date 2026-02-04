import { truncateAddress } from '@/lib/web3'
import { useAppKit } from '@reown/appkit/react'
import { MoonIcon, SunIcon, XIcon } from 'lucide-react'
import { useChainId, useConnection, useDisconnect, useSwitchChain } from 'wagmi'
import { useTheme } from './theme-provider'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import icon from '/icon.png'

export default function Header() {
  const { open } = useAppKit()
  const disconnect = useDisconnect()
  const { address } = useConnection()
  const chainId = useChainId()
  const switchChain = useSwitchChain()
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-2 mb-8">
      <div className="flex items-center gap-2">
        <img src={icon} alt="TX_NAMES" className="w-10 h-10 rounded-lg" />
        <h1 className="text-2xl font-bold">TX_NAMES</h1>
      </div>
      <div className="flex items-stretch gap-2">
        <Button
          variant="outline"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="cursor-pointer"
        >
          {theme === 'dark' ? <MoonIcon className="size-4" /> : <SunIcon className="size-4" />}
        </Button>
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
          <Button
            size="icon"
            variant="outline"
            onClick={() => disconnect.mutate()}
            className="text-sm cursor-pointer"
          >
            <XIcon className="size-4" />
          </Button>
        ) : (
          <Button variant="outline" onClick={() => open()} className="cursor-pointer">
            Connect Wallet
          </Button>
        )}
      </div>
    </div>
  )
}
