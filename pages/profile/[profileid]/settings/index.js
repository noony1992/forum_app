import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from "axios";
import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { Tabs } from 'flowbite-react';
import { HiAdjustments, HiClipboardList, HiUserCircle } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';
import ModalComponent from '/components/ModalComponent';
import Router from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'flowbite';

export default function Home() {
    const [threadCategories, setThreadCategories] = useState([]);
    const [threadCategorySearchQuery, setThreadCategorySearchQuery] = useState('');
    const [newThreadCategory, setNewThreadCategory] = useState('');

    useEffect(() => {
        fetch('/api/settings/categories')
          .then((response) => response.json())
          .then((data) => {
            setThreadCategories(data)
          });
      }, []);

      const createThreadCategory = () => {
        toast.info("Creating category...", {containerId: 'A'})
        fetch('/api/settings/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ category: newThreadCategory}),
        })
          .then((response) => response.json())
          .then((data) => {
            setThreadCategories((prevThreadCategories) => [...prevThreadCategories, data]);
            toast.success("Category added!", {containerId: 'A'})
          }).catch((error) => {
            console.log('Error adding category:', error);
            toast.error("There was a issue trying to create this category, please try again later.", {containerId: 'A'});
          });
      };

    return (
        
        <div class="container max-w-5xl mx-auto px-4 py-8 w-full mb-6 shadow-xl rounded-lg">
            <ToastContainer 
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss={false}
              draggable
              pauseOnHover
              theme="light"/>
        <Tabs.Group
              aria-label="Tabs with underline"
              style="underline"
            >
              <Tabs.Item
                active
                icon={HiUserCircle}
                title="Settings"
              >
                
              </Tabs.Item>
              <Tabs.Item
                icon={MdDashboard}
                title="Admin Settings"
              >
               
                
                    <button id="dropdownSearchButton" data-dropdown-toggle="dropdownSearch2" data-dropdown-placement="bottom" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Dropdown search <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                    </svg></button>

                    <div id="dropdownSearch2" class="z-10 hidden bg-white rounded-lg shadow w-60 dark:bg-gray-700">
                        <div class="p-3">
                        <label for="input-group-search" class="sr-only">Search</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                            </div>
                            <input 
                                type="text" 
                                id="input-group-search" 
                                class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                placeholder="Search category" 
                                value={threadCategorySearchQuery}
                                onChange={(e) => setThreadCategorySearchQuery(e.target.value)}
                            />
                        </div>
                        </div>
                        <ul class="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownSearchButton">       
                            {threadCategories     
                                .filter((category) =>
                                    category.category.toLowerCase().includes(threadCategorySearchQuery.toLowerCase())
                                )                       
                                .map((category) => (
                                    <li key={category}>
                                        <div class="flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                        <input id={`checkbox-item-${category.id}`} type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                        <label for={`checkbox-item-${category.id}`} class="w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">{category.category}</label>
                                        </div>
                                    </li>
                            ))}                   
                        </ul>
                        <label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Add category</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg class="w-4 h-4 mr-2 text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                                    </svg>
                                </div>
                                <input 
                                    type="text" 
                                    id="search" 
                                    class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    placeholder="Add Category" 
                                    value={newThreadCategory}
                                    onChange={(e) => setNewThreadCategory(e.target.value)}
                                />
                                <button 
                                    type="submit" 
                                    class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    onClick={createThreadCategory}
                                >
                                        Add
                                </button>
                            </div>
                        <a href="#" class="flex items-center p-3 text-sm font-medium text-red-600 border-t border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-red-500 hover:underline">
                            <svg class="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-6a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2Z"/>
                            </svg>
                            Delete category
                        </a>
                    </div>

                
              </Tabs.Item>
              
            </Tabs.Group>    
        </div>
    )
}