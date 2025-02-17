import { Facebook, Twitter, Linkedin } from "lucide-react";

function Footer() {
  return (
    <footer className="mt-auto text-gray-300 bg-gray-900">
      <div className="container px-6 py-8 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Company Info */}
          <div>
            <h2 className="text-lg font-semibold text-white">JobPortal</h2>
            <p className="mt-2 text-gray-400">
              Connecting job seekers and employers with ease. Your career, your
              future.
            </p>
          </div>

          {/* Quick Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white">Quick Contact</h3>
            <ul className="mt-4 space-y-3 text-gray-400">
              <li className="flex items-center space-x-2">
                <i className="text-orange-500 fas fa-phone"></i>
                <span>+91 1234567897</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="text-orange-500 fas fa-map-marker-alt"></i>
                <span>Udupi, India</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="text-orange-500 fas fa-envelope"></i>
                <span>xyz@gmmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between pt-6 mt-8 border-t border-gray-700 md:flex-row">
          <p className="text-sm text-gray-400">
            &copy; 2025 JobPortal. All rights reserved.
          </p>
          <ul className="flex justify-center space-x-4 mt-3 -mb-1 lg:mt-0 md:-mt-1 md:-ml-16 lg:-mr-12">
            <li>
              <a
                href="#"
                className="text-gray-400 transition hover:text-orange-500"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 transition hover:text-orange-500"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 transition hover:text-orange-500"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </li>
          </ul>
          <nav className="mt-4 md:mt-0">
            <ul className="flex space-x-4">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-400 transition hover:text-orange-500"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-400 transition hover:text-orange-500"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-400 transition hover:text-orange-500"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-400 transition hover:text-orange-500"
                >
                  Terms
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
