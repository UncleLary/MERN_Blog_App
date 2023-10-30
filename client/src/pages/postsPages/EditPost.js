import {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import Editor from "../../Editor";

export default function EditPost(){
    const { id } = useParams();
    const [title,setTitle] = useState('');
    const [summary,setSummary] = useState('');
    const [content,setContent] = useState('');
    //const [files, setFiles] = useState('');
    const [redirectToPost, setRedirect] = useState(false);

    useEffect(() => {
        fetch('http://localhost:4444/post/'+id)
          .then(response => {
            response.json().then(postInfo => {
              setTitle(postInfo.title);
              setContent(postInfo.content);
              setSummary(postInfo.summary);
              //setFiles(postInfo.files);
            });
          });
      }, []);

    async function updatePost(ev){
        ev.preventDefault();
        // const data = new FormData();
        // data.set('title', title);
        // data.set('summary', summary);
        // data.set('content', content);
        // data.set('id', id);
        // if (files?.[0]) {
        // data.set('file', files?.[0]);
        // }
        const data = {
          "title" : title,
          "summary" : summary,
          "content" : content,
          //"file": files,
          "id" : id
        }
        const response = await fetch('http://localhost:4444/post', {
        method: 'PUT',
        body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
              },
        credentials: 'include',
        });
        if (response.ok) {
        setRedirect(true);
        } else{
        alert('Problem accured when trying to edit post!');
     }
    }



    if(redirectToPost){
        return <Navigate to={'/post/'+id} />
    }
    
    return (
        <form onSubmit={updatePost}>
          <input type="title"
                 placeholder={'Title'}
                 value={title}
                 onChange={ev => setTitle(ev.target.value)} />
          <input type="summary"
                 placeholder={'Summary'}
                 value={summary}
                 onChange={ev => setSummary(ev.target.value)} />
          {/* <input type="file"
                 onChange={ev => setFiles(ev.target.files)} /> */}
          <Editor onChange={setContent} value={content} />
          <button style={{marginTop:'5px'}}>Update post</button>
        </form>
      );

    // return(
    //     <form onSubmit={updatePost}>
    //         <input type="title" placeholder="Title"
    //             value={title} onChange={ev => setTitle(ev.target.value)} />

    //         <input type="summary" placeholder="Summary"
    //             value={summary} onChange={ev => setSummary(ev.target.value)}/>

    //         <input type="file" value={files}
    //             onChange={ev => setFiles(ev.target.files)}/>

    //         <ReactQuill value={content} onChange={newValue => setContent(newValue)}/>

    //         <button style={{marginTop:'7px'}}>Create post</button>
    //     </form>
    // );

}