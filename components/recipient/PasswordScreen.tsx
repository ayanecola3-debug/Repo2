'use client';
import { useState } from 'react';

interface PasswordScreenProps {
  recipientName: string;
  passwordError: boolean;
  onPasswordChange: (value: string) => void;
  onPasswordSubmit: () => void;
}

export function PasswordScreen({ recipientName, passwordError, onPasswordChange, onPasswordSubmit }: PasswordScreenProps) {
  const [passwordInput, setPasswordInput] = useState('');

  const handleSubmit = () => {
    onPasswordChange(passwordInput);
    onPasswordSubmit();
  };

  return (
    <>
      <div className="recipientart">🔒</div>
      <div className="eyebrow">YOUR SURPRISE AWAITS</div>
      <h1>Hey,<br/><em>{recipientName}.</em> ✦</h1>
      <p>Someone created a special birthday surprise just for you. Enter the password to unlock it.</p>
      <div className="field">
        <label>PASSWORD</label>
        <input type="text" placeholder="Enter the password" value={passwordInput} onChange={e=>setPasswordInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSubmit()}/>
        {passwordError&&<p className="error">Incorrect password. Please try again.</p>}
      </div>
      <button className="primary" onClick={handleSubmit}>Unlock surprise ♥</button>
    </>
  );
}
