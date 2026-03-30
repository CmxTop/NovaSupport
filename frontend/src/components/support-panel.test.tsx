import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SupportPanel } from '@/components/support-panel';

// Mock @stellar/freighter-api
vi.mock('@stellar/freighter-api', () => ({
  getAddress: vi.fn(),
  isAllowed: vi.fn(),
  setAllowed: vi.fn(),
}));

vi.mock('@/lib/stellar', () => ({
  getNetworkLabel: vi.fn(() => 'Testnet'),
  stellarConfig: {
    horizonUrl: 'https://horizon-testnet.stellar.org',
    stellarNetwork: 'TESTNET',
    networkPassphrase: 'Test SDF Network ; September 2015',
  },
}));

describe('SupportPanel', () => {
  const mockProps = {
    walletAddress: 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    acceptedAssets: [
      { code: 'XLM', issuer: null },
      { code: 'USDC', issuer: 'GBBD47IF6LWK7P7MDMSCR4XFM6KJLGMGR5E2Q3ZXZQ4KQQYT5R3332W' },
    ],
  };

  it('renders network info', () => {
    render(<SupportPanel {...mockProps} />);
    
    expect(screen.getByText('Network')).toBeInTheDocument();
    expect(screen.getByText('Horizon')).toBeInTheDocument();
    expect(screen.getByText('Recipient')).toBeInTheDocument();
  });

  it('renders recipient address', () => {
    render(<SupportPanel {...mockProps} />);
    
    expect(screen.getByText(mockProps.walletAddress)).toBeInTheDocument();
  });

  it('renders amount input', () => {
    render(<SupportPanel {...mockProps} />);
    
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
  });

  it('renders Send Support button disabled by default', () => {
    render(<SupportPanel {...mockProps} />);
    
    const button = screen.getByRole('button', { name: 'Send Support' });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
});
