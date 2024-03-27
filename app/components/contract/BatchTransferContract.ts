'use client'

import contractInfo from './BatchTransferAbi'
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