import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { app } from '../firebase';
import { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const [imageUrl, setImageFileUrl] = useState()
    const navigate = useNavigate();

    const handleImageChange = async (e) => {
        if (!file) {
            setImageUploadError('Please select an image')
            return;
        }
        setImageUploadError(null);
        const timeStamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const originalName = file.name.split('.')[0];
        const uniqueFileName = `${timeStamp}_${originalName}.${fileExtension}`;
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'mern_blog_anuraag');
        data.append('cloud_name', 'da44n3eft');
        data.append('folder', 'Create_Post');
        data.append('public_id', uniqueFileName);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://api.cloudinary.com/v1_1/da44n3eft/image/upload', true);

        // Handle progress
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const progress = Math.round((event.loaded / event.total) * 100);
                setImageUploadProgress(progress);
            }
        };

        // Handle the response after upload is complete
        xhr.onload = () => {
            if (xhr.status === 200) {
                const uploadedImageUrl = JSON.parse(xhr.responseText);
                setImageFileUrl(uploadedImageUrl.url); // Update the displayed image URL
                setFormData({ ...formData, image: uploadedImageUrl.url, });
                setImageUploadError(null);
                setImageUploadProgress(null);
            } else {
                console.error('Error:', xhr.status, xhr.responseText);
                setImageUploadError(xhr.responseText);
                setImageFileUrl(null);
                setImageUploadProgress(null);
            }
        };

        // Handle errors
        xhr.onerror = (err) => {
            setImageUploadError(err.message);
            setImageFileUrl(null);
            setImageUploadProgress(null);
            console.error('Upload failed:', err);
        };

        xhr.send(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/post/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
                return;
            }

            if (res.ok) {
                setPublishError(null);
                console.log('data saved')
                // navigate(`/post/${data.slug}`);
            }
        } catch (error) {
            setPublishError('Something went wrong');
        }
    };
    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                    <TextInput
                        type='text'
                        placeholder='Title'
                        required
                        id='title'
                        className='flex-1'
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                    />
                    <Select
                        onChange={(e) =>
                            setFormData({ ...formData, category: e.target.value })
                        }
                    >
                        <option value='uncategorized'>Select a category</option>
                        <option value='javascript'>JavaScript</option>
                        <option value='reactjs'>React.js</option>
                        <option value='nextjs'>Next.js</option>
                    </Select>
                </div>
                <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                    <FileInput
                        type='file'
                        accept='image/*'
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <Button
                        type='button'
                        gradientDuoTone='purpleToBlue'
                        size='sm'
                        outline
                        onClick={handleImageChange}
                        disabled={imageUploadProgress}
                    >
                        {imageUploadProgress ? (
                            <div className='w-16 h-16'>
                                <CircularProgressbar
                                    value={imageUploadProgress}
                                    text={`${imageUploadProgress || 0}%`}
                                />
                            </div>
                        ) : (
                            'Upload Image'
                        )}
                    </Button>
                </div>
                {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
                {formData.image && (
                    <img
                        src={imageUrl}
                        alt='upload'
                        className='w-full h-72 object-cover'
                    />
                )}
                <ReactQuill
                    theme='snow'
                    placeholder='Write something...'
                    className='h-72 mb-12'
                    required
                    onChange={(value) => {
                        setFormData({ ...formData, content: value });
                    }}
                />
                <Button type='submit' gradientDuoTone='purpleToPink'>
                    Publish
                </Button>
                {publishError && (
                    <Alert className='mt-5' color='failure'>
                        {publishError}
                    </Alert>
                )}
            </form>
        </div>
    );
}

export default CreatePost;
