
interface CardanoWallet {
  enable: () => Promise<any>;
  getUsedAddresses: () => Promise<string[]>;
  isEnabled: () => Promise<boolean>;
}

interface Cardano {
  nami?: CardanoWallet;
  eternl?: CardanoWallet;
  flint?: CardanoWallet;
  lace?: CardanoWallet;
  begin?: CardanoWallet;
  tokeo?: CardanoWallet;
  vespr?: CardanoWallet;
}

interface Window {
  cardano?: Cardano;
}
