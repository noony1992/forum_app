import 'styles/globals.css';
import 'tailwindcss/tailwind.css';

import React from 'react';
import Modal from 'react-modal';
import { SessionProvider } from 'next-auth/react';
import Navbar from '../components/Navbar'


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
