<img src="./public/icon.png" alt="TXNames Logo" width="100" height="100" />

# TXNames

**TXNames transforms ENS names into human-readable, executable Ethereum transactions.**

This decentralized application allows users to store, explore, and execute smart contract
transactions via ENS text records. Users can assign intuitive names to transactions, making routine
interactions with Ethereum contracts seamless and straightforward, without needing to visit each
dApp.

For example:

- **Developers** can store contract transactions in a testing environment for easy interaction.
- **Companies** can expose contract functionality by naming all their functions on an official ENS
  name, allowing anyone to execute them safely.
- **Protocol users** like those of Uniswap or Aave can create and execute named transactions like
  `swap-1-eth-usdc-uniswap.myensname.eth`, `approve-1k-usdc-aave.myensname.eth`, or
  `supply-1k-usdc-aave.myensname.eth` for quick access.

## How It Works

1. **Connect Your Wallet**: Sign in with your primary ENS name.
2. **Create Named Transactions**: Input a contract address, choose a function, set parameters,
   assign a descriptive name, and save the transaction to your ENS record.
3. **View Your Named Transactions**: Access a clear list of all transactions saved under your ENS
   name for easy management and execution.
4. **Explore & Execute**: Discover named transactions associated with any ENS name, select one, and
   execute it directly from your wallet.

## Getting Started

### Installation

Install the dependencies:

```bash
pnpm install
```

### Configuration

Copy the `.env.example` file to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

Edit the `.env` file:

```env
VITE_ETHERSCAN_API_KEY=your_etherscan_api_key_here
VITE_APPKIT_PROJECT_ID=your_reown_project_id_here
```

| Variable                 | Description                                                                                 | Required |
| ------------------------ | ------------------------------------------------------------------------------------------- | -------- |
| `VITE_ETHERSCAN_API_KEY` | [Etherscan API key](https://etherscan.io/apis) for fetching contract ABIs and contract logs | Yes      |
| `VITE_APPKIT_PROJECT_ID` | [Reown AppKit Project ID](https://cloud.reown.com/) for wallet connections                  | Yes      |

### Development

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`.

### Build

Build the application for production:

```bash
pnpm build
```

## Available Scripts

| Script              | Description                                         |
| ------------------- | --------------------------------------------------- |
| `pnpm dev`          | Start the development server                        |
| `pnpm build`        | Build the application for production                |
| `pnpm preview`      | Preview the production build locally                |
| `pnpm lint`         | Run ESLint to check for code quality issues         |
| `pnpm lint:fix`     | Run ESLint and automatically fix fixable issues     |
| `pnpm format:check` | Check code formatting with Prettier                 |
| `pnpm format:fix`   | Format code with Prettier                           |
| `pnpm typecheck`    | Run TypeScript type checking without emitting files |
| `pnpm clean`        | Remove `dist` and `node_modules` directories        |

## Tech Stack

- **Core**: [React](https://react.dev), [TypeScript](https://www.typescriptlang.org),
  [Vite](https://vitejs.dev).
- **Web3**: [Wagmi](https://wagmi.sh), [Viem](https://viem.sh),
  [Reown AppKit](https://reown.com/appkit).
- **State Management & Data Fetching**: [TanStack Query](https://tanstack.com/query),
  [React Hook Form](https://react-hook-form.com).
- **UI & Styling**: [shadcn/ui](https://ui.shadcn.com), [Tailwind CSS](https://tailwindcss.com),
  [Lucide React](https://lucide.dev).

## Links

- **Live Application**: [https://txnames.germartinez.com](https://txnames.germartinez.com).
- **GitHub Repository**:
  [https://github.com/germartinez/txnames](https://github.com/germartinez/txnames).

## Disclaimer

TXNames is an experimental product provided as-is without warranty. Always review transaction
details before signing. Developers are not responsible for any losses incurred from using this
application.

---

Built with love by [Germán](https://germartinez.com) at
[HackMoney 2026](https://ethglobal.com/events/hackmoney2026).
