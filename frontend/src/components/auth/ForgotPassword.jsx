import React, { useEffect, useState } from 'react';
import MainContainer from '../user/MainContainer';
import Title from '../form/Title';
import FormInput from '../form/FormInput';
import Submit from '../form/Submit';
import { commonModalClasses } from '../../utils/theme';
import FormContainer from '../form/FormContainer';
import { CustomLink } from '../form/CustomLink';
import {
  errorNotification,
  successNotificaiton,
} from '../../context/Notification';
import { forgotPassword } from '../../api/auth';
import { validateEmail } from '../../utils/helper';
import { useAuth } from '../../hooks';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) return navigate('/');
  }, [isLoggedIn, navigate]);

  const handleChange = ({ target }) => {
    const { value } = target;

    setEmail(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) return errorNotification('Email is missing!');
    if (!validateEmail(email)) return errorNotification('Invalid Email!');

    const { error, message } = await forgotPassword(email);

    if (error) errorNotification(error);

    successNotificaiton(message);
  };

  return (
    <FormContainer>
      <MainContainer className={'flex justify-center'}>
        <form onSubmit={handleSubmit} className={`${commonModalClasses} w-96`}>
          <Title>Please Enter Your Email</Title>
          <FormInput
            onChange={handleChange}
            value={email}
            label="Email"
            placeholder="john@gmail.com"
            name="email"
          />
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
