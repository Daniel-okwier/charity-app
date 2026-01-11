import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
//import logo from '@/assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-islamic-dark text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
             { /* <img src={logo} alt="At-Taawun Logo" className="h-10 bg-white rounded-full p-1" />*/}
              <span className="text-xl font-bold text-white">At-Taawun</span>
            </div>
            <p className="text-gray-300 mb-4">
              At-Taawun is dedicated to Islamic charitable causes, helping communities in need through sustainable development projects and emergency relief.
            </p>
            <div className="flex space-x-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-islamic-primary hover:bg-islamic-secondary p-2 rounded-full transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-islamic-primary hover:bg-islamic-secondary p-2 rounded-full transition-colors">
                <Twitter size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-islamic-primary hover:bg-islamic-secondary p-2 rounded-full transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-islamic-primary pb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-islamic-accent transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-islamic-accent transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-300 hover:text-islamic-accent transition-colors">Projects</Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-islamic-accent transition-colors">Become a Donor</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-islamic-accent transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-islamic-primary pb-2">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 text-islamic-accent" />
                <span className="text-gray-300">123 Charity Lane, Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-islamic-accent" />
                <span className="text-gray-300">+251 91 234 5678</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-islamic-accent" />
                <span className="text-gray-300">info@at-taawun.com</span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-islamic-primary pb-2">Newsletter</h3>
            <p className="text-gray-300 mb-4">Subscribe to our newsletter to get updates on our projects and campaigns.</p>
            <form className="space-y-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-islamic-accent"
              />
              <button 
                type="submit" 
                className="w-full bg-islamic-primary hover:bg-islamic-secondary text-white py-2 px-4 rounded transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} At-Taawun. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
