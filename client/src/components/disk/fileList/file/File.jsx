import React from 'react';
import "./file.css"
import dirLogo from "../../../../assets/img/directory.png"
import fileLogo from "../../../../assets/img/file.png"
import {useDispatch, useSelector} from "react-redux";
import {pushToStack, setCurrentDir} from "../../../../reducers/fileReducer";
import "boxicons"
import {deleteFile, downloadFile} from "../../../../action/file";


const File = ({file}) => {
    const dispatch = useDispatch()
    const currentDir = useSelector(state => state.file.currentDir)
    const fileView = useSelector(state => state.file.view)

    function openHandler(file) {
        if (file.type === "dir") {
            dispatch(pushToStack(currentDir))
            dispatch(setCurrentDir(file._id))
        }
    }

    function downloadFileHandler(e) {
        e.stopPropagation()
        downloadFile(file)
    }

    function deleteClickHandler(e) {
        e.stopPropagation()
        dispatch(deleteFile(file))
    }

    if (fileView === "list") {
        return (
            <div className="file" onClick={() => openHandler(file)}>
                <img src={file.type === "dir" ? dirLogo : fileLogo} alt="" className="file__img"/>
                <div className="file__name">{file.name}</div>
                <div className="file__size">{(file.size / 1048576).toFixed(2)} Мб.</div>
                <div className="file__date">{file.data.slice(0, 10)}</div>
                {file.type !== "dir" && <button onClick={(e) => downloadFileHandler(e)} className="file__btn file__download">
                    <box-icon type='solid' color="#566885" name='download'/>
                </button>}
                <button onClick={(e) => deleteClickHandler(e)} className="file__btn file__delete">
                    <box-icon name='trash' color="#566885"/>
                </button>
            </div>
        );
    }

    if (fileView === "plate") {
        return (
            <div className="file-plate" onClick={() => openHandler(file)}>
                <img src={file.type === "dir" ? dirLogo : fileLogo} alt="" className="file-plate__img"/>
                <div className="file-plate__name">{file.name}</div>
                <div className="file-plate__btns">
                    {file.type !== "dir" && <button onClick={(e) => downloadFileHandler(e)} className="file-plate__btn file-plate__download">
                        <box-icon type='solid' color="#566885" name='download'/>
                    </button>}
                    <button onClick={(e) => deleteClickHandler(e)} className="file-plate__btn file-plate__delete">
                        <box-icon name='trash' color="#566885"/>
                    </button>
                </div>
            </div>
        );
    }

};

export default File;