import { TextInput, Button, Alert } from 'flowbite-react';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

const DashProfile = () => {
    const { currentUser } = useSelector(state => state.user);
    const fileRef = useRef();
    const dispatch = useDispatch()
    const [imageFileError, setImageFileError] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [progressValue, setProgress] = useState(0);
    const [formData, setFormData] = useState({});
    const [imageFileUploading, setImageFileUploading] = useState(false)
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
    const [updateUserError, setUpdateUserError] = useState(null)

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        setImageFileUploading(true);
        setImageFileError(null);
        const timeStamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const originalName = file.name.split('.')[0];
        const uniqueFileName = `${timeStamp}_${originalName}.${fileExtension}`;
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'mern_blog_anuraag');
        data.append('cloud_name', 'da44n3eft');
        data.append('folder', 'Mern_Blog');
        data.append('public_id', uniqueFileName);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://api.cloudinary.com/v1_1/da44n3eft/image/upload', true);

        // Handle progress
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const progress = Math.round((event.loaded / event.total) * 100);
                setProgress(progress);
                console.log('Progress:', progress);
            }
        };

        // Handle the response after upload is complete
        xhr.onload = () => {
            if (xhr.status === 200) {
                const uploadedImageUrl = JSON.parse(xhr.responseText);
                setImageFileUrl(uploadedImageUrl.url); // Update the displayed image URL
                setFormData({
                    ...formData,
                    profilePicture: uploadedImageUrl.url,
                });
                setImageFileUploading(false)
                setImageFileError(null);
                console.log(uploadedImageUrl.url);
            } else {
                console.error('Error:', xhr.status, xhr.responseText);
                setImageFileError(xhr.responseText);
                setImageFileUrl(null);
                setImageFileUploading(false)
                setProgress(null);
            }
        };

        // Handle errors
        xhr.onerror = (err) => {
            setImageFileError(err.message);
            setImageFileUrl(null);
            setProgress(null);
            console.error('Upload failed:', err);
        };

        xhr.send(data);
    };

    const handleFormChange = (event) => {
        setFormData({ ...formData, [event.target.id]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        setUpdateUserError(null)
        setUpdateUserSuccess(null)
        if (Object.keys(formData).length === 0) {
            setUpdateUserError('No changes made!')
            return
        }
        if (imageFileUploading) {
            setUpdateUserError('Please wait for image to upload')
            return
        }
        try {
            dispatch(updateStart())
            const response = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const data = await response.json()
            if (!response.ok) {
                setUpdateUserError(data.message)
                dispatch(updateFailure(data.message))
            }
            else {
                dispatch(updateSuccess(data))
                setUpdateUserSuccess("User's Profile updated successfully!")
            }
        }
        catch (err) {
            dispatch(updateFailure(err))
        }
    }
    // console.log(imageFileError, 'imagefileerror')
    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="file" accept="image/*" onChange={handleImageChange} ref={fileRef} hidden />
                <div
                    className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
                    onClick={() => fileRef.current.click()}
                >
                    {/* Progress Bar */}
                    {progressValue && progressValue < 100 && (
                        <CircularProgressbar
                            value={progressValue}
                            text={`${progressValue}%`}
                            strokeWidth={5}
                            styles={{
                                root: {
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                },
                                path: {
                                    stroke: `rgb(62,152,199,${progressValue / 100})`,
                                },
                            }}
                        />
                    )}
                    {/* Profile Image */}
                    <img
                        src={imageFileUrl || currentUser.profilePicture}
                        alt="user"
                        className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${progressValue && progressValue < 100 && 'opacity-60'}`}
                    />
                </div>
                {imageFileError && <Alert color="failure">{imageFileError}</Alert>}
                <TextInput onChange={handleFormChange} type="text" id="username" placeholder="username" defaultValue={currentUser.username} />
                <TextInput onChange={handleFormChange} type="email" id="email" placeholder="email" defaultValue={currentUser.email} />
                <TextInput onChange={handleFormChange} type="password" id="password" placeholder="password" />
                <Button type="submit" gradientDuoTone="purpleToBlue" outline>
                    Update
                </Button>
            </form>
            <div className="text-red-500 flex justify-between mt-5">
                <span className="cursor-pointer">Delete Account</span>
                <span className="cursor-pointer">Sign Out</span>
            </div>
            {updateUserSuccess && (
                <Alert color='success' className='mt-5'>
                    {updateUserSuccess}
                </Alert>
            )}
            {updateUserError && (
                <Alert color='failure' className='mt-5'>
                    {updateUserError}
                </Alert>
            )}
        </div>
    );
};

export default DashProfile;
