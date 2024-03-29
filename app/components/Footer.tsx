'use client'
import { Flex, Space } from 'antd'
import React from 'react'
import Image from "next/image";
import css from './Footer.module.css'
import { useAccount, useChainId, useWriteContract } from 'wagmi';
import BatchTransferContract from './contract/BatchTransferContract';

export default function Footer() {
  
  const { chain } = useAccount()
  const chainId = useChainId()
  const {writeContract, ...result} = useWriteContract()
  const contract: BatchTransferContract = new BatchTransferContract(chainId, writeContract) 

  function onGithubClick(){
    
  }

  function onScanClick(){
    window.open(chain?.blockExplorers?.default.url + '/address/' + contract.contractAddress)
  }

  return (
    <div className={css.footer}>
      <Flex className={css.flex} vertical={false} justify='end' align="center">
        {/* <div>{chain?.blockExplorers?.default.url}</div> */}
        <a onClick={onScanClick} target='_blank'>
          <Image
            src="/etherscan-logo-circle.svg"
            alt={chain?.blockExplorers?.default.url || ''}
            width={28}
            height={28}
            priority
          />
        </a>
        <a href='https://www.github.com/azleal' target='_blank'>
          <Image
            src="/github-mark.svg"
            alt="Vercel Logo"
            width={28}
            height={28}
            priority
            />
        </a>
      </Flex>
    </div>
  )
}
