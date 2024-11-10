import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { FaGoogle } from 'react-icons/fa'; // Removed FaFacebook

interface SignupFormProps {
  onNavigate: (page: string) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const title = 'Create Account';
  const buttonText = 'Continue';

  // Email validation regex
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Handle form submission for signup
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message

    // Validate email
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Validate name, password length, and confirmation
    if (!name) {
      setErrorMessage('Please enter your name.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    // Try to sign up with credentials
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      name, // Include name for signup
      mode: 'signup', // Pass the mode for signup
    });

    if (result?.error) {
      setErrorMessage(result.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen mx-4 relative">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-text-color2 font-poppins mb-6 text-center">
          {title}
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-text-color2 font-sourceSansPro px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-text-color2 font-sourceSansPro px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-text-color2 font-sourceSansPro px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full text-text-color2 font-sourceSansPro px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />

          {/* Error message */}
          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="bg-custom-purple text-white w-full py-2 rounded-md mb-4"
          >
            {buttonText}
          </button>
        </form>

        {/* Switch to signin */}
        <div className="text-center text-text-color2 font-sourceSansPro mb-4">
          <span>Already have an account?</span>
          <button
            className="text-custom-purple ml-2"
            onClick={() => onNavigate('SigninForm')}
          >
            Login
          </button>
        </div>

        <div className="flex items-center justify-center my-4">
          <span className="w-full border-t border-gray-300"></span>
          <span className="mx-2 text-text-color2 font-sourceSansPro">or</span>
          <span className="w-full border-t border-gray-300"></span>
        </div>

        {/* Social login buttons */}
        <div className="space-y-2">
          <button
            onClick={() => signIn('google')}
            className="w-full bg-white text-text-color2 font-sourceSansPro border border-gray-300 py-2 rounded-md flex items-center justify-start px-4"
          >
            <FaGoogle className="w-5 h-5 mr-2 text-text-color2" /> Continue with
            Google
          </button>
        </div>
      </div>
      <div className="text-center mt-6 text-lg logo_text_light font-bold italic ">
        Inzider
      </div>
      <div className="absolute bottom-4 text-center text-sm text-text-color1 space-x-4">
        <a href="/user-agreement" className="text-custom-purple">
          User Agreement
        </a>
        <span>|</span>
        <a href="/privacy-policy" className="text-custom-purple">
          Privacy Policy
        </a>
      </div>
    </div>
  );
};

export default SignupForm;
