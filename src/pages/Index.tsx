import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { WalletCard } from '@/components/WalletCard';
import { SendTransaction } from '@/components/SendTransaction';
import { useToast } from '@/hooks/use-toast';

// Declaración global para el objeto window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

const Index = () => {
  // Estados principales: conexión, dirección y balance
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const { toast } = useToast();

  // Función para conectar la wallet de MetaMask
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to continue",
        variant: "destructive",
      });
      return;
    }

    try {
      // Solicita acceso a las cuentas de MetaMask
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      
      setAddress(userAddress);
      setIsConnected(true);
      await updateBalance(provider, userAddress);

      toast({
        title: "Wallet connected!",
        description: "Successfully connected to MetaMask",
      });
    } catch (error: any) {
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  // Función para actualizar el balance de la wallet
  const updateBalance = async (provider?: ethers.BrowserProvider, userAddress?: string) => {
    if (!userAddress && (!isConnected || !address)) return;
    
    try {
      const ethProvider = provider || new ethers.BrowserProvider(window.ethereum);
      const balanceWei = await ethProvider.getBalance(userAddress || address!);
      const balanceEth = ethers.formatEther(balanceWei);
      setBalance(balanceEth); // Muestra el balance completo, sin redondear
    } catch (error) {
      console.error('Failed to update balance:', error);
    }
  };

  // Al cargar la página, verifica si ya hay una wallet conectada
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: '' });
          if (accounts.length > 0) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const userAddress = await signer.getAddress();
            
            setAddress(userAddress);
            setIsConnected(true);
            await updateBalance(provider, userAddress);
          }
        } catch (error) {
          console.error('Failed to check connection:', error);
        }
      }
    };

    checkConnection();
  }, []);

  // Escucha cambios de cuenta en MetaMask y actualiza el estado
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setIsConnected(false);
          setAddress(null);
          setBalance(null);
        } else {
          connectWallet();
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header centrado */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4 leading-[4rem]">
            Demo MetaMask
          </h1>
        </div>

        {/* Contenido principal: Wallet y envío de transacciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WalletCard
            onConnect={connectWallet}
            address={address}
            balance={balance}
            isConnected={isConnected}
          />
          
          <SendTransaction
            isConnected={isConnected}
            onTransactionSent={() => updateBalance()}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;