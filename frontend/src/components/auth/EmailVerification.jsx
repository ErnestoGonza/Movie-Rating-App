import React, { useRef, useState, useEffect } from 'react';
import MainContainer from '../MainContainer';
import Title from '../form/Title';
import Submit from '../form/Submit';

const OTP_LENGTH = 6;

export default function EmailVerification() {
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(''));
  const inputRefs = useRef(Array(OTP_LENGTH).fill(null));

  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  const handleInputChange = (event, index) => {
    const value = event.target.value;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value.length === 1 && index < OTP_LENGTH - 1) {
      // Move focus to the next input
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = ({ key }, index) => {
    if (key === 'Backspace' && index > 0) {
      if (otp[index] === '') {
        // If the current input is empty, focus on the previous input
        inputRefs.current[index - 1].focus();
      } else {
        // If the current input is not empty, delete its value
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-primary -z-10 flex justify-center items-center ">
      <MainContainer className={'flex justify-center'}>
        <form className="bg-secondary rounded p-6 space-y-6">
          <div>
            <Title>Please enter your 6-digit verificaiton code</Title>
            <p className="text-center text-dark-subtle">
              Code has been sent to your email
            </p>
          </div>
          <div className="flex justify-center items-center space-x-4">
            {otp.map((_, index) => {
              return (
                <input
                  type="tel"
                  min="0"
                  max="9"
                  step="1"
                  maxLength="1"
                  key={index}
                  ref={(input) => (inputRefs.current[index] = input)}
                  value={otp[index]}
                  onChange={(event) => handleInputChange(event, index)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  className="w-12 h-12 border-2 rounded border-dark-subtle focus:border-white bg-transparent outline-none text-center text-white font-semibold"
                />
              );
            })}
          </div>
          <Submit value={'Send Link'} />
        </form>
      </MainContainer>
    </div>
  );
}
