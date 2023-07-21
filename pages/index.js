import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Router from 'next/router';
import ModalComponent from '/components/ModalComponent';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'flowbite';
import 'animate.css';

export default function Home() {
  const session = useSession();

  const [threads, setThreads] = useState([]);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [selectedThread, setSelectedThread] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [newThreadBodyText, setNewThreadBodyText] = useState('');
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  
  useEffect(() => {
    fetch('/api/threads')
      .then((response) => response.json())
      .then((data) => {
        setThreads(data)
        setIsLoading(false);
      });
  }, [selectedThread]);

  const updateSelectedThread = (updatedThread) => {
    setSelectedThread(updatedThread);
  };

  const createThread = () => {
    toast.info("Creating thread...", {containerId: 'A'})
    fetch('/api/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newThreadTitle, bodyText: newThreadBodyText, author: session.data.user[0].id, createdAt: Date.now() }),
    })
      .then((response) => response.json())
      .then((data) => {
        const newThread = {
          id: data.newThreadId.id,
          title: data.newThreadId.title,
          bodyText: data.newThreadId.bodyText,
          createdAt: data.newThreadId.createdAt,
          username: data.newThreadId.user.username,
          picture: data.newThreadId.user.picture,
          comments: [],
        };
        setThreads((prevThreads) => [...prevThreads, newThread]);
        setNewThreadTitle('');
        setNewThreadBodyText('');
        toast.success("Thread created!", {containerId: 'A'})
        openModal(newThread)
      }).catch((error) => {
        console.log('Error deleting thread:', error);
        toast.error("There was a issue trying to create this thread, please try again later.", {containerId: 'A'});
      });
  };

  const openModal = (thread) => {
    setSelectedThread(thread);
    setEditedTitle(thread.title);
    setIsModalOpen(true);
  };

  function timeSince(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + ' years';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + ' months';
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + ' days';
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + ' hours';
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + ' minutes';
    }
    return Math.floor(seconds) + ' seconds';
  }

  return (
    <div className="">
      <div>
          <ToastContainer 
              enableMultiContainer containerId={'A'}
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
        
        {/* Thread list */}
        
          <ul className="container max-w-5xl mx-auto px-4 py-8 divide-y divide-gray-200">
            <div class="inline-flex w-full mb-2">
              <input
                  type="text"
                  placeholder="Enter thread title"
                  className="border border-r-0 border-gray-300 rounded-l px-4 py-2 w-full z-40"
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                  onFocus={() => setIsTitleFocused(true)}
                  onBlur={() => setIsTitleFocused(false)}
                />
                  <label for="search-dropdown" class="mb-2 text-sm font-medium text-gray-600 sr-only dark:text-white">Your Email</label>
                        <button id="dropdown-button" data-dropdown-toggle="dropdown" class="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-200 border border-gray-300 rounded-r-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 " type="button">Choose Category <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                  </svg></button>
                  <div id="dropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
                      <li>
                          <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">News</a>
                      </li>
                      <li>
                          <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Technology</a>
                      </li>
                      <li>
                          <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sports</a>
                      </li>
                      <li>
                          <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Finance</a>
                      </li>
                      </ul>
                  </div>
                <button
                  className="whitespace-nowrap focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-green-500 dark:hover:bg-green-700 dark:focus:ring-green-800 ml-2 float-right z-40"
                  onClick={createThread}
                >
                  Create Thread
                </button>
                
            </div>
            {isTitleFocused || newThreadTitle.trim().length > 0 ? (
              <div class="w-full">
                <textarea
                      type="text"
                      placeholder="Enter thread text"
                      className="threadBodyText border border-gray-300 rounded-l px-4 py-2 w-full animate__animated animate__slideInDown animate__faster -z-40"
                      value={newThreadBodyText}
                      onChange={(e) => setNewThreadBodyText(e.target.value)}
                    />
              </div>
            ) : null}
            <h2 className="text-2xl font-bold mb-2">Threads</h2>
          {isLoading ? ( // Render loading icon while isLoading is true
            <div class="text-center pt-2">
                <svg aria-hidden="true" class="inline w-10 h-10 mr-2 text-gray-200 animate-spin fill-blue-600 " viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span class="sr-only">Loading...</span>
            </div>
            ) : (
              <>
            {threads.map((thread) => (        
              thread && (         
                <li key={thread.id} className="py-2">
                  <button
                    className="flex items-center space-x-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none px-4 py-2 w-full"
                    onClick={() => openModal(thread)}
                  >
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold">
                        {thread.title}{' '}
                        <h5 className="text-sm italic font-normal text-gray-500 float-right py-1">
                          {timeSince(thread.createdAt)} ago
                        </h5>
                      </h3>
                      <button
                        className="z-999 hover:bg-gray-200 rounded p-0.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          Router.push(`/profile/${thread.user.username}`);
                        }}
                      >
                        <h5 className="text-sm italic text-gray-500 inline-flex">
                          by
                          <img className="w-5 h-5 rounded-full ml-1 mr-1" src={`images/${thread.picture ? thread.picture : thread.user.picture}`} alt="user photo" />
                          {thread.username ? thread.username : thread.user.username}
                        </h5>
                      </button>
                      <h5 className="text-sm text-gray-500">{thread.comments ? thread.comments.length : 0} Comments</h5>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-9H9V6h2v3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
              )
            ))}
            </>
            )}
            
          </ul>
        
        {/* Modal */}
        <ModalComponent 
          isOpen={isModalOpen}
          selectedThread={selectedThread} 
          session={session}
          threads={threads}
          updateSelectedThread={updateSelectedThread}
          closeModal={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}
