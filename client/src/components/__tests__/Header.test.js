import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';
import { AuthProvider } from '../../context/AuthContext';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  it('should render header with logo', () => {
    renderWithProviders(<Header />);
    const logo = screen.getByText(/shopeasy/i);
    expect(logo).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/products/i)).toBeInTheDocument();
  });

  it('should show login and register links when not authenticated', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });
});

