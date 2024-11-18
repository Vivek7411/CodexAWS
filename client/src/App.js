import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';
import SignUp from './pages/Signup'; 
import ContributorsPage from './pages/contributer'; 
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
// import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <>
            <div>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        success: {
                            theme: {
                                primary: '#4aed88',
                            },
                        },
                    }}
                />
            </div>
            <BrowserRouter>
                <Routes> 
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path='/login' element={<Login />} />

                    <Route 
                        path='/ContributorsPage' 
                        element={
                            <ContributorsPage />  
                        } />

 

                    <Route
                        path="/editor/:roomId"
                        element={
                            <ProtectedRoute>
                                <EditorPage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;


