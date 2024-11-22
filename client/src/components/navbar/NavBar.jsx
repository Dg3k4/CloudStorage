import React, {useState} from 'react';
import "./navbar.css"
import Logo from "../../assets/img/navbar-logo.png"
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setLogout} from "../../reducers/userReducer";
import {getFiles, searchFile} from "../../action/file";
import {showLoader} from "../../reducers/appReducer";
import avatarLogo from "../../assets/img/default_avatar.png"
import {API_URL} from "../../config";

const NavBar = () => {
    const isAuth = useSelector(state => state.user.isAuth)
    const currentDir = useSelector(state => state.file.currentDir)
    const currentUser = useSelector(state => state.user.currentUser)
    const dispatch = useDispatch()
    const [searchName, setSearchName] = useState("")
    const [searchTimeout, setSearchTimeout] = useState(false)
    const avatar = currentUser.avatar ? `${API_URL + currentUser.avatar}` : avatarLogo

    function searchHandler(e) {
        setSearchName(e.target.value)
        if (searchTimeout !== false) {
            clearTimeout(searchTimeout)
        }
        dispatch(showLoader())
        if (e.target.value !== "") {
            setSearchTimeout(setTimeout((value) => {
                dispatch(searchFile(value))
            }, 500, e.target.value))
        } else {
            dispatch(getFiles(currentDir))
        }
    }

    return (
        <div className="container">
            <div className="navbar">
                <img src={Logo} alt="" className="navdar__logo"/>
                <h1 className="navdar__header">DATA CLOUD</h1>
                {isAuth && <input
                    value={searchName}
                    onChange={e => searchHandler(e)}
                    type="text"
                    className="navbar__search"
                    placeholder="Найдётся всё..."
                />}
                {!isAuth && <div className="navbar__login"><NavLink to="/login">Войти</NavLink></div>}
                {!isAuth && <div className="navbar__registration"><NavLink to="/registration">Регистрация</NavLink></div>}
                {isAuth && <div style={{cursor: "pointer"}} className="navbar__login" onClick={() => dispatch(setLogout())}>Выйти</div>}
                {isAuth && <NavLink to="/profile">
                    <img style={{width: 60, height: 60, borderRadius: "100%"}} src={avatar} alt=""/>
                </NavLink>}
            </div>
        </div>
    );
};

export default NavBar;