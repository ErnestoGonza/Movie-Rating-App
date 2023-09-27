import React from 'react';
import MainContainer from '../user/MainContainer';
import Title from '../form/Title';
import { Link } from 'react-router-dom';
import FormInput from '../form/FormInput';
import Submit from '../form/Submit';
import { commonModalClasses } from '../../utils/theme';
import FormContainer from '../form/FormContainer';
import CustomLink from '../user/CustomLink';

export default function ForgotPassword() {
  return (
    <FormContainer>
      <MainContainer className={'flex justify-center'}>
        <form className={`${commonModalClasses} w-96`}>
          <Title>Please Enter Your Email</Title>
          <FormInput label="Email" placeholder="john@gmail.com" name="email" />
          <Submit value={'Send Link'} />
          <div className="flex justify-between">
            <CustomLink to={'/auth/sign-in'}>Sign in</CustomLink>
            <CustomLink to={'/auth/sign-up'}>Sign up</CustomLink>
          </div>
        </form>
      </MainContainer>
    </FormContainer>
  );
}
