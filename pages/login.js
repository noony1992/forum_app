import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react'
import { ToastContainer, toast } from 'react-toastify';
import Router from "next/router";
import 'react-toastify/dist/ReactToastify.css';

export default function SignIn() {

  const session = useSession();
  useEffect(() => {
    if (session.status === "authenticated") {
      // Redirect to login if user is not authenticated
      Router.push('/');
    }
  }, [session]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');



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
        <span class="login-title">Sign In</span>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
            onClick={() => 
              signIn(
                'credentials', { 
                  redirect: false, 
                  username, 
                  password,
                }   
              )
              .then(({ ok, error }) => {
                if (ok) {
                  toast.success("Login Successfull");
                  window.location.replace('/') 
                } else {
                    toast("Credentials do not match!", { type: "error" });
                }})
            }>         
          Login</button>

      </div>
    </div>
  );
}

SignIn.getLayout = function PageLayout(page){
  return(
    <>
      {page}
    </>
  )
}
