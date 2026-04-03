import React, { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

export interface HeaderProps {
  onSearch?: (query: string) => void;
  onNavigate?: (path: string) => void;
  isAuthenticated?: boolean;
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({
  onSearch,
  onNavigate,
  isAuthenticated = false,
  userName,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const navLinks = [
    { label: 'Jobs', path: '/jobs' },
    { label: 'Community', path: '/community' },
    { label: 'Mentorship', path: '/mentorship' },
    { label: 'Prayer', path: '/prayer' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => onNavigate?.('/')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              CD
            </div>
            <span className="text-lg font-semibold text-gray-900 hidden sm:inline">
              Christian Developers
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => onNavigate?.(link.path)}
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:block flex-1 max-w-xs mx-4"
          >
            <Input
              variant="search"
              placeholder="Search jobs, posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Auth Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700">{userName}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onNavigate?.('/logout')}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate?.('/login')}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigate?.('/signup')}
                >
                  Join Us
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  onNavigate?.(link.path);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded font-medium"
              >
                {link.label}
              </button>
            ))}

            <div className="px-4 py-2">
              <Input
                variant="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="px-4 space-y-2 border-t border-gray-200 pt-4">
              {isAuthenticated ? (
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={() => {
                    onNavigate?.('/logout');
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      onNavigate?.('/login');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      onNavigate?.('/signup');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Join Us
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
