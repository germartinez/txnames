import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { type AppKitNetwork, mainnet, sepolia } from '@reown/appkit/networks'
import { createAppKit } from '@reown/appkit/react'
import { env } from './env'

const projectId = env.appkitProjectId

const metadata = {
  name: 'TXNames',
  description: 'Turn ENS names into ready-to-sign transactions',
  url: 'https://txnames.germartinez.com',
  icons: ['https://raw.githubusercontent.com/germartinez/txnames/refs/heads/main/public/icon.png'],
}

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet, sepolia]

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
})

export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  metadata,
  projectId,
  features: {
    analytics: true,
  },
})
