# Solana Starter

## Description
This Solana Starter is leveraging Next.js for server-side rendering, TypeScript for Tailwind CSS, and shadcn/ui components for the UI, & integrates `solana/wallet-adapter-react` and `solana/web3.js` for seamless blockchain transactions and data fetching, focusing primarily on fetching holder information from a given creator address.

## Features
- **Simple Snapshot Tool:** Fetch holders from a creator address on the Solana blockchain.
- **Responsive UI:** Utilizes Tailwind CSS and shadcn/ui components for a modern, responsive design.
- **Solana Blockchain Integration:** Uses `solana/wallet-adapter-react` and `solana/web3.js` for interacting with the Solana blockchain.

## Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/BankkRoll/solana-starter.git
   cd solana-starter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up `.env` file:**
   - Rename `.env.example` to `.env`.
   - Obtain an API key from [Helious Dashboard](https://dev.helius.xyz/dashboard/app).
   - Replace `<your_api_key_here>` with your Helious API key.

## Usage
1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the app:**
   - Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

3. **Interacting with the Solana Blockchain:**
   - Use the UI to connect to a Solana wallet.
   - Perform transactions or query blockchain data as per the application's capabilities, especially for fetching holder information from a creator address.
