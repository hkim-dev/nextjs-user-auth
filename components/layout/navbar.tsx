import Link from 'next/link';
import UserOptions from './userOptions';

export default async function Navbar() {

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
      </ul>
      <ul className="nav-auth flex items-center">
        <li>
          <UserOptions />
        </li>
      </ul>
    </nav>
  );
};