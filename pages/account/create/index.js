import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react'
import { ToastContainer, toast } from 'react-toastify';
import Router from "next/router";
//import bcrypt from "bcrypt";
import 'react-toastify/dist/ReactToastify.css';

  const RegistrationForm = () => {
    // const session = useSession();
    // useEffect(() => {
    //     if (session.status === "authenticated") {
    //       // Redirect to login if user is not authenticated
    //       Router.push('/');
    //     }
    //   }, [session]);    


    const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
      repeatPassword: '',
      termsChecked: false,
    });
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: newValue,
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Validate form data before submitting (add your validation logic here)
      //formData.password = await bcrypt.hash(formData.password, 10)

      fetch('/api/account/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then(async (data) => {
          toast.success("Account created!");
          window.location.replace('/login') 
        })
        .catch((error) => {
          toast.error("Error creating account");
          console.log('Error creating account:', error);
          // Handle error (e.g., show error message)
        });
    };

  return (
    <div class="login-container">
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"/>
      <div class="login-wrapper">
        
        <form onSubmit={handleSubmit}>
            <h1 class="border-b size-large mb-4">Create Your Account</h1>
        <div class="mb-6">
            <label for="username" class="block mb-2 text-sm font-medium text-gray-900 ">Your username</label>
            <input 
                type="text" 
                id="username" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                placeholder="" 
                required 
            />
        </div>
        <div class="mb-6">
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">Your email</label>
            <input 
                type="email" 
                id="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                placeholder="name@flowbite.com" 
                required 
            />
        </div>
        <div class="mb-6">
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Your password</label>
            <input 
                type="password" 
                id="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " 
                required 
            />
        </div>
        <div class="mb-6">
            <label for="repeat-password" class="block mb-2 text-sm font-medium text-gray-900 ">Repeat password</label>
            <input 
                type="password" 
                id="repeat-password"
                name="repeatPassword" 
                value={formData.repeatPassword}
                onChange={handleChange}
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                required 
            />
        </div>
        <div className="flex items-start mb-6">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              name="termsChecked"
              checked={formData.termsChecked}
              onChange={handleChange}
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
              required
            />
          </div>
          <label htmlFor="terms" className="ml-2 text-sm font-medium text-gray-900">
            I agree with the{' '}
            <a href="#" className="text-blue-600 hover:underline">
              terms and conditions
            </a>
          </label>
        </div>
        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Register new account</button>
        </form>

        </div>
    </div>
  );
}


RegistrationForm.getLayout = function PageLayout(page){
    return(
      <>
        {page}
      </>
    )
  }

export default RegistrationForm;
