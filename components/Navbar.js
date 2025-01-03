import { signOut, useSession  } from 'next-auth/react';
import { useEffect} from 'react';
import Router from "next/router";
import Link from 'next/link'


function Navbar(){
    const session = useSession();

    // useEffect(() => {
    //   if (session.status === "unauthenticated") {
    //     // Redirect to login if user is not authenticated
    //     Router.push('/login');
    //   }
    // }, [session]);
    let profilePicture = ''

    if(session?.data?.user[0]?.picture){
      profilePicture = '/images/' + session?.data?.user[0]?.picture;
    }
    return (
        <nav class="navbar-top border-gray-200 ">

        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" class="flex items-center">
            
            <span class="self-center text-4xl font-extrabold whitespace-nowrap dark:text-white">Forum</span>
        </a>
        <div class="flex items-center md:order-2">
            <button type="button" class="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
              <span class="sr-only">Open user menu</span>
              <img class="w-8 h-8 rounded-full" src={profilePicture} alt="user photo"/>
            </button>
            <div class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown">
              <div class="px-4 py-3">
              {session && (
                <>
                   <span class="block text-sm text-gray-900 dark:text-white">{session?.data?.user[0]?.username}</span>
                </>
              )}
                <span class="block text-sm  text-gray-500 truncate dark:text-gray-400">{session?.data?.user[0]?.email}</span>
              </div>
              <ul class="py-2" aria-labelledby="user-menu-button">  
                <li>
                  <Link href={`/profile/${session?.data?.user[0]?.username}`} class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white" shallow>My Profile</Link>
                </li>          
                <li>
                  <Link href={`/profile/${session?.data?.user[0]?.username}/settings`} class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white" shallow>Settings</Link>
                </li>     
                <li>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white" onClick={() => signOut()}>Sign out</a>
                </li>
              </ul>
            </div>
            <button data-collapse-toggle="navbar-user" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-user" aria-expanded="false">
              <span class="sr-only">Open main menu</span>
              <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
              </svg>
          </button>
        </div>
        <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
          <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          </ul>
        </div>
        </div>
      </nav>
    )
}

export default Navbar
