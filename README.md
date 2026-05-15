# 🗳️ Decentralized Voting dApp (Web3 Ballot)

A fully responsive, production-ready decentralized application (dApp) that allows users to vote securely on the blockchain. The project features an immutable smart contract deployed on the Ethereum Sepolia Testnet and a modern, high-performance frontend interface.

## 🚀 Live Demo & Links
* **Live dApp (Vercel):** [INSERT_YOUR_VERCEL_LINK_HERE]
* **Verified Smart Contract (Etherscan):** [0x888a9bbd640b1101cc0d92f6b8258a474a307313](https://sepolia.etherscan.io/address/0x888a9bbd640b1101cc0d92f6b8258a474a307313)

---

## 🛠️ Tech Stack & Architecture

### Backend (Smart Contract)
* **Solidity (v0.8.34):** Formulated utilizing secure data structures (`struct`, `mapping`) to map candidates and guarantee unique votes per wallet address.
* **Remix IDE:** Used for iterative compiling, unit behavior validation, and injected-provider deployment.
* **Etherscan Verification:** The contract source code is verified and fully auditable by the public.

### Frontend (Client-side)
* **React & TypeScript:** Built with Vite for rapid environment building and fully typed component modularity.
* **Wagmi & Viem:** Used as the primary hooks engine to efficiently handle blockchain state reading (`useReadContract`) and MetaMask state writing (`useWriteContract`).
* **RainbowKit:** Integrated for an elegant, user-friendly multi-wallet connection interface natively supporting responsive Dark Mode layouts.

---

## 💡 Key Web3 Features Implemented
* **Sybil & Double-Voting Protection:** Leverages Ethereum's unique cryptographic addresses mapped to boolean flags (`hasVoted`), completely preventing a wallet from submitting multiple entries.
* **Gas-Efficient State Reading:** The candidate fetching workflow is strictly designed using `view` functions, allowing the client-side UI to pull blockchain metrics without incurring network Gas costs.
* **Asynchronous Transaction Handling:** Frontend explicitly monitors transaction promises, providing intuitive reactive visual cues when MetaMask triggers cryptographic signing and awaits block consensus.

---

## ⚙️ How to Run Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine and the [MetaMask](https://metamask.io/) extension configured in your browser with Sepolia Testnet funds.

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_GITHUB_USERNAME/web3-voting-dapp.git](https://github.com/YOUR_GITHUB_USERNAME/web3-voting-dapp.git)
   cd web3-voting-dapp
Install dependencies:

Bash
npm install
Start the local development server:

Bash
npm run dev
Open http://localhost:5173 in your browser, click Connect Wallet, switch network to Sepolia, and you are ready to interact!

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
