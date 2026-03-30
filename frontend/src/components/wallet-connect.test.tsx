import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WalletConnect } from '@/components/wallet-connect';

// Mock @stellar/freighter-api
vi.mock('@stellar/freighter-api', () => ({
  getAddress: vi.fn(),
  isAllowed: vi.fn(),
  setAllowed: vi.fn(),
}));

import { getAddress, isAllowed, setAllowed } from '@stellar/freighter-api';

describe('WalletConnect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  });

  it('renders connect button when disconnected', () => {
    render(<WalletConnect />);
    
    expect(screen.getByText('Wallet')).toBeInTheDocument();
    expect(screen.getByText('Connect Freighter to preview Stellar Testnet support.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Connect Freighter' })).toBeInTheDocument();
  });

  it('shows address when connected', async () => {
    const mockAddress = 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    
    (isAllowed as any).mockResolvedValue({ isAllowed: true });
    (getAddress as any).mockResolvedValue({ address: mockAddress, error: null });

    render(<WalletConnect />);
    
    const button = screen.getByRole('button', { name: 'Connect Freighter' });
    fireEvent.click(button);

    // Wait for async operations
    await screen.findByText(/Connected address:/);
    expect(screen.getByText(/GAAAAA/)).toBeInTheDocument();
  });

  it('shows not installed message when Freighter is not available', async () => {
    (window as any).stellarLumens = undefined;
    
    render(<WalletConnect />);
    
    const button = screen.getByRole('button', { name: 'Connect Freighter' });
    fireEvent.click(button);

    await screen.findByText(/Freighter wallet is not installed/);
    expect(screen.getByText(/Install it here/)).toBeInTheDocument();
  });
});
