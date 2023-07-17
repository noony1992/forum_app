import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useSession } from 'next-auth/react';
import Router from 'next/router';
import Link from 'next/link';
import ModalComponent from '/components/ModalComponent';

export default function Home() {
  const session = useSession();

  const [threads, setThreads] = useState([]);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [selectedThread, setSelectedThread] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
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
    fetch('/api/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newThreadTitle, author: session.data.user[0].id, createdAt: Date.now() }),
    })
      .then((response) => response.json())
      .then((data) => {
        const newThread = {
          id: data.newThreadId.id,
          title: data.newThreadId.title,
          createdAt: data.newThreadId.createdAt,
          username: data.newThreadId.user.username,
          picture: data.newThreadId.user.picture,
          comments: [],
        };
        setThreads((prevThreads) => [...prevThreads, newThread]);
        setNewThreadTitle('');
        openModal(newThread)
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
        {/* Thread list */}
        
          <ul className="container max-w-5xl mx-auto px-4 py-8 divide-y divide-gray-200">
            <div class="inline-flex w-full">
          <input
              type="text"
              placeholder="Enter thread title"
              className="border border-gray-300 rounded px-4 py-2 w-full mb-2"
              value={newThreadTitle}
              onChange={(e) => setNewThreadTitle(e.target.value)}
            />
            <button
              className="whitespace-nowrap focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 ml-2 float-right"
              onClick={createThread}
            >
              Create Thread
            </button>
            </div>
            <h2 className="text-2xl font-bold mb-2">Threads</h2>
            {isLoading ? ( // Render loading icon while isLoading is true
          <div>Loading...</div>
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
          isModalOpen={isModalOpen} 
          selectedThread={selectedThread} 
          session={session}
          threads={threads}
          updateSelectedThread={updateSelectedThread}
        />
      </div>
    </div>
  );
}
