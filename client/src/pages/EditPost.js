import React, { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import Editor from '../Editor'

export default function EditPost() {
    const { id } = useParams();
    const [title, setTitle] = useState('')
    const [summary, setSummary] = useState('')
    const [content, setContent] = useState('')
    const [files, setFiles] = useState('')

    const [redirect, setRedirect] = useState(false)

    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`)
            .then(response => response.json())
            .then(postInfo => {
                setTitle(postInfo.title);
                setSummary(postInfo.summary);
                setContent(postInfo.content);
                setFiles(postInfo.cover);
            });
    }, [id]);

    async function updatePost(e) {
        const data = new FormData();
        data.set('id', id);
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        if (files?.[0])
            data.set('file', files?.[0]);

        e.preventDefault();
        const response = await fetch('http://localhost:4000/post', {
            method: 'PUT',
            credentials: 'include',
            body: data
        });

        if (response.ok) {
            setRedirect(true);
        }
    }

    if (redirect)
        return <Navigate to={`/post/${id}`} />

    return (
        <form onSubmit={updatePost}>
            <input type="title" placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} />
            <input type="summary" placeholder='Summary' value={summary} onChange={e => setSummary(e.target.value)} />
            <input type="file" onChange={e => setFiles(e.target.files)} />
            <Editor value={content} onChange={e => setContent(e)} />
            <button type="submit" style={{ marginTop: '5px' }}>Update post</button>
        </form>
    )
}
