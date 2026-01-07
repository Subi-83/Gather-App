import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets.js'

const ProfilePage = () => {

  const [selectedImg, setSelectedImg] = useState(null)
  const [name, setName] = useState('Martin Johnson')
  const [bio, setBio] = useState('Hi Everyone! I want to Gather here ')
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">

      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-200 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">

        <form className="flex flex-col gap-5 p-10 flex-1" onSubmit={handleSubmit}>

          <h3 className="text-lg text-white">Profile Details</h3>

          {/* Profile Image Upload */}
          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
            <input
              id="avatar"
              type="file"
              accept=".png, .jpg, .jpeg"
              hidden
              onChange={(e) => setSelectedImg(e.target.files[0])}
            />

            <img
              src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover"
            />

            <span>Upload Profile Image</span>
          </label>

          <input onChange={(e)=>setName(e.target.value)} value={name} type="text" name="Your name" id="" className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'/>

          <textarea onChange={(e)=>setBio(e.target.value)} value={bio} name="bio" id="" placeholder='Write profile bio ' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500  resize-none' rows={4}></textarea>

          <button type='submit' className=' bg-linear-to-r from-blue-400 to-blue-700 hover:from-blue-500 hover:to-blue-800 transition-all duration-300 text-white p-2 rounded-full text-lg cursor-pointer'>
            Save Profile 
          </button>

        </form>
        <img className='max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10' src={assets.icon_logo} alt="Logo" />
      </div>
    </div>
  )
}

export default ProfilePage
