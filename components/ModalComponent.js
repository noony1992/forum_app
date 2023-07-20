import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ModalComponent(props){
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [editedCommentId, setEditedCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [selectedThread, setSelectedThread] = useState(null);
  // const [isModalOpen, setIsModalOpen] = useState(props.isModalOpen);
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [replyingToCommentText, setReplyingToCommentText] = useState(null);
  
  const [threads, setThreads] = useState([]);
   
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

  const createComment = () => {
    if (isEditingComment) {
      const editedComment = {
        id: editedCommentId,
        text: editedCommentText,
        threadId: selectedThread.id,
      };
      toast.info("Posting Comment...", {containerId: 'B'});
      fetch(`/api/comments`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedComment),
      })
        .then((response) => response.json())
        .then((data) => {
          const updatedThread = { ...selectedThread };
          const updatedComments = updatedThread.comments.map((comment) =>
            comment.id === data.id ? { ...comment, text: data.text } : comment
          );
          updatedThread.comments = updatedComments;
          setSelectedThread(updatedThread);
          props.updateSelectedThread(updatedThread);
          setEditedCommentId(null);
          setEditedCommentText('');
          setIsEditingComment(false);
          toast.success("Comment Posted!", {containerId: 'B'});
        })
        .catch((error) => {
          console.error('Error posting comment:', error);
          toast.error("Error posting comment. Please try again later.", {containerId: 'B'});
        });
    } else if (replyingToCommentId) {
       // Code for replying to a comment
    const newReply = {
      author: props.session.data.user[0].id,
      timestamp: Date.now(),
      text: replyingToCommentText,
      threadId: selectedThread.id,
      parentId: replyingToCommentId, // Add parentId to specify the parent comment ID
    };
    toast.info("Posting Comment Reply...", { containerId: 'B' });
    fetch(`/api/comments/replies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newReply),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedThread = { ...selectedThread };
        const commentReplies = updatedThread.comments.find(
          (comment) => comment.id === replyingToCommentId
        ).commentReplies;
        updatedThread.comments = updatedThread.comments.map((comment) => {
          if (comment.id === replyingToCommentId) {
            return { ...comment, commentReplies: [...commentReplies, data] };
          }
          return comment;
        });
        props.updateSelectedThread(updatedThread);
        setReplyingToCommentId('') 
        toast.success("Comment Posted!", {containerId: 'B'});
      })
      .catch((error) => {
        console.error('Error posting comment:', error);
        toast.error('Error posting comment. Please try again later.', {
          containerId: 'B',
        });
      });
    } else {
      const newComment = {
        author: props.session.data.user[0].id,
        timestamp: Date.now(),
        text: newCommentText,
        threadId: selectedThread.id,
        commentReplies: []
      };
      toast.info("Posting Comment...", {containerId: 'B'});
      fetch(`/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment),
      })
        .then((response) => response.json())
        .then((data) => {
          const updatedThread = { ...selectedThread };
          updatedThread.comments.push(data);
          setSelectedThread(updatedThread);
          console.log(updatedThread)
          props.updateSelectedThread(updatedThread);
          setNewCommentText('');
          toast.success("Comment Posted!", {containerId: 'B'});
        })
        .catch((error) => {
          console.error('Error posting comment:', error);
          toast.error("Error posting comment. Please try again later.", {containerId: 'B'});
        });
    }
  };

  const editThreadTitle = () => {
    if (editedTitle.trim() === '') {
      return;
    }
    toast.info("Editing title...", {containerId: 'B'});
    fetch(`/api/threads`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: editedTitle, threadid: selectedThread.id }),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedThread = { ...selectedThread, title: data.title };
        const updatedThreads = props.threads.map((thread) =>
          thread.id === updatedThread.id ? updatedThread : thread
        );
        setThreads(updatedThreads);
        props.updateSelectedThread(updatedThread);
        setSelectedThread(updatedThread);
        setIsEditingTitle(false);
        setEditedTitle('');
        toast.success("Edited title successfully!", {containerId: 'B'});
      })
      .catch((error) => {
        console.error('Error editing title', error);
        toast.error("Error editing title. Please try again later.", {containerId: 'B'});
      });
  };

  const handleEditComment = (comment) => {
    setEditedCommentId(comment.id);
    setEditedCommentText(comment.text);
    setIsEditingComment(true);
  };

  const handleSaveComment = () => {
    if (editedCommentText.trim() === '') {
      return;
    }
    toast.info("Saving comment...", {containerId: 'B'})
    const editedComment = {
      id: editedCommentId,
      text: editedCommentText,
      threadId: selectedThread.id,
    };

    fetch(`/api/comments`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedComment),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedThread = { ...selectedThread };
        const updatedComments = updatedThread.comments.map((comment) =>
          comment.id === data.id ? { ...comment, text: data.text } : comment
        );
        updatedThread.comments = updatedComments;
        setSelectedThread(updatedThread);
        props.updateSelectedThread(updatedThread);
        setEditedCommentId(null);
        setEditedCommentText('');
        setIsEditingComment(false);
        toast.success("Comment saved successfully!", {containerId: 'B'})
      })
      .catch((error) => {
        console.log('Error updating comment:', error);
        toast.error("Error updating comment. Please try again later.", {containerId: 'B'})
      });
  };

    
  const closeModal = () => {
    // setSelectedThread(null);
    setEditedCommentId(null);
    setEditedCommentText('');
    // setIsModalOpen(false);
    props.closeModal();
  };

  const handleDeleteComment = (comment) => {
    toast.info('Deleting Comment...', {containerId: 'B'});
    fetch(`/api/comments/${comment.id}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updatedThread = { ...selectedThread };
        const updatedComments = updatedThread.comments.filter((c) => c.id !== comment.id);
        updatedThread.comments = updatedComments;
        setSelectedThread(updatedThread);
        props.updateSelectedThread(updatedThread);
        toast.success('Comment Deleted!', {containerId: 'B'});
        
      })
      .catch((error) => {
        console.log('Error deleting comment:', error);
        toast.error('There was a issue trying to delete this comment, please try again later.', {containerId: 'B'});
      });
  };

  const handleReplyComment = (comment) => {
    setReplyingToCommentId(comment.id);
  };

  useEffect(() => {
    // setIsModalOpen(props.isModalOpen);
    setSelectedThread(props.selectedThread);
  }, [props.isModalOpen, props.selectedThread]);
  
    return (
        <Modal
          isOpen={props.isOpen}
          onRequestClose={closeModal}
          contentLabel="Thread Modal"
          className="modal"
          overlayClassName="overlay"
          style={{
            overlay: {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            },
            content: {
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: '90%',
              width: '85%', // Adjust the width as needed
              maxHeight: '90%',
              height: '85%', // Adjust the height as needed
              padding: '2rem',
              borderRadius: '4px',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              overflow: 'auto',
            },
          }}
        >

          {props.selectedThread && (
            <div className="modal-content">
                <ToastContainer 
                  enableMultiContainer containerId={'B'}
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

              <div className="modal-header">
                {isEditingTitle ? (
                  <>
                  
                    <input
                      type="text"
                      placeholder="Enter new title"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                    />
                    <button
                      className="text-sm font-normal text-gray-600 rounded px-2 py-1 hover:underline"
                      onClick={editThreadTitle}
                    >
                      Save
                    </button>
                    <button
                      className="text-sm font-normal text-gray-600 rounded px-2 py-1 hover:underline"
                      onClick={() => setIsEditingTitle(false)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <h3 className="text-2xl font-bold">
                    {props.selectedThread.title}
                    <>
                      <button
                        className="text-sm font-normal text-gray-600 rounded px-2 py-1 hover:underline"
                        onClick={() => setIsEditingTitle(true)}
                      >
                        Edit Title
                      </button>
                    </>
                  </h3>
                )}
                <button className="modal-close" onClick={closeModal}>
                  X
                </button>
              </div>
              <div className="modal-body">
                {props.selectedThread.comments.map((comment) => (
                  <div key={comment.id} className="comment border-b">
                    {isEditingComment && editedCommentId === comment.id ? (
                      <div>
                        <textarea
                          type="text"
                          placeholder="Enter your comment"
                          className="border border-gray-300 rounded px-4 py-2 w-full mb-2"
                          value={editedCommentText}
                          onChange={(e) => setEditedCommentText(e.target.value)}
                        />
                        <button
                          className="text-gray-600 rounded px-2 py-1 float-right mr-2 hover:underline"
                          onClick={handleSaveComment}
                        >
                          Save
                        </button>
                        <button
                          className="text-gray-600 rounded px-2 py-1 float-right hover:underline"
                          onClick={() => setIsEditingComment(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="comment-text">{comment.text}</p>
                        <div className="comment-footer">
                          <Link class="inline-flex hover:underline" href={`/profile/${comment.user.username }`}>
                            <span>by</span>
                            <img className="w-4 h-4 rounded-full ml-1 mt-0.5 mr-1 " src={`/images/${comment.user.picture}`} alt="user photo" />
                            <span className="comment-author font-normal text-xs py-0.5">{comment.user.username}</span>
                          </Link>
                          <span className="comment-timestamp">{timeSince(comment.createdAt)} ago</span>
                          <div>
                          {replyingToCommentId === comment.id && (
                                <div>
                                  <textarea
                                    type="text"
                                    placeholder="Enter your reply"
                                    className="border border-gray-300 rounded px-4 py-2 w-full mb-2"
                                    value={replyingToCommentText}
                                    onChange={(e) => setReplyingToCommentText(e.target.value)}
                                  />
                                  <button
                                    className="bg-blue-500 text-white rounded px-4 py-2 float-right"
                                    onClick={createComment}
                                  >
                                    Post Reply
                                  </button>
                                  <button
                                  className="text-gray-600 rounded px-1 py-1 ml-2 hover:underline"
                                  onClick={() =>  setReplyingToCommentId(null)}
                                >
                                  Cancel
                                </button>
                                </div>
                              )}
                              {!replyingToCommentId && (
                                <button
                                  className="text-gray-600 rounded px-1 py-1 ml-2 hover:underline"
                                  onClick={() => handleReplyComment(comment)}
                                >
                                  Reply
                                </button>
                              )}
                            {comment.author === props.session.data.user[0].id && (
                              <>
                                <button
                                  className="text-gray-600 rounded px-1 py-1 ml-1 hover:underline"
                                  onClick={() =>                                  
                                    handleEditComment(comment)
                                  }
                                >
                                  Edit
                                </button>
                                <button
                                  className="text-gray-600 rounded px-1 py-1 hover:underline"
                                  onClick={() => {
                                    handleDeleteComment(comment)
                                  }}
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        <div class="commentReply ml-3 ">                       
                        {Array.isArray(comment.commentReplies) &&
                            comment.commentReplies.map((commentReplies, index) => (               
                             <div key={commentReplies.id} className="border-b border-l pl-3 block pt-3 pb-1">
                                <span>{commentReplies.text}</span>
                                <div className="">
                                {commentReplies.user && (
                                  <Link class="inline-flex hover:underline" href={`/profile/${commentReplies.user.username }`}>
                                    {console.log(commentReplies)}
                                    <span className="comment-author font-normal text-xs py-0.5">by</span>
                                    <img className="w-4 h-4 rounded-full ml-1 mt-0.5 mr-1 " src={`/images/${commentReplies.user.picture}`} alt="user photo" />
                                    <span className="comment-author font-normal text-xs py-0.5">{commentReplies.user.username}</span>       
                                  </Link>
                                )}
                                    <span className="font-normal text-xs py-0.5 text-gray-500 ml-1">{timeSince(commentReplies.createdAt)} ago</span>
                                </div>
                             </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                {!isEditingComment && (
                  <>
                    <textarea
                      type="text"
                      placeholder="Enter your comment"
                      className="border border-gray-300 rounded px-4 py-2 w-full mb-2"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                    />
                    <button
                      className="bg-blue-500 text-white rounded px-4 py-2 float-right "
                      onClick={createComment}
                    >
                      Post Comment
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </Modal>
    )
}