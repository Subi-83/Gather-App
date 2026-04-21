import { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets.js'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'


const RightSidebar = () => {
  const {selectedUser,messages} = useContext(ChatContext)
  const {logout,onlineUsers} = useContext(AuthContext)
  const [msgImages,setMsgImages] = useState([])

  // Get all the images from the messages
  useEffect(()=>{
      setMsgImages(
          messages.filter(msg => msg.image).map(msg=>msg.image)
      )
  },[messages])


  return selectedUser && (
    <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll  ${selectedUser ? "max-md:hidden" : ""}` }>
        <div className='pt-10 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
          <img src={selectedUser?.profilePic || assets.avatar_icon} alt={selectedUser?.name} className='w-20 aspect-square rounded-full'/>

        <h1 className='px-6 text-xl font-medium mx-auto flex items-center gap-2'>
          {onlineUsers?.includes(selectedUser?._id) && (
                <p className='w-2 h-2 rounded-full bg-green-500'></p>
            )}
            {selectedUser?.fullName}
          </h1>
          <p className='px-2 mx-auto '>{selectedUser?.bio}</p>

        </div>

        <hr className='border-[#ffffff50] my-4'/>
        
        <div className="px-5">
            <p>Media</p> 
                <div className='mt-2 max-h-50 overflow-y-auto scrollbar-thin scrollbar-thumb-violet-500 scrollbar-track-transparent grid grid-cols-2 gap-4 opacity-80'>
                 {msgImages.map((url,index)=>(
                  <div key={index} onClick={()=>window.open(url, '_blank', 'noopener,noreferrer')}
                    className='cursor-pointer rounded'>
                      <img src={url} alt="" className='h-full rounded-md'/>
                      
                    </div>
                 ))}
            </div> 
        </div>
        <button onClick={()=>logout()} className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-linear-to-r from-[#1b34c3] via-[#3e56db] to-[#161c3f] text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer opacity-100 hover:opacity-80">
          Logout
        </button>

    </div>
  )
}

export default RightSidebar