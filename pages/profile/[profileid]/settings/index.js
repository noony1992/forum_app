import  React from 'react'
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Tabs } from 'flowbite-react';
import { HiAdjustments, HiClipboardList, HiUserCircle } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Checkbox, Table, Sidebar } from 'flowbite-react';
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from 'react-icons/hi';

export default function Home() {
    const [threadCategories, setThreadCategories] = useState([]);
    const [threadCategorySearchQuery, setThreadCategorySearchQuery] = useState('');
    const [newThreadCategory, setNewThreadCategory] = useState('');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [checkedCategories, setCheckedCategories] = useState([]);

    const session = useSession();

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

      const handleCategoryCheckbox = (categoryId) => {
        setCheckedCategories((prevChecked) =>
          prevChecked.includes(categoryId)
            ? prevChecked.filter((id) => id !== categoryId)
            : [...prevChecked, categoryId]
        );
        console.log(checkedCategories)
      };

      const handleDeleteCategories = () => {
        if (checkedCategories.length === 0) {
          // If there are no categories checked, show a message or return early
          toast.warning('Please select categories to delete.', { containerId: 'B' });
          return;
        }
      
        const promises = [];
      
        // Loop through the checkedCategories array and delete each category one by one
        checkedCategories.forEach((categoryId) => {
          promises.push(
            fetch(`/api/settings/categories/${categoryId}`, {
              method: 'DELETE',
            })
          );
        });
      
        // Wait for all the delete requests to complete using Promise.all
        Promise.all(promises)
          .then(() => {
            // Remove the deleted categories from the threadCategories state
            const updatedCategories = threadCategories.filter(
              (category) => !checkedCategories.includes(category.id)
            );
            setThreadCategories(updatedCategories);
      
            // Reset the checkedCategories state after deletion
            setCheckedCategories([]);
      
            toast.success('Categories Deleted!', { containerId: 'B' });
          })
          .catch((error) => {
            console.log('Error deleting categories:', error);
            toast.error('There was an issue trying to delete the categories, please try again later.', {
              containerId: 'B',
            });
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
                <h1>Settings go here...</h1>
              </Tabs.Item>
              <Tabs.Item
                icon={HiUserCircle}
                title="Profile"
              >
                <h1>Profile goes here...</h1>
              </Tabs.Item>
              
              {session.data?.user[0].admin ? (
                  <Tabs.Item
                    icon={MdDashboard}
                    title="Admin Settings"
                  >
                    <>
                    <div class="flex">
                    <div class="w-1/4" >
          <Sidebar aria-label="Sidebar with multi-level dropdown example">
            <Sidebar.Items>
            <Sidebar.ItemGroup>
            <Sidebar.Item
            href="#"
            icon={HiChartPie}
          >
            <p>
              Dashboard
            </p>
          </Sidebar.Item>
          <Sidebar.Collapse
            icon={HiShoppingBag}
            label="E-commerce"
          >
            <Sidebar.Item href="#">
              Products
            </Sidebar.Item>
            <Sidebar.Item href="#">
              Sales
            </Sidebar.Item>
            <Sidebar.Item href="#">
              Refunds
            </Sidebar.Item>
            <Sidebar.Item href="#">
              Shipping
            </Sidebar.Item>
          </Sidebar.Collapse>
          <Sidebar.Item
            href="#"
            icon={HiInbox}
          >
            <p>
              Inbox
            </p>
          </Sidebar.Item>
          <Sidebar.Item
            href="#"
            icon={HiUser}
          >
            <p>
              Users
            </p>
          </Sidebar.Item>
          <Sidebar.Item
            href="#"
            icon={HiShoppingBag}
          >
            <p>
              Products
            </p>
          </Sidebar.Item>
          <Sidebar.Item
            href="#"
            icon={HiArrowSmRight}
          >
            <p>
              Sign In
            </p>
          </Sidebar.Item>
          <Sidebar.Item
            href="#"
            icon={HiTable}
          >
            <p>
              Sign Up
            </p>
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
    </div>
                <div class="w-3/4">
                    <button id="dropdownSearchButton" onClick={() => setIsDropdownVisible((prev) => !prev)} data-dropdown-toggle="dropdownSearch" data-dropdown-placement="bottom" class="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 " type="button">Categories <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                    </svg></button>

                    {isDropdownVisible && (

                    <div id="dropdownSearch" class="z-10 bg-white rounded-lg shadow w-60 dark:bg-gray-700 absolute mt-1">
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
                                    <li key={category.id}>
                                        <div class="flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                        <input 
                                          id={`checkbox-item-${category.id}`} 
                                          type="checkbox" 
                                          value="" 
                                          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" 
                                          checked={checkedCategories.includes(category.id)}
                                          onChange={() => handleCategoryCheckbox(category.id)}
                                        />
                                        <label 
                                          for={`checkbox-item-${category.id}`} 
                                          class={`w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded ${
                                            checkedCategories.includes(category.id)
                                              ? "bg-green-100 dark:bg-green-600"
                                              : ""
                                          } dark:text-gray-300`}
                                        >
                                            {category.category}
                                        </label>
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
                            <button
                              type="button"
                              onClick={handleDeleteCategories}
                              class="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-sm rounded-lg text-sm px-5 py-2 mt-3 w-11/12 center m-2"
                            >
                              Delete Selected Categories
                            </button>

                    </div>
                    )}
                      <Table class="w-full relative" hoverable>
                        <Table.Head>
                          <Table.HeadCell className="p-4">
                            <Checkbox />
                          </Table.HeadCell>
                          <Table.HeadCell>
                            Product name
                          </Table.HeadCell>
                          <Table.HeadCell>
                            Color
                          </Table.HeadCell>
                          <Table.HeadCell>
                            Category
                          </Table.HeadCell>
                          <Table.HeadCell>
                            Price
                          </Table.HeadCell>
                          <Table.HeadCell>
                            <span className="sr-only">
                              Edit
                            </span>
                          </Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="p-4">
                              <Checkbox />
                            </Table.Cell>
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                              Apple MacBook Pro 17"
                            </Table.Cell>
                            <Table.Cell>
                              Sliver
                            </Table.Cell>
                            <Table.Cell>
                              Laptop
                            </Table.Cell>
                            <Table.Cell>
                              $2999
                            </Table.Cell>
                            <Table.Cell>
                              <a
                                className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                                href="/tables"
                              >
                                <p>
                                  Edit
                                </p>
                              </a>
                            </Table.Cell>
                          </Table.Row>
                          
                        </Table.Body>
                      </Table>
                      </div>   
                      </div>
                    </>
                </Tabs.Item>
              ) : ''}      
                   
            </Tabs.Group>    
            
        </div>
    )
}