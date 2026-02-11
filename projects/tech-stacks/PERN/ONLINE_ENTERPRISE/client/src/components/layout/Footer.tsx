import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-warm-900 text-white">
      {/* Main Footer */}
      <div className="page-container py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <span className="text-xl font-bold text-white">UrbanPottery</span>
            </Link>
            <p className="text-warm-300 mb-6 leading-relaxed max-w-xs">
              Handcrafted ceramics made with love. Each piece brings artisanal beauty to your home.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={`Follow us on ${Icon.name}`}
                  className="w-11 h-11 rounded-xl bg-warm-800 hover:bg-primary-600 flex items-center justify-center text-warm-300 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold mb-5 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Shop All', to: '/shop' },
                { label: 'New Arrivals', to: '/shop?sort=newest' },
                { label: 'Best Sellers', to: '/shop?sort=popular' },
                { label: 'About Us', to: '/about' },
              ].map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.to} 
                    className="text-warm-300 hover:text-white transition-colors inline-block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-base font-semibold mb-5 text-white">Categories</h4>
            <ul className="space-y-3">
              {['Vases', 'Bowls', 'Plates', 'Mugs', 'Planters'].map((category) => (
                <li key={category}>
                  <Link
                    to={`/shop?category=${category.toLowerCase()}`}
                    className="text-warm-300 hover:text-white transition-colors inline-block py-0.5"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base font-semibold mb-5 text-white">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-0.5 shrink-0" aria-hidden="true" />
                <address className="text-warm-300 leading-relaxed not-italic">
                  123 Pottery Lane<br />
                  Artisan City, AC 12345
                </address>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-400 shrink-0" aria-hidden="true" />
                <a 
                  href="mailto:hello@urbanpottery.com" 
                  className="text-warm-300 hover:text-white transition-colors"
                >
                  hello@urbanpottery.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-400 shrink-0" aria-hidden="true" />
                <a 
                  href="tel:+15551234567" 
                  className="text-warm-300 hover:text-white transition-colors"
                >
                  (555) 123-4567
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-warm-800">
        <div className="page-container py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-warm-400 text-sm">
              © {currentYear} UrbanPottery. All rights reserved.
            </p>
            <nav className="flex gap-6 text-sm" aria-label="Legal">
              <Link to="/privacy" className="text-warm-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-warm-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
