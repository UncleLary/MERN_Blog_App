import {useState} from "react"
import {Navigate} from "react-router-dom";



export default function RegisterPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirectToMainPage, setRedirect] = useState(false);

    async function register(ev){
        ev.preventDefault();

        if (username.trim() === '' || password.trim() === '') {
            alert('Please enter both username and password.');
            return;
        }

        if (username.length < 5) {
            alert('Username must containt at least 5 characters.');
            return;
        }

        if (!/(?=(.*[a-zA-Z]){4})/.test(username)) {
            alert('Username must contain at least 4 letters.');
            return;
          }

        if (password.length < 8) {
            alert('Password must contain at least 8 characters.');
            return;
        }

         if (!/\d/.test(password)) {
            alert('Password must contain at least 1 digit character.');
            return;
        }

        if (!/(?=.*[A-Z])/.test(password)) {
            alert('Username must contain at least 1 capital letter.');
            return;
        }

        if (!/[^A-Za-z0-9]/.test(password)) {
            alert("Password must contain at least one special character.");
            return;
        }
        
        const response = await fetch('http://localhost:4444/register', {
            method: 'POST',
            body: JSON.stringify({username,password}),
            headers: {'Content-Type':'application/json'},
        })
        if (response.ok) {
        setRedirect(true);
        } else{
        alert('Problem accured when trying to register!');
        }
    }

    if(redirectToMainPage){
        return <Navigate to={'/'} />
    }

    return(
        <form className="register" onSubmit={register}>
            <h1>Register</h1>
            <input type="text"  
            placeholder="username" 
            value={username}
            onChange={ev => setUsername(ev.target.value)} />

            <input type="password" 
            placeholder="password" 
            value={password}
            onChange={ev => setPassword(ev.target.value)} />

            <button>Register</button>
        </form>
    );
}