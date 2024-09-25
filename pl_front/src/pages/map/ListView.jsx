import * as React from 'react';
import "./ListView.css";
import {Link, useParams} from "react-router-dom";
import {useContext, useState} from "react";
import ModalView from "./ModalView.jsx";
import RegionDropdown from "../../component/RegionDropdown";
import {Row, Col, Button} from 'react-bootstrap';

export default function ListView({data, onSelect}) {

    const [showModal, setShowModal] = useState(false);
    const [selectedCon, setSelectedCon] = useState('');

    const handleShowModal = (id) => {
        const item = data.find(item => item.id === id);
        setSelectedCon(item);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    return (
        <div
            // className="background"
        >
            <RegionDropdown onSelect={onSelect}/>
            {data.map(item => (
                <div key={item.id}>
                    <hr/>
                    <div className="list-detail">
                        <div className="location-wrap">

                            <div className="location">
                                <div
                                    className={`location-num-wrap ${item.type === "도서관" ? 'color-first' : item.type === "문화공간" ? 'color-second' : 'color-third'}`}>
                                    <p className="location-num">{item.rowNum}</p>
                                </div>
                                <div className="location-img-wrap"
                                     onClick={() => handleShowModal(item.id)}
                                >
                                    <div className="location-img-div">
                                        <img src={item.img ? item.img : '/img/dadok_logo.png'} className="location-img"
                                             alt={item.name}/>
                                    </div>
                                </div>
                                <div className="location-info" onClick={() => handleShowModal(item.id)}>
                                    <p className="title">{item.name}</p>
                                    <p className="addr">{item.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {showModal && <ModalView show={showModal} handleClose={handleCloseModal} content={selectedCon}/>}
        </div>
    );
}

