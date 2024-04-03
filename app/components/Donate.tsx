import { Button,  RadioGroup, useAccordion } from '@nextui-org/react'
import { Flex, InputNumber, Radio, RadioChangeEvent, Space } from 'antd'
import React, { useState } from 'react'
import { useAccount, useChainId, useWriteContract } from 'wagmi'
import BatchTransferContract from './contract/BatchTransferContract'
import { etherUnits } from 'viem'
import { ethers } from 'ethers'

export default function Donate() {

  const customizeDonationOption = "customize"

  const options = [
    {key: "a", value: 1},
    {key: "b", value: 5},
    {key: "c", value: 10},
  ]
  const defaultOption = options[0]
  const [donationChoice, setDonationChoice] = useState(defaultOption.key)
  const [customizeDonation, setCustomizeDonation] = useState(1)
  const [donation, setDonation] = useState(defaultOption.value)

  const account = useAccount()
  const chainId = useChainId()
  const {writeContract, ...result} = useWriteContract()
  const contract: BatchTransferContract = new BatchTransferContract(chainId, writeContract) 
  const symbol = account.chain?.nativeCurrency.symbol

  function donate(){
    console.log(`account: ${JSON.stringify(account)}`)
    const donationInBigInt = ethers.utils.parseEther(donation.toString()).toBigInt()
    if(donationInBigInt <= 0n){
      return 
    }
    contract.donate(donationInBigInt)
  }

  const onChoiceChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    const choice = e.target.value
    setDonationChoice(choice);
    if(customizeDonationOption === choice){
      setDonation(customizeDonation)
      return
    }
    const donation = options.filter(e => e.key === choice)[0].value
    setDonation(donation)
  };

  function onCustomizeDonationChange(value: number | null){
    console.log(`onCustomizeDonationChange: ${value}`)
    if(!value){
      return
    }
    setCustomizeDonation(value)
    setDonation(value)
  }


  return (
    <div>
      <Flex vertical={true} justify="space-around" align="center">
        <div style={{ height: '50vh', padding: '10vh' }}>
          <Radio.Group onChange={onChoiceChange} value={donationChoice}>
            <Space direction="horizontal">
              {options.map(e => (<Radio key={e.key} value={e.key}>{e.value} ${symbol}</Radio>))}
              <Radio value={customizeDonationOption} >
                <InputNumber 
                    addonAfter={"$" + (symbol ? symbol : '')}
                    disabled={donationChoice !== customizeDonationOption}
                    style={{ width: 150, marginLeft: 10 }}
                    defaultValue={customizeDonation}
                    onChange={onCustomizeDonationChange} 
                    min={0.5}
                    step={0.5}
                  />
              </Radio>
            </Space>
          </Radio.Group>
          
        </div>
        <div>
          <Button 
            onClick={donate}
            isLoading={result.isPending}
            radius="full" 
            className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg">
                  Donate
                </Button>
        </div>
      </Flex>
      
    </div>
  )
}
