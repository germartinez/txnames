import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { type AppKitNetwork, mainnet, sepolia } from '@reown/appkit/networks'
import { createAppKit } from '@reown/appkit/react'

const projectId = import.meta.env.VITE_APPKIT_PROJECT_ID

const metadata = {
  name: 'TX_NAMES',
  description:
    'Turn ENS names into ready-to-sign transactions by resolving to contract method calldata',
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
