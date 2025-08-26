import { motion } from 'framer-motion';
import { Linkedin, Github, Twitter, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: <Linkedin className="h-5 w-5" />,
      url: 'https://linkedin.com',
    },
    {
      name: 'GitHub',
      icon: <Github className="h-5 w-5" />,
      url: 'https://github.com',
    },
    {
      name: 'Twitter',
      icon: <Twitter className="h-5 w-5" />,
      url: 'https://twitter.com',
    },
    {
      name: 'Email',
      icon: <Mail className="h-5 w-5" />,
      url: 'mailto:sangay@example.com',
    },
  ];

  const footerLinks = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Projects', href: '#projects' },
        { name: 'Skills', href: '#skills' },
        { name: 'Contact', href: '#contact' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Resume', href: '#' },
        { name: 'Portfolio', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Certifications', href: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-zinc-900/80 border-t border-zinc-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Sangay Rinchen
            </h3>
            <p className="text-neutral-400 text-sm">
              Civil Engineering student passionate about structural design, sustainable construction, and innovative engineering solutions.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-neutral-300 hover:bg-emerald-500 hover:text-white transition-colors duration-300"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  title={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * (index + 1) }}
              className="space-y-4"
            >
              <h4 className="text-neutral-200 font-semibold text-lg">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-neutral-400 hover:text-emerald-400 transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h4 className="text-neutral-200 font-semibold text-lg">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-neutral-400 text-sm">Thimphu, Bhutan</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                <a href="mailto:sangay@example.com" className="text-neutral-400 hover:text-emerald-400 transition-colors duration-300 text-sm">
                  sangay@example.com
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                <a href="tel:+97577889900" className="text-neutral-400 hover:text-emerald-400 transition-colors duration-300 text-sm">
                  +975 77 88 99 00
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="border-t border-zinc-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-500 text-sm text-center md:text-left mb-4 md:mb-0">
              &copy; {currentYear} Sangay Rinchen. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-neutral-500 hover:text-emerald-400 text-sm transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-neutral-500 hover:text-emerald-400 text-sm transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-neutral-500 hover:text-emerald-400 text-sm transition-colors duration-300">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
