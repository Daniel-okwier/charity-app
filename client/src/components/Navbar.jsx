import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@components/ui/button';
import { useAuth } from '@contexts/AuthContext';
import { Menu, X, User, LogOut, DollarSign } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const scrollToHero = () => {
    const el = document.getElementById('home');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    closeMenu();
  };

  const navLinks = [
    { name: 'ዋና ገጽ', path: '/' },
    { name: 'ስለ እኛ', path: '#about' },
    { name: 'ስራዎቻችን', path: '#projects' },
    { name: 'አድራሻ', path: '#contact' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const renderLink = (link, className, onClick) => {
    return link.path.startsWith('#') ? (
      <a
        key={link.name}
        href={link.path}
        onClick={onClick}
        className={className}
      >
        {link.name}
      </a>
    ) : (
      <Link
        key={link.name}
        to={link.path}
        onClick={onClick}
        className={className}
      >
        {link.name}
      </Link>
    );
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <span className="text-xl font-bold text-islamic-primary">አት-ተዓውን</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) =>
              link.path === '/' ? (
                <a
                  key={link.name}
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHero();
                  }}
                  className={`text-sm font-bold hover:text-islamic-primary transition-colors ${
                    location.pathname === '/' && location.hash === ''
                      ? 'text-islamic-primary'
                      : 'text-islamic-text'
                  }`}
                >
                  {link.name}
                </a>
              ) : (
                renderLink(
                  link,
                  `text-sm font-bold hover:text-islamic-primary transition-colors ${
                    isActive(link.path) || location.hash === link.path
                      ? 'text-islamic-primary'
                      : 'text-islamic-text'
                  }`,
                  closeMenu
                )
              )
            )}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" className="text-islamic-text hover:text-islamic-primary">
                    <User size={18} className="mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/payment">
                  <Button className="bg-islamic-primary hover:bg-islamic-secondary text-white">
                    <DollarSign size={18} className="mr-2" />
                    Donate
                  </Button>
                </Link>
                <Button variant="ghost" onClick={handleLogout} className="text-islamic-text hover:text-islamic-primary">
                  <LogOut size={18} className="mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-islamic-text hover:text-islamic-primary">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-islamic-primary hover:bg-islamic-secondary text-white">Register</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" onClick={toggleMenu} className="text-islamic-text">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) =>
                link.path === '/' ? (
                  <a
                    key={link.name}
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToHero();
                    }}
                    className={`text-sm font-bold px-3 py-2 rounded-md ${
                      location.pathname === '/' && location.hash === ''
                        ? 'bg-islamic-light text-islamic-primary'
                        : 'text-islamic-text hover:bg-islamic-light hover:text-islamic-primary'
                    }`}
                  >
                    {link.name}
                  </a>
                ) : (
                  renderLink(
                    link,
                    `text-sm font-bold px-3 py-2 rounded-md ${
                      isActive(link.path) || location.hash === link.path
                        ? 'bg-islamic-light text-islamic-primary'
                        : 'text-islamic-text hover:bg-islamic-light hover:text-islamic-primary'
                    }`,
                    closeMenu
                  )
                )
              )}

              {/* Auth Buttons - Mobile */}
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={closeMenu} className="flex items-center">
                      <Button variant="ghost" className="w-full justify-start text-islamic-text">
                        <User size={18} className="mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link to="/payment" onClick={closeMenu} className="flex items-center">
                      <Button className="w-full justify-start bg-islamic-primary hover:bg-islamic-secondary text-white">
                        <DollarSign size={18} className="mr-2" />
                        Donate
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start text-islamic-text"
                    >
                      <LogOut size={18} className="mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={closeMenu} className="block">
                      <Button
                        variant="ghost"
                        className="w-full justify-center text-islamic-text"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={closeMenu} className="block">
                      <Button
                        className="w-full justify-center bg-islamic-primary hover:bg-islamic-secondary text-white"
                      >
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;