import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";



  export default function Header() {
    const {setUserInfo, userInfo} = useContext(UserContext);
    
    useEffect(() => {
      fetch('http://localhost:4444/profile', {
        credentials: 'include',
      }).then(response => {
        response.json().then(userInfo => {
          setUserInfo(userInfo);
        });
      });
    }, []);

  function logout(){
    fetch('http://localhost:4444/logout', {
      credentials: 'include',
      method: 'POST',
    })
    setUserInfo(null);
  }

  const username = userInfo?.username //if not null

    return(
        <header>
        <Link to="/">  <img src="/logo1.jpg" alt="Logo" className="myLogo"  /> </Link>
        <Link to="/" className="logo">HumanBeingFuture</Link>
        <nav>
          {username && (
            <>
              <span>Hello {username}!</span>
              <Link to="/create">Create new post</Link>
              <button onClick={logout}>Logout</button>
            </>
          )}
          {!username && (
            <> 
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>
    )
}

