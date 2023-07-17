import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ModalComponent(props){
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [editedCommentId, setEditedCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [selectedThread, setSelectedThread] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(props.isModalOpen);
  
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
        });
    } else {
      const newComment = {
        author: props.session.data.user[0].id,
        timestamp: Date.now(),
        text: newCommentText,
        threadId: selectedThread.id,
      };

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
          setNewCommentText('');
        });
    }
  };

  const editThreadTitle = () => {
    if (editedTitle.trim() === '') {
      return;
    }
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
      })
      .catch((error) => {
        console.log('Error updating comment:', error);
      });
  };

    
  const closeModal = () => {
    setSelectedThread(null);
    setIsModalOpen(false);
  };

  const handleDeleteComment = (comment) => {
    fetch(`/api/comments/${comment.id}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updatedThread = { ...selectedThread };
        const updatedComments = updatedThread.comments.filter((c) => c.id !== comment.id);
        updatedThread.comments = updatedComments;
        setSelectedThread(updatedThread);
        props.updateSelectedThread(updatedThread);
        
      })
      .catch((error) => {
        console.log('Error deleting comment:', error);
      });
  };

  useEffect(() => {
    setIsModalOpen(props.isModalOpen);
    setSelectedThread(props.selectedThread);
  }, [props.isModalOpen, props.selectedThread]);
  
    return (
        <Modal
          isOpen={isModalOpen}
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
              <div className="modal-header">
                {isEditingTitle ? (
                  <>
                  
                    <input
                      type="text"
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
                          {console.log(comment)}
                          <Link class="inline-flex hover:underline" href={`/profile/${comment.user.username }`}>
                            <span>by</span>
                            <img className="w-4 h-4 rounded-full ml-1 mt-0.5 mr-1 " src={`/images/${comment.user.picture}`} alt="user photo" />
                            <span className="comment-author font-normal text-xs py-0.5">{comment.user.username}</span>
                          </Link>
                          <span className="comment-timestamp">{timeSince(comment.createdAt)} ago</span>
                          <div>
                            {comment.author === props.session.data.user[0].id && (
                              <>
                                <button
                                  className="text-gray-600 rounded px-1 py-1 ml-2 hover:underline"
                                  onClick={() => handleEditComment(comment)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="text-gray-600 rounded px-1 py-1 hover:underline"
                                  onClick={() => handleDeleteComment(comment)}
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
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