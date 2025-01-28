const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto text-center">
        <p className="text-lg font-semibold mb-4">My E-Commerce</p>
        <p className="text-sm mb-4">&copy; 2023 My E-Commerce. All rights reserved.</p>
        <div className="flex justify-center space-x-4">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;