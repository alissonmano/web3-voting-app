import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useReadContract, useWriteContract, useAccount } from 'wagmi'
import { CONTRACT_ADDRESS, VOTING_ABI } from './contractInfo'

interface Candidate {
  id: bigint
  name: string
  voteCount: bigint
}

export default function App() {
  const { isConnected, address } = useAccount()
  const { writeContract, isPending } = useWriteContract()

  // 1. Automatically fetch the candidates list from Sepolia Testnet
  const { data: candidates, refetch: refetchCandidates } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: VOTING_ABI,
    functionName: 'getCandidates',
  })

  // 2. Read the smart contract state to check if the current connected wallet has already voted
  const { data: hasUserVoted, refetch: refetchVoteStatus } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: VOTING_ABI,
    functionName: 'hasVoted',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address, // Only runs the query if a wallet address is active
    }
  })

  // 3. Handles the voting transaction workflow and triggers MetaMask signing
  const handleVote = (candidateId: number) => {
    if (hasUserVoted) {
      alert("Security Enforcement: Your wallet address has already registered a vote.")
      return
    }

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: VOTING_ABI,
      functionName: 'vote',
      args: [BigInt(candidateId)],
    }, {
      onSuccess: () => {
        alert("Transaction broadcasted successfully! Awaiting block confirmation...")
        // Triggers a reactive synchronization delay to let the blockchain mine the block
        setTimeout(() => {
          refetchCandidates()
          refetchVoteStatus()
        }, 6000)
      },
      onError: (err) => {
        alert(`Transaction Rejected: ${err.message}`)
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
          <p>Please authenticate your Web3 wallet to review ballot candidates and cast your vote.</p>
        </div>
      ) : (
        <div>
          <p style={{ marginBottom: '1.5rem' }}>
            Connected Account: <code style={{ background: '#eee', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>{address}</code>
          </p>

          {hasUserVoted && (
            <div style={{ background: '#fff3cd', color: '#856404', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #ffeeba' }}>
              <strong>Notice:</strong> Your cryptographic signature has already been registered on-chain for this poll. Double-voting is strictly protected.
            </div>
          )}
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {candidates?.map((candidate: Candidate) => (
              <div key={candidate.id.toString()} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0 }}>{candidate.name}</h3>
                  <small style={{ color: '#555' }}>Total Votes: {candidate.voteCount.toString()}</small>
                </div>
                <button 
                  onClick={() => handleVote(Number(candidate.id))}
                  disabled={isPending || hasUserVoted}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    cursor: isPending || hasUserVoted ? 'not-allowed' : 'pointer', 
                    background: hasUserVoted ? '#6c757d' : '#0070f3', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    transition: 'background 0.2s ease'
                  }}
                >
                  {hasUserVoted ? 'Already Voted' : isPending ? 'Processing...' : 'Cast Vote'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}