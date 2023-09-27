import React from 'react';
import MainContainer from '../user/MainContainer';
import Title from '../form/Title';
import FormInput from '../form/FormInput';
import Submit from '../form/Submit';
import { commonModalClasses } from '../../utils/theme';
import FormContainer from '../form/FormContainer';
import CustomLink from '../user/CustomLink';

export default function SignUp() {
  return (
    <FormContainer style={{ paddingTop: '5%' }}>
      <MainContainer className={'flex justify-center'}>
        <form className={`${commonModalClasses} w-72`}>
          <Title>Create Account</Title>
          <FormInput label="First Name" placeholder="John" name="first name" />
          <FormInput label="Last Name" placeholder="Doe" name="last name" />
          <FormInput label="Email" placeholder="john@gmail.com" name="email" />
          <FormInput label="Password" placeholder="*********" name="password" />
          <Submit value={'Create Account'} />
          <div className="flex justify-center">
            <CustomLink to={'/auth/sign-in'}>
              Already have an account?
            </CustomLink>
          </div>
        </form>
      </MainContainer>
    </FormContainer>
  );
}
