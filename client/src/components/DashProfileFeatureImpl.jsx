import { TextInput, Button } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

const DashProfile = () => {
    const { currentUser } = useSelector(state => state.user)
    const fileRef = useRef()
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [progress, setProgress] = useState(0);
    const [uploaded, setUploaded] = useState(false);
    const handleImageChange = async (e) => {
        const file = e.target.files[0]
        if (!file) {
            return
        }
        const timeStamp = Date.now()
        const filExtension = file.name.split('.').pop();
        const originalName = file.name.split('.')[0]
        const uniqueFileName = `${timeStamp}_${originalName}.${filExtension}`
        const data = new FormData()
        data.append('file', file)
        data.append('upload_preset', 'mern_blog_anuraag')
        data.append('cloud_name', 'da44n3eft')
        data.append('folder', 'Mern_Blog')
        data.append('public_id', uniqueFileName)
        console.log(progress)
        const config = {
            onUploadProgress: (event) => {
                const { loaded, total } = event
                setProgress((loaded / total) * 100)
                console.log(loaded, total)
            }
        }

        try {
            const res = await fetch('https://api.cloudinary.com/v1_1/da44n3eft/image/upload',
                {
                    method: 'POST',
                    body: data
                },
                config
            )
            const uploadedImageUrl = await res.json()
            console.log(uploadedImageUrl.url)
        }
        catch (err) {
            console.log(err, 'error')
        }
    }
    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form className='flex flex-col gap-4' action="">
                <input type="file" accept='image/*' onChange={handleImageChange} ref={fileRef} hidden />
                <div className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => {
                    fileRef.current.click()
                }}>
                    {/* imageFileUrl indicates updated image upload */}
                    <img src={imageFileUrl || currentUser.profilePicture} alt="user" className='rounded-full w-full h-full object-cover border-8 border-[lightgray]' />
                </div>
                <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} />
                <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} />
                <TextInput type='password' id='password' placeholder='password' />
                <Button type='submit' gradientDuoTone='purpleToBlue' outline>
                    Update
                </Button>
                {uploaded ? <p>
                    uploaded
                </p> : <p>
                    {progress}%</p>}
            </form>
            <div className='text-red-500 flex justify-between mt-5'>
                <span className='cursor-pointer'>Delete Account</span>
                <span className='cursor-pointer'>Sign Out</span>
            </div>
        </div>
    )
}

export default DashProfile