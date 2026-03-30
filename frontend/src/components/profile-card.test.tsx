import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProfileCard } from '@/components/profile-card';

describe('ProfileCard', () => {
  const mockProfile = {
    username: 'stellar-dev',
    displayName: 'Stellar Developer',
    bio: 'Building on Stellar blockchain',
    walletAddress: 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    acceptedAssets: [
      { code: 'XLM', issuer: null },
      { code: 'USDC', issuer: 'GBBD47IF6LWK7P7MDMSCR4XFM6KJLGMGR5E2Q3ZXZQ4KQQYT5R3332W' },
    ],
    email: 'dev@example.com',
    websiteUrl: 'https://example.com',
    twitterHandle: 'stellardev',
    githubHandle: 'stellar-dev',
  };

  it('renders display name and username', () => {
    render(<ProfileCard {...mockProfile} />);
    
    expect(screen.getByText('@stellar-dev')).toBeInTheDocument();
    expect(screen.getByText('Stellar Developer')).toBeInTheDocument();
  });

  it('renders bio', () => {
    render(<ProfileCard {...mockProfile} />);
    
    expect(screen.getByText('Building on Stellar blockchain')).toBeInTheDocument();
  });

  it('renders wallet address', () => {
    render(<ProfileCard {...mockProfile} />);
    
    expect(screen.getByText('Stellar Wallet')).toBeInTheDocument();
    expect(screen.getByText(mockProfile.walletAddress)).toBeInTheDocument();
  });

  it('renders social links', () => {
    render(<ProfileCard {...mockProfile} />);
    
    expect(screen.getByText('🌐 Website')).toBeInTheDocument();
    expect(screen.getByText('𝕏 @stellardev')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  it('renders accepted assets', () => {
    render(<ProfileCard {...mockProfile} />);
    
    expect(screen.getByText('Accepted assets')).toBeInTheDocument();
    expect(screen.getByText('XLM')).toBeInTheDocument();
    expect(screen.getByText('USDC')).toBeInTheDocument();
  });
});
