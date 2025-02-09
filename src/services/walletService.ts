
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID, 
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createCloseAccountInstruction
} from '@solana/spl-token';
import { toast } from '@/hooks/use-toast';

export class WalletService {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  async checkBalance(walletAddress: PublicKey, lamports: number): Promise<boolean> {
    try {
      const balance = await this.connection.getBalance(walletAddress);
      return balance >= lamports;
    } catch (error) {
      console.error('Error checking balance:', error);
      return false;
    }
  }

  async findOrCreateATA(
    walletAddress: PublicKey,
    mint: PublicKey,
    payer: PublicKey
  ): Promise<{ address: PublicKey; instruction?: any }> {
    try {
      const ata = await getAssociatedTokenAddress(
        mint,
        walletAddress,
        true,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      try {
        const account = await this.connection.getAccountInfo(ata);
        
        if (account) {
          return { address: ata };
        }

        const instruction = createAssociatedTokenAccountInstruction(
          payer,
          ata,
          walletAddress,
          mint,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        );

        return { address: ata, instruction };
      } catch (error) {
        console.error('Error checking ATA:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error with ATA:', error);
      toast({
        title: "Token Account Error",
        description: "Failed to setup token account",
        variant: "destructive"
      });
      throw error;
    }
  }

  async verifyWSOLAccount(
    walletAddress: PublicKey,
    amount: number
  ): Promise<{ address: PublicKey; createInstruction?: any; closeInstruction?: any }> {
    const mint = new PublicKey('So11111111111111111111111111111111111111112');
    
    const { address: ata, instruction: createInstruction } = await this.findOrCreateATA(
      walletAddress,
      mint,
      walletAddress
    );

    const closeInstruction = createCloseAccountInstruction({
      source: ata,
      destination: walletAddress,
      owner: walletAddress,
      TOKEN_PROGRAM_ID
    });

    return {
      address: ata,
      createInstruction,
      closeInstruction
    };
  }
}
