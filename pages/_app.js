import 'styles/globals.css';
import 'tailwindcss/tailwind.css';

import React from 'react';
import Modal from 'react-modal';
import { SessionProvider } from 'next-auth/react';
import Navbar from '../components/Navbar'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import 'flowbite';

// Set the app element
Modal.setAppElement('#__next');


const MyApp = ({ Component, pageProps }) => {
  if(Component.getLayout){
    return Component.getLayout(
      <SessionProvider session={pageProps.session}>
        <>
          <Component {...pageProps} />
        </>
      </SessionProvider>
    )
  }

  return (
    <SessionProvider session={pageProps.session}>
      <>
        <Navbar />
        <Component {...pageProps} />
      </>
    </SessionProvider>
  );
};

export default MyApp;
