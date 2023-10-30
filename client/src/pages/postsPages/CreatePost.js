import { useState } from "react";
import 'react-quill/dist/quill.snow.css';
import {Navigate} from "react-router-dom";
import Editor from "../../Editor"

export default function CreatePost(){
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    //const [files, setFiles] = useState('');
    const [redirectToMainPage, setRedirect] = useState(false);


    async function createNewPost(ev){
        ev.preventDefault();
        const data = {
            "title": title,
            "summary": summary,
            "content": content,
            //"file": files
        }
        const response = await fetch('http://localhost:4444/post', {
            method:'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'},
            credentials: 'include',
        });
        console.log("here")
        if(!response.ok){
            alert('Problem accured when trying to add post!'); 
        }else{
            setRedirect(true);
        }
    }
    
    if(redirectToMainPage){
        return <Navigate to={'/'} />
    }

    return( 
        <form onSubmit={createNewPost}>
            <input type="title" placeholder="Title"
                value={title} onChange={ev => setTitle(ev.target.value)} />

            <input type="summary" placeholder="Summary"
                value={summary} onChange={ev => setSummary(ev.target.value)}/>

             {/* <input type="file" value={files}
                onChange={ev => setFiles(ev.target.files)}/>  */}

            <Editor value={content} onChange={setContent} />
            <button type="submit" style={{marginTop:'7px'}}>Create post</button>
        </form>
    );
}