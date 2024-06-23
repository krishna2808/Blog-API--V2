import React, { useState } from 'react';
import '../../assets/styles/main.css';
import axios from 'axios';
import Header from '../common/Header';

const postCreateAndListAndUpdateDescostoryUrl = `${process.env.REACT_APP_BACKEND_API_URL}/post/`


function CreatePost() {
    const [post, setPost] = useState({
        title: '',
        description: '',
        image: null,
    });

    const token = localStorage.getItem('access_token');
    const header = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setPost({ ...post, image: files[0] });
        } else {
            setPost({ ...post, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', post.title);
        formData.append('description', post.description);
        formData.append('file', post.image);

        axios.post(postCreateAndListAndUpdateDescostoryUrl, formData, { headers: header })
            .then(response => {
                console.log('Post created successfully!', response.data);
                setPost({
                    title: '',
                    description: '',
                    image: null,
                });
            })
            .catch(error => {
                console.error('Error creating post:', error);
            });
    };

    return (
        <>

            <Header/>
            <div className="create-post-container">
                <h2>Create a New Post</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">Post Title</label>
                        <input type="text" className="form-control" id="title" name="title" value={post.title} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description" className="form-label">Post Description</label>
                        <textarea className="form-control" id="description" name="description" value={post.description} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image" className="form-label">Post Image</label>
                        <input type="file" className="form-control" id="image" name="image" onChange={handleChange} accept="image/*" required />
                    </div>
                    <button type="submit" className="btn btn-primary">Create Post</button>
                </form>
            </div>

        </>
        
    );
}

export default CreatePost;
