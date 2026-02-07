/* eslint-disable react/no-unescaped-entities */
import { Disclaimer } from '@/components/disclaimer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function InstructionsPage() {
  return (
    <Card className="shadow-none p-6 gap-4 overflow-hidden rounded-2xl">
      <CardHeader className="p-0">
        <CardTitle className="text-2xl">Instructions</CardTitle>
        <CardDescription className="text-md text-muted-foreground">
          TXNames transforms ENS names into human-readable, executable Ethereum transactions.
        </CardDescription>
        <Disclaimer className="rounded-lg" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-0">
        <div className="border p-4 rounded-lg flex flex-col gap-2">
          <p className="text-lg font-medium">Execute a named transaction</p>
          <ol className="list-decimal flex flex-col gap-1 pl-5 text-muted-foreground">
            <li>Connect your wallet.</li>
            <li>Open the "Execution" page.</li>
            <li>
              Enter the name of the transaction you want to execute. It can belong to your ENS name
              or to any other ENS name.
            </li>
            <li>Execute the transaction.</li>
          </ol>
        </div>
        <div className="border p-4 rounded-lg flex flex-col gap-2">
          <p className="text-lg font-medium">Add a new named transaction to your ENS name</p>
          <ol className="list-decimal flex flex-col gap-1 pl-5 text-muted-foreground">
            <li>Connect your wallet with your primary ENS name.</li>
            <li>Open the "Configuration" page.</li>
            <li>Search for a contract address and select one of its functions.</li>
            <li>Configure the function with your preferred parameters and give it a name.</li>
            <li>
              Execute the transaction to save it. It will be available for execution afterwards.
            </li>
          </ol>
        </div>
        <div className="border p-4 rounded-lg flex flex-col gap-2">
          <p className="text-lg font-medium">Check your named transactions</p>
          <ol className="list-decimal flex flex-col gap-1 pl-5 text-muted-foreground">
            <li>Connect your wallet with your primary ENS name.</li>
            <li>Open the "My transactions" page.</li>
            <li>Your named transactions will be listed there.</li>
          </ol>
        </div>

        <p className="text-xs pt-6 text-muted-foreground text-center">
          Built with love by{' '}
          <a
            href="https://germartinez.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:text-primary/60"
          >
            Germán
          </a>{' '}
          at{' '}
          <a
            href="https://ethglobal.com/events/hackmoney2026"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:text-primary/60"
          >
            HackMoney 2026
          </a>
          . Code available on{' '}
          <a
            href="https://github.com/germartinez/txnames"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:text-primary/60"
          >
            GitHub
          </a>
          .
        </p>
      </CardContent>
    </Card>
  )
}
