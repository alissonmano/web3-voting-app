import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useReadContract, useWriteContract, useAccount } from 'wagmi'
import { CONTRACT_ADDRESS, VOTING_ABI } from './contractInfo'

// Tipo para mapear o retorno da struct Candidate do Solidity
interface Candidate {
  id: bigint
  name: string
  voteCount: bigint
}

export default function App() {
  const { isConnected, address } = useAccount()
  const { writeContract, isPending } = useWriteContract()

  // 1. Busca automática dos candidatos da rede Sepolia (Atualiza sem gastar Gas)
  const { data: candidates, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: VOTING_ABI,
    functionName: 'getCandidates',
  })

  // 2. Dispara a transação de escrita (Abre o pop-up da MetaMask para pagar Gas de teste)
  const handleVote = (candidateId: number) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: VOTING_ABI,
      functionName: 'vote',
      args: [BigInt(candidateId)],
    }, {
      onSuccess: () => {
        alert("Transação enviada! Aguarde alguns segundos para a rede processar.")
        setTimeout(() => refetch(), 5000) // Atualiza o placar na tela
      },
      onError: (err) => {
        alert(`Erro na transação: ${err.message}`)
      }
    })
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Web3 Ballot 🗳️</h2>
        <ConnectButton />
      </header>

      {!isConnected ? (
        <div style={{ textAlign: 'center', marginTop: '3rem', color: '#666' }}>
          <p>Conecte sua carteira para ver as opções e votar.</p>
        </div>
      ) : (
        <div>
          <p>Logado como: <code style={{ background: '#eee', padding: '0.2rem 0.4rem' }}>{address}</code></p>
          
          <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
            {candidates?.map((candidate: Candidate) => (
              <div key={candidate.id.toString()} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0 }}>{candidate.name}</h3>
                  <small style={{ color: '#555' }}>Votos: {candidate.voteCount.toString()}</small>
                </div>
                <button 
                  onClick={() => handleVote(Number(candidate.id))}
                  disabled={isPending}
                  style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  {isPending ? 'Enviando...' : 'Votar'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}