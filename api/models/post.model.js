import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        default: 'https://imgs.search.brave.com/_jMuIR7hdiY4-ycELDVN8OdWj-7ZHHi28V_5iAxGMNA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9uZWls/cGF0ZWwuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDE3LzA5/L2Jsb2ctcG9zdC1p/bWFnZS1ndWlkZS5q/cGc'
    },
    category: {
        type: String,
        default: 'uncategorized'
    },
    slug: {
        type: String,
        unique: true,
        required: true
    }
}, { timestamps: true })

const Post = mongoose.model('Post', postSchema)
export default Post