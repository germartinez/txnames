/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ETHERSCAN_API_KEY: string
  readonly VITE_APPKIT_PROJECT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
