'use client'

import erc20Abi from './ERC20Abi'
import {  Config, UseReadContractReturnType, useReadContract,  } from 'wagmi'
import { WriteContractMutate } from 'wagmi/query'
import contractInfo from './BatchTransferAbi'
import { readContracts } from 'wagmi/actions'

const abi = erc20Abi
const { getContract} = contractInfo

export default class ERC20Contract{

  writeContract: WriteContractMutate<Config, unknown>;
  address: `0x${string}`;
  chainId: number
  batchTransferContractAddress:`0x${string}`;

  constructor(address: `0x${string}`, 
              chainId: number,
              // readContract: UseReadContractReturnType,
              writeContract: WriteContractMutate<Config, unknown>
              ){
    this.writeContract = writeContract
    this.address = address
    this.chainId = chainId
    this.batchTransferContractAddress = getContract(chainId)    
  }

  // 授权额度
  allowance(owner: `0x${string}` | undefined){
   return {
    abi,
    address: this.address,
    functionName: 'allowance',
    args: [owner, this.batchTransferContractAddress]
   }
  }

  //余额
  balanceOf(owner: `0x${string}` | undefined){
    return {
     abi,
     address: this.address,
     functionName: 'balanceOf',
     args: [owner]
    }
   }


  name(){
    return {
     abi,
     address: this.address,
     functionName: 'name',
    }
   }

   //write method
  approve(amount: bigint){
    this.writeContract({
      abi: erc20Abi,
      address: this.address,
      functionName: 'approve',
      args:[ this.batchTransferContractAddress,  amount],
    })
  }

}