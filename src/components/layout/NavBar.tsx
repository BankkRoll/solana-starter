import React, { useEffect, useState } from "react";

import Link from "next/link";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { useWallet } from "@solana/wallet-adapter-react";

const WalletMultiButtonDynamic = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

const Navbar = () => {
  const wallet = useWallet();
  const [scrollingDown, setScrollingDown] = useState(false);

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      toast.success(`Connected to ${wallet.publicKey.toBase58()}`);
    } else if (!wallet.connecting && !wallet.connected) {
      toast.info("Disconnected from wallet");
    }

    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrollingDown(true);
      } else {
        setScrollingDown(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [wallet.connected, wallet.connecting, wallet.publicKey]);

  return (
    <nav
      className={`bg-background/80 fixed top-5 left-1/2 transform -translate-x-1/2 w-[80%] border border-border rounded-full shadow-xl z-50 transition-transform duration-300 ease-in-out ${
        scrollingDown
          ? "translate-y-[-100%] opacity-0"
          : "translate-y-0 opacity-100"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-6 py-2">
        <Link href="/" passHref>
          <img src="/sol.png" alt="logo" className="h-8 w-8" />
        </Link>

        <div className="flex items-center space-x-4">
          <WalletMultiButtonDynamic />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
