'use client'

import contractInfo from '../../transfer/BatchTransferAbi'
import {  Config,  } from 'wagmi'
import { WriteContractMutate } from 'wagmi/query'

const {batchTransferAbi, getContract} = contractInfo

export default class BatchTransferContract{

  chainId: number;
  writeContract: WriteContractMutate<Config, unknown>;
  contractAddress: `0x${string}`;

  constructor(chainId: number, 
              writeContract: WriteContractMutate<Config, unknown>){
    this.chainId = chainId
    this.writeContract = writeContract
    this.contractAddress = getContract(chainId)
  }

  async donate(_donation : bigint){
    this.writeContract({
      abi: batchTransferAbi,
      address: this.contractAddress,
      functionName: 'donate',
      value: _donation,
    })
  }


  async batchTransferEther(recipients: string[], amounts: bigint[]){
    console.log(`batchTransferEther`, recipients, amounts)
    if(recipients.length ===0){
      throw new Error("列表不能为空")
    }
    if(recipients.length ===0 || recipients.length !== amounts.length){
        throw new Error("地址列表长度与金额列表长度必须相同")
    }

    let totalAmount: bigint = 0n
    for(let i = 0; i< recipients.length; i++){
      const amount = amounts[i]
      totalAmount += amount
    }
    this.writeContract({
      abi: batchTransferAbi,
      address: this.contractAddress,
      functionName: 'batchTransferEther',
      args:[ recipients,  amounts],
      value: totalAmount,
    })
  }

  async  batchTransferEtherWithSameAmount(recipients: string[], amount: bigint){
    // console.log(`batchTransferEtherWithSameAmount0`, recipients, amount)
    if(recipients.length ===0){
      throw new Error("列表不能为空")
    }

    let totalAmount: bigint = amount * BigInt(recipients.length)

    this.writeContract({
      abi: batchTransferAbi,
      address: this.contractAddress,
      functionName: 'batchTransferEtherWithSameAmount',
      args:[ recipients,  amount],
      value: totalAmount,
    })
  }


  async batchTransferToken(erc20: `0x${string}`, recipients: string[], amounts: bigint[]){
    console.log(`batchTransferEther`, recipients, amounts)
    if(recipients.length ===0){
      throw new Error("列表不能为空")
    }
    if(recipients.length ===0 || recipients.length !== amounts.length){
        throw new Error("地址列表长度与金额列表长度必须相同")
    }

    let totalAmount: bigint = 0n
    for(let i = 0; i< recipients.length; i++){
      const amount = amounts[i]
      totalAmount += amount
    }
    this.writeContract({
      abi: batchTransferAbi,
      address: this.contractAddress,
      functionName: 'batchTransferToken',
      args:[ erc20, recipients,  amounts],
      value: totalAmount,
    })
  }

  async batchTransferTokenWithSameAmount(erc20: `0x${string}`, recipients: string[], amount: bigint){
    if(recipients.length ===0){
      throw new Error("列表不能为空")
    }
    let totalAmount: bigint = amount * BigInt(recipients.length)
    this.writeContract({
      abi: batchTransferAbi,
      address: this.contractAddress,
      functionName: 'batchTransferTokenWithSameAmount',
      args:[ erc20, recipients,  totalAmount],
      value: totalAmount,
    })
  }
}



// function BatchTransferContract1() {

//   // const [donation, setDonation] = useState("5");

//   const account = useAccount()

//   const chainId = useChainId()
//   const contractAddress = getContract(chainId)

//   // const balance = useBalance({
//   //   address: account.address
//   // })


//   const {writeContract,...result} = useWriteContract()

//   async function donate(_donation : bigint){
//     writeContract({
//       abi: batchTransferAbi,
//       address: contractAddress,
//       functionName: 'donate',
//       value: _donation,
//     })
//   }

//   async function batchTransferEther(recipients: string[], amounts: string[] | bigint[]){
//     console.log(`batchTransferEther`, recipients, amounts)
//     if(recipients.length ===0){
//       throw new Error("列表不能为空")
//     }
//     if(recipients.length ===0 || recipients.length !== amounts.length){
//         throw new Error("地址列表长度与金额列表长度必须相同")
//     }

//     let _amounts : bigint[] = []
//     if (typeof amounts[0] === 'string') {
//       _amounts = amounts.map(e => ethers.utils.parseEther(e as string).toBigInt()) as bigint[];
//     } else{
//       _amounts = amounts as bigint[]
//     }

//     let totalAmount: bigint = 0n
//     for(let i = 0; i< recipients.length; i++){
//       const amount = _amounts[i]
//       totalAmount += amount
//     }
//     writeContract({
//       abi: batchTransferAbi,
//       address: contractAddress,
//       functionName: 'batchTransferEther',
//       args:[ recipients,  _amounts],
//       value: totalAmount,
//     })
//   }

//   async function batchTransferEtherWithSameAmount(recipients: string[], amount: bigint){
//     console.log(`batchTransferEtherWithSameAmount0`, recipients, amount)
//     if(recipients.length ===0){
//       throw new Error("列表不能为空")
//     }

//     let totalAmount: bigint = amount * BigInt(recipients.length)
//     writeContract({
//       abi: batchTransferAbi,
//       address: contractAddress,
//       functionName: 'batchTransferEtherWithSameAmount',
//       args:[ recipients,  totalAmount],
//       value: totalAmount,
//     })
//   }

//   async function test() {
//     const receive: string [] = ["0x8e779db3B2D3a7b3D9030e665BfBB27F703565E0"]
//     const amount: string [] = ["0.01","0.02","0.03","0.04","0.05"]
//     const amountBigint: bigint [] = [1n,2n,3n,4n,5n]
//     const amount1 = ethers.utils.parseEther("0.001").toBigInt()
//     batchTransferEther(receive, [amount1])
//     // batchTransferEtherWithSameAmount(receive, amount1)
//   }



//   return (
//     <div>BatchTransferContract : {contractAddress}
//     <InputNumber 
//       style={{ width: 200 }}
//       defaultValue={donation}
//       min="0.0001"
//       step="0.01"
//       onChange={onDonationChange}
//       stringMode  
//     ></InputNumber>
//       <div> {result.isError ? (result.error as BaseError).shortMessage as string : "" } </div>
//       <Button onClick={() => {donate(donation)}} isLoading={result.isPending}>donate</Button>

//       <Alert
//         message="Error Text"
//         description="Error Description Error Description Error Description Error Description Error Description Error Description"
//         type="error"
//         closable
//       />
//       <div>
//         <Button onClick={() => {donate(donation)}} isLoading={result.isPending}>批量转账</Button>
//       </div>
//       <div>
//         <Button onClick={test} isLoading={result.isPending}>测试</Button>
//       </div>
//     </div>
//   )
// }
