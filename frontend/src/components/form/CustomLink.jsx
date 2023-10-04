import React from 'react';
import { Link } from 'react-router-dom';

export function CustomLink({ children, to }) {
  return (
    <Link
      className="group relative dark:text-dark-subtle text-light-subtle dark:hover:text-white hover:text-primary transition-transform"
      to={to}
    >
      {children}
      <span className="absolute left-0 bottom-0 w-full h-0.5 bg-logo transform scale-x-0 transition-transform group-hover:scale-x-100"></span>
    </Link>
  );
}