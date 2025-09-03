import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Props que recibe el componente WalletCard
interface WalletCardProps {
  onConnect: () => void;           // Función para conectar la wallet
  address: string | null;          // Dirección de la wallet
  balance: string | null;          // Balance de la wallet
  isConnected: boolean;            // Estado de conexión
}

// Componente principal de la tarjeta de Wallet
export const WalletCard = ({ onConnect, address, balance, isConnected }: WalletCardProps) => {
  const { toast } = useToast();

  // Copiar la dirección al portapapeles y mostrar toast
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address copied!",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  // Abrir la dirección en Etherscan
  const openEtherscan = () => {
    if (address) {
      window.open(`https://holesky.etherscan.io/address/${address}`, '_blank');
    }
  };

  return (
    <Card className="glass-card p-6 min-w-[250px] md:min-w-[400px] min-h-[250px]">
      {/* Header de la tarjeta */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-primary/20 glow-effect">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold gradient-text">Wallet</h2>
          </div>
        </div>
        {/* Botón para conectar MetaMask si no está conectado */}
        {!isConnected && (
          <Button onClick={onConnect} variant="default" className="animate-pulse-glow">
            Connect MetaMask
          </Button>
        )}
      </div>

      {/* Si está conectado y hay dirección, mostrar balance y dirección */}
      {isConnected && address && (
        <div className="space-y-4">
          {/* Card de balance */}
          <div className="glass-card p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Balance</span>
              {/* Balance en ETH, tamaño de texto ajustado */}
              <span className="text-base font-bold text-accent">{balance} ETH</span>
            </div>
          </div>

          {/* Card de dirección */}
          <div className="glass-card p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Address</span>
              <div className="flex gap-2">
                {/* Botón para copiar dirección */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAddress}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                {/* Botón para abrir en Etherscan */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={openEtherscan}
                  className="h-8 w-8 p-0"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {/* Mostrar dirección en formato monoespaciado */}
            <p className="text-sm font-mono bg-muted/50 p-2 rounded break-all">
              {address}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};