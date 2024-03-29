'use client'
import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Tabs, Tab, Card, CardBody} from "@nextui-org/react";
import TransferEther from '../components/TransferEther';
import TransferERC20 from '../components/TransferERC20';
import { useAccount, useBalance, useChains } from 'wagmi';
import Image from "next/image";
import Donate from '../components/Donate';
import Footer from '../components/Footer';



export default function Page() {

  const account = useAccount()
  const balance = useBalance({address: account.address})
  

  let tabs = [
    {
      id: "transferEth",
      label:`批量转账${balance.data?.symbol ? balance.data?.symbol:  "" }`,
      content: (<div>
        <TransferEther/>
      </div>)
    },
    {
      id: "transferERC20",
      label:"批量转账ERC20",
      content: (<div>
         <TransferERC20/>
      </div>)
    },
    {
      id: "donate",
      label: "捐赠",
      content: (<div>
         <Donate/>
      </div>)
    }
  ];

  return (
    <div>

      <div style={{height: '95vh'}}>
        <Navbar maxWidth="full" style={{backgroundColor: '#B6CDDF', }} className='justify-between'>
          <NavbarBrand>
            <Image
                  src="/logo.webp"
                  alt="Vercel Logo"
                  width={50}
                  height={24}
                  priority
                />
          </NavbarBrand>
          <NavbarContent justify="end">
            <NavbarItem>
              <ConnectButton 
                showBalance={{
                  smallScreen: true,
                  largeScreen: false,
                }}
              />
            </NavbarItem>
          </NavbarContent>
        </Navbar>
        <div className="flex w-full flex-col" >
          <Tabs aria-label="Dynamic tabs" items={tabs}  defaultSelectedKey="donate" style={{paddingLeft: '40%', textAlign: 'center', marginTop: '15px'}}>
            {(item) => (
              <Tab key={item.id} title={item.label}>
                <Card>
                  <CardBody>
                    {item.content}
                  </CardBody>
                </Card>  
              </Tab>
            )}
          </Tabs>
        </div>  
      </div>
      <Footer />
    </div>
  )
}
