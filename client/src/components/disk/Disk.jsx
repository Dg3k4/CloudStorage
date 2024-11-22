import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {createDir, getFiles, uploadFile} from "../../action/file";
import FileList from "./fileList/FileList";
import "./disk.css"
import Popup from "./Popup";
import {setCurrentDir, setFileView, setPopupDisplay} from "../../reducers/fileReducer";
import file from "./fileList/file/File";
import "boxicons"
import UploadFile from "./uploader/UploadFile";
import Uploader from "./uploader/Uploader";

const Disk = () => {
    const dispatch = useDispatch()
    const currentDir = useSelector(state => state.file.currentDir);
    const dirStack = useSelector(state => state.file.dirStack)
    const loader = useSelector(state => state.app.loader)
    const [dragEnter, setDragEnter] = useState(false)
    const [sort, setSort] = useState("type")

    useEffect(() => {
        dispatch(getFiles(currentDir, sort))
    },[currentDir, sort])

    function showPopupHandler() {
        dispatch((setPopupDisplay("flex")))
    }

    function backHandler() {
        const backDirId = dirStack.pop()
        dispatch(setCurrentDir(backDirId))
    }

    function fileUploadHandler(event) {
        const files = [...event.target.files]
        files.forEach(file => dispatch(uploadFile(file, currentDir)))
    }

    function dragEnterHandler (event) {
        event.preventDefault()
        event.stopPropagation()
        setDragEnter(true)
    }

    function dragLeaveHandler (event) {
        event.preventDefault()
        event.stopPropagation()
        setDragEnter(false)
    }

    function dropHandler(event) {
        event.preventDefault()
        event.stopPropagation()
        let files = [...event.dataTransfer.files]
        files.forEach(file => dispatch(uploadFile(file, currentDir)))
        setDragEnter(false)
    }

    if (loader) {
        return (
            <div className="loader">
                <div className="lds-ellipsis">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        )
    }

    return (
        !dragEnter ?
        <div className="disk" onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
            <div className="disk__btns">
                <button className="disk__back" onClick={() => backHandler()}>Назад</button>
                <button className="disk__create" onClick={() => showPopupHandler()}>Создать папку</button>
                <div className="disk__upload">
                    <label htmlFor="disk__upload-input" className="disk__upload-label">Загрузить файл <box-icon name='upload' color="#566885"/></label>
                    <input multiple={true} onChange={(event) => fileUploadHandler(event)} type="file" id="disk__upload-input" className="disk__upload-input"/>
                </div>
                <select
                    className="disk__select"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                >
                    <option disabled={true}>Отсортировать...</option>
                    <option value="name">По имени</option>
                    <option value="type">По типу</option>
                    <option value="date">По дате</option>
                </select>
                <button className="disk__plate" onClick={() => dispatch(setFileView("plate"))}></button>
                <button className="disk__list" onClick={() => dispatch(setFileView("list"))}></button>
            </div>
            <FileList/>
            <Popup/>
            <Uploader/>
        </div>
            :
        <div className="drop-area" onDrop={dropHandler} onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
            <div className="drop-area__container">
                Сюда кидать файлы
            </div>
        </div>
    );
};

export default Disk;