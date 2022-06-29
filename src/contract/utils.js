import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import idl from './idl.json';
import * as anchor from "@project-serum/anchor";
import { sendTransactions } from './connection.tsx';
const opts = {
    preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);
const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);
const mintPubkey = new PublicKey('H6c2qLB48STy7GzcCFmDvxdpaQNX5dW8pJxSD2oPoGKg');

const getProvider = async(wallet) => {
  /* create the provider and return it to the caller */
  /* network set to local network for now */
  const network = "https://metaplex.devnet.rpcpool.com";//https://api.devnet.solana.com
  const connection = new Connection(network, opts.preflightCommitment);

  const provider = new anchor.Provider(
    connection, wallet, opts.preflightCommitment,
  );
  return provider;
}

export const _stake = async(wallet, amount)=> {

  const amount_bn = new anchor.BN(1e6).mul(new anchor.BN(amount));
  const provider = await getProvider(wallet);
  const program = new anchor.Program(idl, programID, provider);
  const [vaultPubkey, vaultBump] = await anchor.web3.PublicKey.findProgramAddress(
    [mintPubkey.toBuffer()],
    program.programId
  );
  const [stakingPubkey, stakingBump] =
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode('staking'))],
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
  await anchor.web3.PublicKey.findProgramAddress(
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
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      },
  ).rpc();
}

export const _unstake = async(wallet, amount) => {
  const amount_bn = new anchor.BN(1e6).mul(new anchor.BN(amount));
  const provider = getProvider(wallet);
  const program = new anchor.Program(idl, programID, provider);
  const [vaultPubkey, vaultBump] = await anchor.web3.PublicKey.findProgramAddress(
    [mintPubkey.toBuffer()],
    program.programId
  );
  const [stakingPubkey, stakingBump] =
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode('staking'))],
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
  const [userStakingPubkey, userStakingBump] =
    await anchor.web3.PublicKey.findProgramAddress(
      [wallet.publicKey.toBuffer()],
      program.programId
    );
  const signersMatrix = [];
  const instructionsMatrix = [];
  const signer = anchor.web3.Keypair.generate();
  const signers = [signer];
  const instructions = [
    program.instruction.unstake(
      vaultBump,
      stakingBump,
      userStakingBump,
      amount_bn,
      {
        accounts:{
          tokenMint: mintPubkey,
          xTokenFromAuthority: wallet.publicKey,
          tokenVault: vaultPubkey,
          stakingAccount: stakingPubkey,
          userStakingAccount: userStakingPubkey,
          tokenTo: walletTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
      },
    )
  ];
  signersMatrix.push(signers);
  instructionsMatrix.push(instructions);
  try {
		return (
		  await sendTransactions(
			provider.connection,
			wallet,
			instructionsMatrix,
			signersMatrix
		  )
		).txs.map(t => t.txid);
	  } catch (e) {
		console.log(e);
	  }
	
	return [];
}

export const _unstake_admin = async(wallet, amount)=>{
  const amount_bn = new anchor.BN(1e6).mul(new anchor.BN(amount));
  const provider = getProvider(wallet);
  const program = new anchor.Program(idl, programID, provider);
  const [vaultPubkey, vaultBump] = await anchor.web3.PublicKey.findProgramAddress(
    [mintPubkey.toBuffer()],
    program.programId
  );
  const [stakingPubkey, stakingBump] =
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode('staking'))],
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
  const [userStakingPubkey, userStakingBump] =
    await anchor.web3.PublicKey.findProgramAddress(
      [wallet.publicKey.toBuffer()],
      program.programId
    );
  await program.methods.unstakeAdmin(
    vaultBump,
    stakingBump,
    amount_bn,).accounts(
    {
      tokenMint: mintPubkey,
      admin: wallet.publicKey,
      tokenVault: vaultPubkey,
      stakingAccount: stakingPubkey,
      userStakingAccount: userStakingPubkey,
      tokenTo: walletTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
  ).rpc();
}

