import React from 'react';
import { Mail, Github, Twitter, Linkedin } from 'lucide-react';

export interface FooterStats {
  totalMembers?: number;
  jobsPosted?: number;
  prayerRequests?: number;
}

export interface FooterProps {
  stats?: FooterStats;
  verseOfTheDay?: {
    text: string;
    reference: string;
  };
}

const Footer: React.FC<FooterProps> = ({
  stats = {
    totalMembers: 5240,
    jobsPosted: 342,
    prayerRequests: 1203,
  },
  verseOfTheDay = {
    text: 'Therefore, as God\'s chosen people, holy and dearly loved, clothe yourselves with compassion, kindness, humility, gentleness and patience.',
    reference: 'Colossians 3:12',
  },
}) => {
  return (
    <footer className="bg-gray-900 text-gray-100 mt-16">
      {/* Verse of the Day */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-400 uppercase tracking-wide mb-3">
              Verse of the Day
            </p>
            <p className="text-lg italic mb-2">{verseOfTheDay.text}</p>
            <p className="text-sm font-semibold text-indigo-400">
              {verseOfTheDay.reference}
            </p>
          </div>
        </div>
      </div>

      {/* Community Stats */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-400">
                {stats.totalMembers?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400 mt-1">Community Members</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-400">
                {stats.jobsPosted?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400 mt-1">Jobs Posted</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-400">
                {stats.prayerRequests?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400 mt-1">Prayer Requests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                CD
              </div>
              <span className="font-semibold">Christian Developers</span>
            </div>
            <p className="text-sm text-gray-400">
              Building a community of Christian developers connecting faith,
              work, and purpose.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Jobs Board
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Mentorship
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Community Forum
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Prayer Requests
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Code of Conduct
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            &copy; 2024 Christian Developers. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
