import React from 'react';

export default function FormContainer(props) {
  return (
    <div
      className="fixed inset-0 dark:bg-primary -z-10 flex justify-center items-center"
      {...props}
    ></div>
  );
}
