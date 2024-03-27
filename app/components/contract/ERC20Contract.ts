'use client'

import erc20Abi from './ERC20Abi'
import {  Config, UseReadContractReturnType, useReadContract,  } from 'wagmi'
import { WriteContractMutate } from 'wagmi/query'
import contractInfo from './BatchTransferAbi'

const abi = erc20Abi
const { getContract} = contractInfo

export default class ERC20Contract{

  writeContract: WriteContractMutate<Config, unknown>;
  erc20Address: `0x${string}`;
  chainId: number
  batchTransferContractAddress:`0x${string}`;

  constructor(erc20Address: `0x${string}`, 
              chainId: number,
              readContract: UseReadContractReturnType,
              writeContract: WriteContractMutate<Config, unknown>){
    this.writeContract = writeContract
    this.erc20Address = erc20Address
    this.chainId = chainId
    this.batchTransferContractAddress = getContract(chainId)
  }

  // 授权额度
  allowance(owner: string){
   return {
    abi,
    address: this.erc20Address,
    functionName: 'allowance',
    args: [owner, this.batchTransferContractAddress]
   }
  }

  //余额
  balanceOf(owner: string){
    return {
     abi,
     address: this.erc20Address,
     functionName: 'balanceOf',
     args: [owner]
    }
   }


  name(){
    return {
     abi,
     address: this.erc20Address,
     functionName: 'name',
    }
   }

   //write method
  approve(spender: string, amount: bigint){
    this.writeContract({
      abi: erc20Abi,
      address: this.erc20Address,
      functionName: 'approve',
      args:[ spender,  amount],
    })
  }

}