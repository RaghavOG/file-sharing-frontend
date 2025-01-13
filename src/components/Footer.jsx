import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-neutral-900/80 backdrop-blur-sm py-4 text-center w-full mt-8 relative z-10 mb-4 md:mb-0">
      <p className="text-neutral-400">Made with 🫶 by Raghav</p>
      <div className="mt-2 space-x-4">
        <Link to="https://linkedin.com/in/singlaraghav" className="text-indigo-400 hover:text-indigo-300">LinkedIn</Link>
        <Link to="mailto:04raghavsingla28@gmail.com" className="text-indigo-400 hover:text-indigo-300">Email</Link>
        <Link to="https://github.com/raghavog" className="text-indigo-400 hover:text-indigo-300">GitHub</Link>
      </div>
    </footer>
  );
}

export default Footer;