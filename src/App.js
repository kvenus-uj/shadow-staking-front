import './App.css';
import { useEffect, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { FiHelpCircle } from "react-icons/fi";
import Poolinfo from "./components/PoolInfo"
import Myrewards from './components/MyRewards';
import Mybalance from './components/MyBalance';
//import { _stake, _unstake, _unstake_admin } from './contract/utils';
import { Connection, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { Program, Provider, utils, BN } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import idl from './contract/idl.json';
const opts = {
  preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);
const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);
const mintPubkey = new PublicKey('H6c2qLB48STy7GzcCFmDvxdpaQNX5dW8pJxSD2oPoGKg');

function App(props) {
  const { publicKey } = useWallet();
  const { connection } = props;
  const wallet = useWallet();

  // input ref
  const tokenAmount = useRef();
  const xtokenAmount = useRef();

  // state change
  useEffect(() => {
     if (publicKey) {
     }
  }, [publicKey, connection]);

  async function getProvider() {
    const network = "https://api.devnet.solana.com";
    const connection = new Connection(network, opts.preflightCommitment);
    const wallet = window.solana;

    const provider = new Provider(
      connection, wallet, opts.preflightCommitment,
    );
    return provider;
  }

  async function stake() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    const amount = tokenAmount.current.value*1000;
    const amount_bn = new BN(1e6).mul(new BN(amount));
    const [vaultPubkey, vaultBump] = await PublicKey.findProgramAddress(
      [mintPubkey.toBuffer()],
      program.programId
    );
    const [stakingPubkey, stakingBump] =
      await PublicKey.findProgramAddress(
        [Buffer.from(utils.bytes.utf8.encode('staking'))],
        program.programId
      );
    const [walletTokenAccount] = await PublicKey.findProgramAddress(
      [
        wallet.publicKey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        mintPubkey.toBuffer(),
      ],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    );    
    const  [userStakingPubkey, userStakingBump] =
    await PublicKey.findProgramAddress(
      [wallet.publicKey.toBuffer()],
      program.programId
    );
    await program.methods.stake(
      vaultBump,
      stakingBump,
      userStakingBump,
      amount_bn,).accounts(
        {
          tokenMint: mintPubkey,
          tokenFrom: walletTokenAccount,
          tokenFromAuthority: wallet.publicKey,
          tokenVault: vaultPubkey,
          stakingAccount: stakingPubkey,
          userStakingAccount: userStakingPubkey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        },
    ).rpc();
    //await _stake(wallet, tokenAmount.current.value*1000);
    console.log(tokenAmount.current.value,":stake");
  }

  async function unstake() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    const amount = xtokenAmount.current.value*1000;
    const amount_bn = new BN(1e6).mul(new BN(amount));
    const [vaultPubkey, vaultBump] = await PublicKey.findProgramAddress(
      [mintPubkey.toBuffer()],
      program.programId
    );
    const [stakingPubkey, stakingBump] =
      await PublicKey.findProgramAddress(
        [Buffer.from(utils.bytes.utf8.encode('staking'))],
        program.programId
      );
    const [walletTokenAccount] = await PublicKey.findProgramAddress(
      [
        wallet.publicKey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        mintPubkey.toBuffer(),
      ],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    );    
    const  [userStakingPubkey, userStakingBump] =
    await PublicKey.findProgramAddress(
      [wallet.publicKey.toBuffer()],
      program.programId
    );
    await program.methods.unstake(
      vaultBump,
      stakingBump,
      userStakingBump,
      amount_bn,).accounts(
        {
          tokenMint: mintPubkey,
          xTokenFromAuthority: wallet.publicKey,
          tokenVault: vaultPubkey,
          stakingAccount: stakingPubkey,
          userStakingAccount: userStakingPubkey,
          tokenTo: walletTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        },
    ).rpc();
    //await _unstake(wallet, xtokenAmount.current.value*1000);
    console.log(xtokenAmount.current.value,":unstake");
  }

  return (
    <div className="main flex justify-center">
      <div className='py-2'>
        <div className="relative space-y-2 bg-[#323232] py-3 rounded-t-xl flex justify-between main-pad">
          <div className="flex justify-center w-11/12">
            <h3 className="text-white text-[20px] font-[500] font-bold">
              FLEXIBLE POOL
            </h3>
          </div>
          <FiHelpCircle className="text-white mr-5 cursor-pointer text-2xl" />
        </div>
        <div className='md:mx-auto rounded-b-xl bg-[#0000008a] pt-5 pb-3 px-5'>
          <Poolinfo />
          <Myrewards />
          <Mybalance tokenAmount={tokenAmount} xtokenAmount={xtokenAmount} stake={stake} unstake={unstake} />
        </div>
      </div>
    </div>
  );
}

export default App;
