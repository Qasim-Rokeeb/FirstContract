import { ethers } from 'ethers';
import readline from 'readline';

// Infura configuration
const INFURA_PROJECT_ID = "5051774beaa4427ca645e3dfd5317989"; // API Key
const network = "sepolia"; // or mainnet, goerli, etc.
const provider = new ethers.JsonRpcProvider(`https://${network}.infura.io/v3/${INFURA_PROJECT_ID}`);

// Store wallets in memory (Note: In production, use secure storage)
const wallets = [];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function createWallet() {
    const wallet = ethers.Wallet.createRandom();
    wallets.push(wallet);
    
    console.log('\n=== New Wallet Created ===');
    console.log('Wallet Index:', wallets.length - 1);
    console.log('Address:', wallet.address);
    console.log('Private Key:', wallet.privateKey);
    console.log('Seed Phrase:', wallet.mnemonic ? wallet.mnemonic.phrase : "N/A");
    console.log('========================\n');
    
    return wallet;
}

async function checkBalance(address) {
    console.log('Fetching balance...');
    
    try {
        const balance = await provider.getBalance(address);
        const balanceInEth = ethers.formatEther(balance);
        console.log(`Balance: ${balanceInEth} ETH\n`);
        return balance;
    } catch (error) {
        console.error('Failed to fetch balance:', error.message);
    }
}

async function transferEth(fromWallet, toAddress, amount) {
    console.log('Preparing transaction...');

    try {
        const wallet = fromWallet.connect(provider);
        const tx = {
            to: toAddress,
            value: ethers.parseEther(amount.toString())
        };

        console.log('Sending transaction...');
        const transaction = await wallet.sendTransaction(tx);
        
        console.log('Waiting for confirmation...');
        const receipt = await transaction.wait();
        
        console.log('\n=== Transaction Confirmed ===');
        console.log('Transaction Hash:', receipt.transactionHash);
        console.log('From:', transaction.from);
        console.log('To:', transaction.to);
        console.log('Amount:', amount, 'ETH');
        console.log('Block Number:', receipt.blockNumber);
        console.log('Gas Used:', receipt.gasUsed.toString());
        console.log('==========================\n');
        
        return receipt;
    } catch (error) {
        console.error('Transaction failed:', error.message);
    }
}

async function displayWalletDetails(walletIndex) {
    if (walletIndex >= 0 && walletIndex < wallets.length) {
        const wallet = wallets[walletIndex];
        console.log('\n=== Wallet Details ===');
        console.log('Wallet Index:', walletIndex);
        console.log('Address:', wallet.address);
        console.log('Private Key:', wallet.privateKey);
        console.log('Seed Phrase:', wallet.mnemonic ? wallet.mnemonic.phrase : "N/A");
        await checkBalance(wallet.address);
        console.log('===================\n');
    } else {
        console.log('Invalid wallet index');
    }
}

async function showMenu() {
    while (true) {
        console.log('\n=== Ethereum Wallet Operations ===');
        console.log('1. Create New Wallet');
        console.log('2. View Wallet Details');
        console.log('3. Transfer ETH');
        console.log('4. List All Wallets');
        console.log('5. Exit');
        console.log('==============================\n');

        const choice = await question('Select an option (1-5): ');

        switch (choice) {
            case '1':
                await createWallet();
                break;

            case '2':
                if (wallets.length === 0) {
                    console.log('No wallets created yet!');
                    break;
                }
                const viewIndex = parseInt(await question('Enter wallet index to view: '));
                if (!isNaN(viewIndex)) {
                    await displayWalletDetails(viewIndex);
                } else {
                    console.log('Invalid input!');
                }
                break;

            case '3':
                if (wallets.length < 2) {
                    console.log('Create at least two wallets to transfer ETH!');
                    break;
                }
                const fromIndex = parseInt(await question('Enter sender wallet index: '));
                const toIndex = parseInt(await question('Enter receiver wallet index: '));
                const amount = parseFloat(await question('Enter amount in ETH: '));

                if (!isNaN(fromIndex) && !isNaN(toIndex) && !isNaN(amount) &&
                    fromIndex >= 0 && fromIndex < wallets.length &&
                    toIndex >= 0 && toIndex < wallets.length) {
                    await transferEth(wallets[fromIndex], wallets[toIndex].address, amount);
                } else {
                    console.log('Invalid wallet indices or amount!');
                }
                break;

            case '4':
                console.log('\n=== All Wallets ===');
                for (let i = 0; i < wallets.length; i++) {
                    console.log(`\nWallet ${i}:`);
                    console.log('Address:', wallets[i].address);
                    await checkBalance(wallets[i].address);
                }
                console.log('=================\n');
                break;

            case '5':
                console.log('Goodbye!');
                rl.close();
                return;

            default:
                console.log('Invalid option. Please try again.');
        }
    }
}

// Start the application
showMenu();