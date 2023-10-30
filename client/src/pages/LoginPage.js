import { useContext, useState } from "react";
import { Navigate } from 'react-router-dom';
import { UserContext } from "../components/UserContext";

export default function LoginPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirectToMainPage, setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext);


    async function login(ev) {
        ev.preventDefault();
        if (username.trim() === '' || password.trim() === '') {
            alert('Please enter username and password!');
            return;
        }

        const response = await fetch('http://localhost:4444/login', {
            method: 'POST',
            body: JSON.stringify({username,password}),
            headers: {'Content-Type':'application/json'},
            credentials: 'include',
        });

        if(response.ok){
            response.json().then(userInfo => {
                setUserInfo(userInfo);
                setRedirect(true);
            })
        }else{
            alert('Wrong credentials!');
        }
    }

    if(redirectToMainPage){
        return <Navigate to={'/'} />
    }
    return(
        <form className="login" onSubmit={login}>
            <h1>Login</h1>
            <input type="text"  placeholder="username" 
            value={username} onChange={ev => setUsername(ev.target.value)}/>

            <input type="password" placeholder="password" value={password}
             onChange={ev => setPassword(ev.target.value)}/>

            <button>Login</button>
        </form>
    );
}