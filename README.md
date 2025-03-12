# Solidity Contract Deployment

This project demonstrates the deployment of a Solidity smart contract using various tools and technologies.

## Stack

- **Solidity**: The programming language used for writing smart contracts.
- **Infura**: A suite of APIs and developer tools that provide easy access to the Ethereum network.
- **JSON**: Used for configuration files and data interchange.
- **MJJS**: A custom or specific library/tool used in this project (please provide more details if available).

## Project Structure

- `contracts/`: Contains the Solidity smart contract files.
- `scripts/`: Deployment scripts for deploying the contracts using Infura.
- `config/`: Configuration files in JSON format.

## Getting Started

### Prerequisites

- Node.js and npm installed.
- Infura account and project ID.
- Ethereum wallet for deploying the contracts.

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Qasim-Rokeeb/FirstContract.git
    cd FirstContract
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

### Configuration

Update the configuration files in the `config/` directory with your Infura project ID and Ethereum wallet details.

### Deployment

1. Compile the Solidity contracts:
    ```sh
    npx hardhat compile
    ```

2. Deploy the contracts:
    ```sh
    npx hardhat run scripts/deploy.js --network rinkeby
    ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Solidity](https://soliditylang.org/)
- [Infura](https://infura.io/)
- [Hardhat](https://hardhat.org/)
