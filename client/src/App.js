import './App.css';
import { Route, Routes } from "react-router-dom";
import Layout from './layouts/Layout';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { UserContextProvider } from './components/UserContext';
import CreatePost from './pages/postsPages/CreatePost';
import PostPage from './pages/postsPages/PostPage';
import EditPost from './pages/postsPages/EditPost';
import DeletePost from './pages/postsPages/DeletePost';

function App() {
  return (
    <UserContextProvider>
      <Routes>

        <Route path='/' element={<Layout />} >

          <Route index element={ <IndexPage />} />

          <Route path='/login' element={ <LoginPage  />} />

          <Route path='/register' element={ <RegisterPage />} />

          <Route path='/create' element={ <CreatePost /> } />

          <Route path='/post/:id' element={ <PostPage />} /> 

          <Route path='/edit/:id' element={ <EditPost />} />

          <Route path='/delete/:id' element= {<DeletePost />} />
        </Route>

      </Routes>
    </UserContextProvider>
  );
}

export default App;
