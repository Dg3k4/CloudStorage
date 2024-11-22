import NavBar from "./navbar/NavBar";
import "./app.css"
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Registration from "./registration/Registration";
import Login from "./registration/Login";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {auth} from "../action/user";
import Disk from "./disk/Disk";
import Profile from "./profile/Profile";

function App() {
    const isAuth = useSelector(state => state.user.isAuth)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(auth())
    }, [])

    return (
        <BrowserRouter>
            <div className="App">
                <NavBar/>
                <div className="wrap">
                    {!isAuth ?
                        <Routes>
                            <Route path="/registration" element={<Registration/>}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="*" element={<Navigate to="/login"/>}/>
                        </Routes>
                        :
                        <Routes>
                            <Route path="/" element={<Disk/>}/>
                            <Route path="/profile" element={<Profile/>}/>
                            <Route path="*" element={<Navigate to="/"/>}/>
                        </Routes>
                    }
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
