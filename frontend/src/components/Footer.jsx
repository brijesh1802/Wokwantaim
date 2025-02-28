import { Facebook, Twitter, Linkedin, Phone, MapPin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300">
      <div className="container px-6 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Company Info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">JobPortal</h2>
            <p className="text-gray-400">
              Connecting job seekers and employers with ease. Your career, your future.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['About', 'Contact', 'Privacy Policy', 'Terms'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Contact</h3>
            <ul className="space-y-3">
              {[
                { icon: <Phone size={18} />, text: '+91 1234567897' },
                { icon: <MapPin size={18} />, text: 'Udupi, India' },
                { icon: <Mail size={18} />, text: 'xyz@gmail.com' },
              ].map((item, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="text-orange-500">{item.icon}</span>
                  <span className="text-gray-400">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          {/* <div>
            <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest job opportunities.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-r-md hover:bg-orange-600 transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div> */}

        </div>

        {/* Bottom Section */}
        <div className="pt-8 mt-8 border-t border-gray-700 text-center md:flex md:justify-between md:items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} JobPortal. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 mt-2 md:mt-0">
            Designed with ❤️ by Aroha Group
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
