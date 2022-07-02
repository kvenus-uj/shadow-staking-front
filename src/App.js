import './App.css';
import { useEffect, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { FiHelpCircle } from "react-icons/fi";
import Poolinfo from "./components/PoolInfo"
import Myrewards from './components/MyRewards';
import Mybalance from './components/MyBalance';
import TutorialService from './services/TutorialService';
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

  const [totalStaked, setTotalStaked] = useState(0);
  const [estApr, setEstApr] = useState(0);
  const [curShadow, setCurShadow] = useState(0);
  const [estPerDay, setEstPerDay] = useState(0);
  const [myShadow, setMyShadow] = useState(0);
  const [myXShadow, setMyXShadow] = useState(0);
  const [userXShadow, setUserXShadow] = useState(0);
  const [curPrice, setCurPrice] = useState(1);
  const [expire, setExpire] = useState(true);
  // state change
  useEffect(() => {
    if (publicKey) {
      startClock();
    }
  }, [publicKey, connection]);

  async function myEventListener () {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    program.addEventListener('PriceChange', (e, s) => {
      console.log('Price Change In Slot ', s);
      console.log('From', e.oldStepPerXstepE9.toString());
      console.log('From', e.oldStepPerXstep.toString());
      console.log('To', e.newStepPerXstepE9.toString());
      console.log('To', e.newStepPerXstep.toString());
    });
  }

  async function startClock() {
    getMyReward();
    setTimeout(() => {
      startClock();
    }, 8000);
  }

  async function getProvider() {
    const network = "https://metaplex.devnet.rpcpool.com";
    const connection = new Connection(network, opts.preflightCommitment);
    const wallet = window.solana;

    const provider = new Provider(
      connection, wallet, opts.preflightCommitment,
    );
    return provider;
  }

  async function getMyReward() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    const [vaultPubkey] = await PublicKey.findProgramAddress(
      [mintPubkey.toBuffer()],
      program.programId
    );
    const [stakingPubkey] =
      await PublicKey.findProgramAddress(
        [Buffer.from(utils.bytes.utf8.encode('staking'))],
        program.programId
      );
    const  [userStakingPubkey] =
      await PublicKey.findProgramAddress(
        [wallet.publicKey.toBuffer()],
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
    const accountInfo = await provider.connection.getTokenAccountBalance(walletTokenAccount);
    setMyShadow(accountInfo.value.uiAmount);
    const vaultInfo = await provider.connection.getTokenAccountBalance(vaultPubkey);
    const tta = vaultInfo.value.uiAmount;
    setTotalStaked(tta);
    try{
      const stakingInfo = await program.account.stakingAccount.fetch(stakingPubkey);
      const txta = stakingInfo.totalXToken / 1000000000;
      const userStakingInfo = await program.account.userStakingAccount.fetch(userStakingPubkey);
      const uta = userStakingInfo.amount / 1000000000;
      const uxta = userStakingInfo.xTokenAmount / 1000000000;
      const uct = userStakingInfo.lockEndDate.toNumber();
      console.log(userStakingInfo.lockEndDate.toString(), Date.now() / 1000);
      console.log(userStakingInfo);
      let curprice = 0;
      if(txta === 0) {
        curprice = 1;
      }else {
        curprice = tta / txta;
      }
      let date_ob = new Date(uct*1000);
      setEstApr(date_ob.toLocaleString());
      const curTime = Math.floor(Date.now() / 1000);
      if( uct > curTime ) {
        const rt = (uct - curTime + 100) / 60;
        setEstPerDay(Math.floor(rt));
        setExpire(false);
      } else {
        setEstPerDay(0);
        setExpire(true);
      }
      setCurPrice(curprice);
      const cura = uxta * curprice;
      setCurShadow(cura);
      console.log(tta, txta, uta, uxta, curprice);  
      setMyXShadow(uta);
      setUserXShadow(uxta);
    }catch{
      console.log('none user staking.');
    }
    // await program.methods.emitReward().accounts(
    //     {
    //       tokenMint: mintPubkey,
    //       tokenVault: vaultPubkey,
    //       stakingAccount: stakingPubkey,
    //       tokenFromAuthority: wallet.publicKey,
    //       userStakingAccount: userStakingPubkey,
    //     },
    // ).rpc();
  }

  async function setMaxStake() {
    tokenAmount.current.value = myShadow;
  }

  async function setMaxUnstake() {
    xtokenAmount.current.value = myXShadow;
  }

  async function airdrop50() {
    var data = {
      wallet: wallet.publicKey.toString(),
    };
    TutorialService.shadowMint(data).then(response => {
      alert('Mint Success!!!');
    }).catch(e => {
      alert("fail:", e);
    });
  }

  async function stake() {
    if(expire && myXShadow > 0) {
      alert("Please stake again after claim all.");
      return;
    }
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
    console.log(tokenAmount.current.value,":stake");
  }

  async function unstake() {
    if(!expire) {
      alert("Not Expire!");
      return;
    }
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);

    const amount = Math.floor(xtokenAmount.current.value * 1000000 * userXShadow / myXShadow);
    console.log('aa', amount);
    const amount_bn = new BN(1e3).mul(new BN(amount));
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
          <FiHelpCircle className="text-white mr-5 cursor-pointer text-2xl" onClick={getMyReward} />
        </div>
        <div className='md:mx-auto rounded-b-xl bg-[#0000008a] pt-3 pb-3 px-5'>
          <button className='bg-[#2196f375] rounded-xl p-1 border' onClick={airdrop50}>Airdrop Shadow 50$Shadow</button>
          <Poolinfo totalStaked={totalStaked} estApr={estApr} />
          <Myrewards curShadow={curShadow} estPerDay={estPerDay} />
          <Mybalance tokenAmount={tokenAmount} xtokenAmount={xtokenAmount} 
            stake={stake} unstake={unstake} myShadow={myShadow} myXShadow={myXShadow}
            setMaxStake={setMaxStake} setMaxUnstake={setMaxUnstake} />
        </div>
      </div>
    </div>
  );
}

export default App;
