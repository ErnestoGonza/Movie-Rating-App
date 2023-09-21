import React from 'react';

export default function MainContainer({ children, className }) {
  return <div className={'w-full mx-auto ' + className}>{children}</div>;
}
