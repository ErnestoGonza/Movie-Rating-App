import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainContainer from '../user/MainContainer';
import Title from '../form/Title';
import FormInput from '../form/FormInput';
import Submit from '../form/Submit';
import { commonModalClasses } from '../../utils/theme';
import FormContainer from '../form/FormContainer';
import CustomLink from '../user/CustomLink';
import { createUser } from '../../api/auth';
import { errorNotification } from '../../context/Notification';

export default function SignUp() {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = userInfo;

  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    const { value, name } = target;

    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateUserInfo = ({ name, email, password }) => {
    const isValidEmail =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const isValidName = /^[a-z A-Z]+$/;

    if (!name.trim()) return { ok: false, error: 'Name is missing!' };
    if (!isValidName.test(name)) return { ok: false, error: 'Invalid name!' };

    if (!email.trim()) return { ok: false, error: 'Email is missing!' };
    if (!isValidEmail.test(email))
      return { ok: false, error: 'Invalid email!' };

    if (!password.trim()) return { ok: false, error: 'Password is missing!' };
    if (password.length < 8 || password.length > 20)
      return {
        ok: false,
        error: 'Password must be between 8 - 20 characters!',
      };

    return { ok: true };
  };

  const createNewUser = async (e) => {
    e.preventDefault();

    const validUser = validateUserInfo(userInfo);

    if (!validUser.ok) console.log(validUser.error);

    const { error, user } = await createUser(userInfo);
    if (error) return errorNotification(error);

    navigate('/auth/verification', { state: { user }, replace: true });
  };

  return (
    <FormContainer>
      <MainContainer className={'flex justify-center'}>
        <form className={`${commonModalClasses} w-72`} onSubmit={createNewUser}>
          <Title>Create Account</Title>
          <FormInput
            label="Name"
            placeholder="John Doe"
            name="name"
            value={name}
            onChange={handleChange}
          />
          <FormInput
            label="Email"
            placeholder="john@gmail.com"
            name="email"
            value={email}
            onChange={handleChange}
          />
          <FormInput
            label="Password"
            placeholder="*********"
            name="password"
            type="password"
            value={password}
            onChange={handleChange}
          />
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
