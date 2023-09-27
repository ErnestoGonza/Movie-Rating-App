import React from 'react';
import MainContainer from '../MainContainer';
import Title from '../form/Title';
import FormInput from '../form/FormInput';
import Submit from '../form/Submit';
import { Link } from 'react-router-dom';

export default function SignIn() {
  return (
    <div className="fixed inset-0 dark:bg-primary -z-10 flex justify-center items-center ">
      <MainContainer className={'flex justify-center'}>
        <form className="dark:bg-secondary rounded p-6 w-72 space-y-6">
          <Title>Sign In</Title>
          <FormInput label="Email" placeholder="john@gmail.com" name="email" />
          <FormInput label="Password" placeholder="*********" name="password" />
          <Submit value={'Sign In'} />
          <div className="flex justify-between">
            <Link
              className="text-dark-subtle hover:text-white transition"
              to="/auth/forgot-password"
            >
              Forgot Password
            </Link>
            <Link
              className="text-dark-subtle hover:text-white transition"
              to="/auth/sign-up"
            >
              Sign up
            </Link>
          </div>
        </form>
      </MainContainer>
    </div>
  );
}
