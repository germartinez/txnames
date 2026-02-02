import { Button } from './ui/button'
import icon from '/icon.png'

export default function Header() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center w-full mb-6 lg:mb-16 gap-4">
      <div className="flex items-center gap-4">
        <img src={icon} alt="TX_NAMES" className="w-10 h-10 rounded-full" />
        <h1 className="text-2xl font-bold">TX_NAMES</h1>
      </div>
      <Button>Connect Wallet</Button>
    </div>
  )
}
