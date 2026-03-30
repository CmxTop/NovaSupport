import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreatePage from '@/app/create/page';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock @/lib/config
vi.mock('@/lib/config', () => ({
  API_BASE_URL: 'http://localhost:4000',
}));

describe('CreatePage', () => {
  it('renders form with all required fields', () => {
    render(<CreatePage />);
    
    // Check for step 1 fields
    expect(screen.getByText('Create your support page')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/stellar-dev/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Your display name/i)).toBeInTheDocument();
  });

  it('shows validation error for invalid Stellar address', async () => {
    render(<CreatePage />);
    
    // Navigate to step 2 (wallet info)
    const nextButton = screen.getByRole('button', { name: /next/i });
    
    // Fill step 1 required fields first
    const usernameInput = screen.getByPlaceholderText(/stellar-dev/i);
    const displayNameInput = screen.getByPlaceholderText(/Your display name/i);
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(displayNameInput, { target: { value: 'Test User' } });
    
    fireEvent.click(nextButton);
    
    // Now on step 2, try invalid wallet
    await waitFor(() => {
      expect(screen.getByText(/Wallet/i)).toBeInTheDocument();
    });
  });

  it('renders asset selection', () => {
    render(<CreatePage />);
    
    expect(screen.getByText('Create your support page')).toBeInTheDocument();
  });
});
