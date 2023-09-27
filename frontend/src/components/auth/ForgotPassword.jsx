import React from 'react';
import MainContainer from '../MainContainer';
import Title from '../form/Title';
import { Link } from 'react-router-dom';
import FormInput from '../form/FormInput';
import Submit from '../form/Submit';

export default function ForgotPassword() {
  return (
    <div className="fixed inset-0 dark:bg-primary -z-10 flex justify-center items-center ">
      <MainContainer className={'flex justify-center'}>
        <form className="dark:bg-secondary rounded p-5 w-72 space-y-5">
          <Title>Please Enter Your Email</Title>
          <FormInput label="Email" placeholder="john@gmail.com" name="email" />
          <Submit value={'Send Link'} />
          <div className="flex justify-between">
            <Link
              className="text-dark-subtle hover:text-white transition"
              to="/auth/sign-in"
            >
              Sign in
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
