const batchTransferAbi = [
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "_owner",
              "type": "address"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "owner",
              "type": "address"
          }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "account",
              "type": "address"
          }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "previousOwner",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
          }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
  },
  {
      "stateMutability": "nonpayable",
      "type": "fallback"
  },
  {
      "inputs": [
          {
              "internalType": "address payable[]",
              "name": "recipients",
              "type": "address[]"
          },
          {
              "internalType": "uint256[]",
              "name": "amounts",
              "type": "uint256[]"
          }
      ],
      "name": "batchTransferEther",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address payable[]",
              "name": "recipients",
              "type": "address[]"
          },
          {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          }
      ],
      "name": "batchTransferEtherWithSameAmount",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "contract IERC20",
              "name": "token",
              "type": "address"
          },
          {
              "internalType": "address[]",
              "name": "recipients",
              "type": "address[]"
          },
          {
              "internalType": "uint256[]",
              "name": "amounts",
              "type": "uint256[]"
          }
      ],
      "name": "batchTransferToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "contract IERC20",
              "name": "token",
              "type": "address"
          },
          {
              "internalType": "address[]",
              "name": "recipients",
              "type": "address[]"
          },
          {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          }
      ],
      "name": "batchTransferTokenWithSameAmount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "donate",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "owner",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
          }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  }
]



const batchTransferContracts : { [key: number]: `0x${string}` }= {
  7000 : "0x80B29758F8678642635a6b40c2fE59D36F88F8f5",
  7001 : "0x764129bcdaab991d249339a73be17906a30dae3b",
}

function getContract(chainId: number): `0x${string}`{
  return batchTransferContracts[chainId]
}

const contractInfo = {batchTransferAbi, getContract}

export default contractInfo