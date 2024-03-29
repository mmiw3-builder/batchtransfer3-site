'use client'
import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Tabs, Tab, Card, CardBody} from "@nextui-org/react";
import TransferEther from './components/TransferEther';
import TransferERC20 from './components/TransferERC20';
import { useAccount, useBalance, useChains } from 'wagmi';
import Image from "next/image";
import Donate from './components/Donate';
import Footer from './components/Footer';



export default function Page() {

  return (
    <div>
      <div style={{height: '100vh'}}>
          批量转账
      </div>
    </div>
  )
}
