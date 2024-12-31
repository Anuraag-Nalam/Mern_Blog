import { Alert, Button, Textarea, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Comment from './Comment'

const CommentSection = ({ postId }) => {
    const { currentUser } = useSelector((state) => state.user)
    const [comments, setComments] = useState([])
    const [commentError, setCommentError] = useState(null)
    const [allComments, setAllComments] = useState([])
    // console.log(allComments)
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (comments.length > 200) {
            return
        }
        try {
            const res = await fetch('/api/comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: comments,
                    postId,
                    userId: currentUser._id
                })
            })
            const data = await res.json()
            if (res.ok) {
                setComments('')
                setCommentError(null)
                setAllComments([data, ...allComments])
            }
        }
        catch (e) {
            setCommentError(e.message)
            console.log(e)
        }
        //send comment,postid and userid to backend
    }

    useEffect(() => {
        const getAllComments = async () => {
            try {
                const res = await fetch(`/api/comment/getPostComments/${postId}`)
                const data = await res.json()
                if (res.ok) {
                    console.log(data, 'cgheck data here now')
                    setAllComments(data);
                }
            }
            catch (err) {
                console.log(err)
            }
        }
        getAllComments()
    }, [postId])

    return (
        <div className='max-w-2xl mx-auto w-full p-3'>
            {currentUser ? (
                <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                    <p>Signed in as:</p>
                    <img className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePicture} alt="" />
                    <Link to={'/dashboard?tab=profile'} className='text-xs text-cyan-600 hover:underline'>
                        @{currentUser.username}
                    </Link>
                </div>
            ) : (<div className='text-sm text-teal-500 my-5 flex gap-1'>
                You must be signed in to comment.
                <Link className='text-blue-500 hover:underline' to={'sign-in'}>
                    Sign in
                </Link>
            </div>)}
            {currentUser && (
                <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
                    <Textarea
                        onChange={(e) => setComments(e.target.value)}
                        value={comments}
                        placeholder='Add a comment..'
                        rows='3'
                        maxLength='200'>
                    </Textarea>
                    <div className='flex justify-between items-center mt-5'>
                        <p className='text-gray-500 text-xs'>${200 - comments.length} characters remaining</p>
                        <Button outline gradientDuoTone='purpleToBlue' type='submit'>
                            Submit
                        </Button>
                    </div>
                    {commentError && <Alert color='failure'
                        className='mt-5'>
                        {commentError}
                    </Alert>}
                </form>
            )}
            {allComments.length === 0 ? (<p className='text-sm my-5'>
                No comments yet!
            </p>) : (
                <>
                    <div className='text-sm my-5 flex items-center gap-1'>
                        <p>Comments</p>
                        <div className="border border-gray-400 py-1 px-2 rounded-sm">
                            <p>{allComments.length}</p>
                        </div>
                    </div>
                    {
                        allComments.map(comment => {
                            return (
                                <Comment
                                    key={comment._id}
                                    comment={comment} />
                            )
                        })
                    }
                </>
            )}
        </div>
    )
}

export default CommentSection
