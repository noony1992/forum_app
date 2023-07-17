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

const Profile = ({ dirs }) => {
  const router = useRouter()
  const profileUsername = router.query;
  const session = useSession();
  
  const [profile, setProfile] = useState([]);
  const [uploading, setUploading] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")
  const [selectedFile, setSelectedFile] = useState()
  const profilePicture = '/images/' + profile[0]?.picture;

  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');



  useEffect(() => {
    if(!profileUsername.profileid) {
      return;
    }
      fetch(`/api/profile/${profileUsername.profileid}`)
        .then((response) => response.json())
        .then((data) => setProfile(data));
  }, [profileUsername.profileid, selectedThread]); 


const openModal = (thread) => {
  setSelectedThread(thread);
  setEditedTitle(thread.title);
  setIsModalOpen(true);
};

  const handleUpload = async () => {
    setUploading(true)
    try {
      if (!selectedFile) return
      const formData = new FormData()
      formData.append("myImage", selectedFile)
      formData.append("userid", profile[0]?.id)
      const { data } = await axios.post("/api/image/", formData)
    } catch (error) {
      console.log(error.response?.data)
    }
    setUploading(false)
  }

  const updateSelectedThread = (updatedThread) => {
    setSelectedThread(updatedThread);
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
    <>
    
      <div class="container flex max-w-5xl mx-auto px-4 py-8">
        {profile[0] && (
          <>
          <div class="w-2/3 h-full">
            <div class="min-w-0 h-max break-words bg-white w-full mb-6 shadow-xl rounded-lg">        
            <Tabs.Group
              aria-label="Tabs with underline"
              style="underline"
            >
              <Tabs.Item
                active
                icon={HiUserCircle}
                title="Threads"
              >
                <ul className="container max-w-5xl mx-auto px-2 py-1 divide-y divide-gray-200">     
                  {profile[0].threads.map((thread) => (        
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
                              <img className="w-5 h-5 rounded-full ml-1 mr-1" src={`/images/${thread.picture ? thread.picture : thread.user.picture}`} alt="user photo" />
                              {thread.user.username }
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
            </ul>
              </Tabs.Item>
              <Tabs.Item
                icon={MdDashboard}
                title="Comments"
              >
                <ul className="container max-w-5xl mx-auto px-2 py-1 divide-y divide-gray-200">
                  {profile[0].comments.map((thread) => (        
                  thread && (         
                    <li key={thread.id} className="py-2">
                      
                      <button
                        className="flex items-center space-x-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none px-4 py-2 w-full"
                        onClick={() => openModal(thread.thread)}
                      >
                        <div className="flex-grow">
                          <h3 className="text-xl font-semibold">
                            <span class="text-sm font-normal">You Posted in</span> {thread.thread.title}<span class="text-sm font-normal">:</span>
                            <div class="container profile-comment-container" >
                              {thread.text}
                            </div>
                            <h5 className="text-sm italic font-normal text-gray-500 float-right py-1">
                              {timeSince(thread.createdAt)} ago
                            </h5>
                          </h3>
                          
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
            </ul>
              </Tabs.Item>
              
            </Tabs.Group>    
          
            </div>
          </div>
          <div class="w-1/3 px-4 ">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg pt-5">
              <div class="px-6">
                <div class="flex flex-wrap justify-center">
                  <div class="w-full px-4 flex justify-center">
                    <div class="relative">
                      {/* <img alt="..." src="https://demos.creative-tim.com/notus-js/assets/img/team-2-800x800.jpg" class="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px" /> */}
                      <img src={profilePicture} class="shadow-xl rounded-full h-auto align-middle border-none max-w-125" alt="Girl in a jacket" width="500" height="600"></img>
                    </div>
                  </div>
                  <div class="w-full px-4 text-center mt-5">
                    <div class="flex justify-center py-4 lg:pt-4 pt-8">
                      <div class="mr-4 p-3 text-center">
                        <span class="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                        {profile[0].threads.length}
                        </span>
                        <span class="text-sm text-blueGray-400">Threads</span>
                      </div>
                      <div class="mr-4 p-3 text-center">
                        <span class="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                        {profile[0].comments.length}
                        </span>
                        <span class="text-sm text-blueGray-400">Comments</span>
                      </div>
                      <div class="lg:mr-4 p-3 text-center">
                        <span class="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          ?
                        </span>
                        <span class="text-sm text-blueGray-400">Rep</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="text-center mt-12">
                  
                <label>
                  <input
                    type="file"
                    hidden
                    onChange={({ target }) => {
                      if (target.files) {
                        const file = target.files[0]
                        setSelectedImage(URL.createObjectURL(file))
                        setSelectedFile(file)
                      }
                    }}
                  />
                  <div className="w-40 aspect-video rounded flex items-center justify-center border-2 border-dashed cursor-pointer">
                    {selectedImage ? (
                      <img src={selectedImage} alt="" />
                    ) : (
                      <span>Select Image</span>
                    )}
                  </div>
                </label>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  style={{ opacity: uploading ? ".5" : "1" }}
                  className="bg-red-600 p-3 w-32 text-center rounded text-white"
                >
                  {uploading ? "Uploading.." : "Upload"}
                </button>
                
                  {/* <Link key={item} href={"/images/" + item}>
                    <p className="text-blue-500 hover:underline">{item}</p>
                  </Link>     */}
                  
                  <div class="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                    <i class="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                    {profile[0].username}
                  </div>
                  <div class="mb-2 text-blueGray-600 mt-10">
                    <i class="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
                    Solution Manager - Creative Tim Officer
                  </div>
                  <div class="mb-2 text-blueGray-600">
                    <i class="fas fa-university mr-2 text-lg text-blueGray-400"></i>
                    University of Computer Science
                  </div>
                </div>
                <div class="mt-10 py-10 border-t border-blueGray-200 text-center">
                  <div class="flex flex-wrap justify-center">
                    <div class="w-full lg:w-9/12 px-4">
                      <p class="mb-4 text-lg leading-relaxed text-blueGray-700">
                        An artist of considerable range, Jenna the name taken
                        by Melbourne-raised, Brooklyn-based Nick Murphy
                        writes, performs and records all of his own music,
                        giving it a warm, intimate feel with a solid groove
                        structure. An artist of considerable range.
                      </p>
                      <a href="javascript:void(0);" class="font-normal text-pink-500">
                        Show more
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ModalComponent 
            isModalOpen={isModalOpen} 
            selectedThread={selectedThread} 
            session={session}
            threads={profile[0].threads}
            updateSelectedThread={updateSelectedThread}
          />     
          </>
          
        )}
        
      </div>

        
    </>   
  );
}

export const getServerSideProps = async () => {
  const props = { dirs: [] }
  try {
    const dirs = await fs.readdir(path.join(process.cwd(), "/public/images"))
    props.dirs = dirs
    return { props }
  } catch (error) {
    return { props }
  }
}

export default Profile;