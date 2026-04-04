import React, { useRef, useEffect, useState } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessgaeTime } from '../lib/utils'
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { ChatContext } from '../context/ChatContext.jsx';
import toast from 'react-hot-toast';

const ChatContainer = () => {


  const{messages, selectedUser, setSelectedUser, sendMessage, getMessages} = useContext(ChatContext);
  const{authUser, onlineUsers} = useContext(AuthContext);
  const [input, setInput] = useState("");
  const scrollEnd = useRef();
  
  // function to handle sending message on enter key press
  const handleSendMessage = async (e) => {
    if(input.trim() === "") return;
    await sendMessage({text: input.trim()});  
    setInput("");
  }

  // Handle sending a image message
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    if(!file.type.startsWith("image/")){
      toast.error("Please select an image file");
      return ;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      await sendMessage({image: reader.result});
      e.target.value = "";
    } 
    reader.readAsDataURL(file);
  }

  useEffect(()=>{
    if(selectedUser){
      getMessages(selectedUser._id);
    }
  },[selectedUser]);


  useEffect(() => {
    if(scrollEnd.current &&messages){
      scrollEnd.current.scrollIntoView({behavior: "smooth"});
    }
  }, [messages]);


  return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>

      {/* Header */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="profile" className='w-8 rounded-full'/>

        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          {selectedUser?.fullName}
          {onlineUsers?.includes(selectedUser._id) 
            ? <span className='w-2 h-2 rounded-full bg-green-500'></span>
            : <span className='w-2 h-2 rounded-full bg-gray-500'></span>
          }
        </p>
        <img src={assets.help_icon} alt="" className='max-h-5 cursor-pointer' />

        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className='md:hidden max-w-7 cursor-pointer'
        />
      </div>

      {/* Chat Area */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
        {messages.map((message, index) => (
          <div
            key={message._id || index}
            className={`flex items-end gap-2 justify-end ${
              message.senderId !== authUser._id && 'flex-row-reverse'
            }`}
          >
            {message.image ? (
              <img src={message.image} alt="message" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8'/>
            ) : (
              <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-[#29bdc4]/30  text-white ${
                message.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'
              }`}>
                {message.content}
              </p>
            )}
            <div className="text-center text-xs">
              <img className='w-7 rounded-full' src={message.senderId === authUser._id ? authUser?.profilePic|| assets.avatar_icon :  selectedUser?.profilePic || assets.avatar_icon} alt="" />
              <p className='text-gray-500'>{formatMessgaeTime(message.createdAt)}</p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>
      {/* Bottom Area*/}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
          <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
            <input onChange={(e)=> setInput(e.target.value)} value={input} onKeyDown={(e)=> e.key === "Enter" ? handleSendMessage(e) : null} type="text" placeholder='Send a message' className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400' />
            <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpg' hidden />
            <label htmlFor="image">
              <img src={assets.gallery_icon} alt="Gallery" className='w-5 mr-2 cursor-pointer' />
            </label>
          </div>
          <img src={assets.send} onClick={handleSendMessage} alt="Send" className='w-7 cursor-pointer' />
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-mid:hidden'>
      <img onClick={handleSendMessage} src={assets.icon_logo} alt="" className='max-w-30' />
      <p className='text-lg font-medium text-white'>Chat Anytime, anywhere</p>
    </div>
  )
}

export default ChatContainer
