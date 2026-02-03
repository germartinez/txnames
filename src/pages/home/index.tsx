import ContractCard from './components/ContractCard'
import EnsCard from './components/EnsCard'

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
      <ContractCard />
      <EnsCard />
    </div>
  )
}
