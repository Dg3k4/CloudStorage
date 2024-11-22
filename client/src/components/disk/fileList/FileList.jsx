import React from 'react';
import "./fileList.css"
import {useSelector} from "react-redux";
import File from "./file/File";
import {CSSTransition, TransitionGroup} from "react-transition-group";

const FileList = () => {

    const files = useSelector(state => state.file.files)
    const fileView = useSelector(state => state.file.view)

    if (files.length === 0) {
        return (
            <div style={{
                height: "80vh",
                display: "flex",
                justifyContent: "center",
                marginTop: 100,
                fontSize: 25
            }}>
                Здесь как-то пустовато :(
            </div>
        )
    }

    if (fileView === "plate") {
        return (
            <div className="fileplate">
                {files.map(file =>
                    <File key={file._id} file={file}/>
                )}
            </div>
        );
    }

    if (fileView === "list") {
        return (
            <div className="filelist">
                <div className="filelist__header">
                    <div className="filelist__name">Название</div>
                    <div className="filelist__size">Размер</div>
                    <div className="filelist__date">Дата</div>
                </div>
                <TransitionGroup>
                    {files.map(file =>
                        <CSSTransition
                            key={file._id}
                            timeout={500}
                            className="file"
                            exit={false}
                        >
                            <File file={file}/>
                        </CSSTransition>
                    )}
                </TransitionGroup>
            </div>
        );
    }

};

export default FileList;