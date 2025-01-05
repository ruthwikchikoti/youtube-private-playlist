import React, { useState, useRef } from 'react';
import Button from '../common/Button';

const OtpInput = ({ onSubmit, loading }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef(new Array(6));

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(otp.join(''));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label className="text-white mb-2 block">Enter verification code</label>
        <div className="flex justify-between gap-2">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength="1"
              ref={(ref) => inputs.current[idx] = ref}
              value={digit}
              onChange={(e) => handleChange(e.target, idx)}
              className="w-12 h-12 text-center text-2xl bg-gray-700 border border-gray-600 rounded-lg
                         focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
            />
          ))}
        </div>
      </div>
      <Button
        type="submit"
        className="w-full"
        loading={loading}
        disabled={otp.some(v => !v)}
      >
        Verify Code
      </Button>
    </form>
  );
};

export default OtpInput;