import { useState } from 'react';
import { ethers } from 'ethers';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Props que recibe el componente: si está conectado y función para actualizar balance
interface SendTransactionProps {
  isConnected: boolean;
  onTransactionSent: () => void;
}

// Componente principal para enviar transacciones
export const SendTransaction = ({ isConnected, onTransactionSent }: SendTransactionProps) => {
  // Estados para dirección de destino, cantidad y estado de carga
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Función para enviar la transacción
  const sendTransaction = async () => {
    // Validación básica de campos y conexión
    if (!isConnected || !toAddress || !amount) {
      toast({
        title: "Error",
        description: "Please fill all fields and connect your wallet",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      // Crear proveedor y firmante usando ethers.js
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Enviar la transacción
      const tx = await signer.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(amount)
      });

      // Notificar éxito y mostrar hash
      toast({
        title: "Transaction sent!",
        description: `Transaction hash: ${tx.hash.substring(0, 20)}...`,
      });

      // Abrir la transacción en Etherscan
      window.open(`https://holesky.etherscan.io/tx/${tx.hash}`, '_blank');

      // Limpiar campos y actualizar balance
      setToAddress('');
      setAmount('');
      onTransactionSent();
    } catch (error: any) {
      // Notificar error
      toast({
        title: "Transaction failed",
        description: error.message || "Failed to send transaction",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Si no está conectado, mostrar card deshabilitada
  if (!isConnected) {
    return (
      <Card className="glass-card p-6 opacity-50">
        <div className="text-center">
          <Send className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Send ETH</h3>
        </div>
      </Card>
    );
  }

  // Card principal para enviar ETH
  return (
    <Card className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-full bg-accent/20 glow-effect">
          <Send className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h3 className="text-xl font-bold gradient-text">Send ETH</h3>
        </div>
      </div>

      {/* Formulario para dirección y cantidad */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="address" className="text-sm font-medium">
            Recipient Address
          </Label>
          <Input
            id="address"
            placeholder="0x..."
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            className="mt-1 font-mono"
          />
        </div>

        <div>
          <Label htmlFor="amount" className="text-sm font-medium">
            Amount (ETH)
          </Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.01"
            step="0.001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Botón para enviar la transacción */}
        <Button
          onClick={sendTransaction}
          disabled={isLoading || !toAddress || !amount}
          className="w-full animate-pulse-glow"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Transaction
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};