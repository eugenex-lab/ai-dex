// src/constants/walletOptions.ts

export interface WalletOption {
  id: string;
  name: string;
  icon: string;
  chain: string;
  popular?: boolean;
}

export const WALLET_OPTIONS: WalletOption[] = [
  {
    id: "eternl",
    name: "Eternl",
    icon: "Eternl Icon.png",
    chain: "Cardano",
    popular: true,
  },
  {
    id: "nami",
    name: "Nami",
    icon: "tnami.svg", // Updated to use tnami.svg
    chain: "Cardano",
    popular: true,
  },
  {
    id: "yoroi",
    name: "Yoroi",
    icon: "Yoroi Icon.png",
    chain: "Cardano",
    popular: true,
  },
  {
    id: "lace",
    name: "Lace",
    icon: "lace icon.jpg",
    chain: "Cardano",
    popular: true,
  },
  {
    id: "flint",
    name: "Flint",
    icon: "flint.jpg",
    chain: "Cardano",
  },
  {
    id: "nufi",
    name: "NuFi",
    icon: "nufi.png",
    chain: "Cardano",
  },
  {
    id: "gerowallet",
    name: "Gero",
    icon: "gero.jpg",
    chain: "Cardano",
  },
  {
    id: "vespr",
    name: "Vespr",
    icon: "Vespr Icon.png",
    chain: "Cardano",
  },
  {
    id: "begin",
    name: "Begin",
    icon: "Begin Icon.png",
    chain: "Cardano",
  },
  {
    id: "tokeo",
    name: "Tokeo",
    icon: "Tokeo Icon.png",
    chain: "Cardano",
  },
  {
    id: "typhon",
    name: "Typhon",
    icon: "typon.svg",
    chain: "Cardano",
  },
  {
    id: "typhoncip30",
    name: "Typhoncip30",
    icon: "typon.svg",
    chain: "Cardano",
  },
  {
    id: "exodus",
    name: "Exodus",
    icon: "exodus.jpg",
    chain: "Cardano",
  },
  {
    id: "okxwallet",
    name: "OKX Wallet",
    icon: "okx.png",
    chain: "Cardano",
  },
];


