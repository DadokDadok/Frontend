import * as React from 'react';
import "./ListView.css";
import {useEffect, useState} from "react";
import ModalView from "./ModalView.jsx";
import RegionDropdown from "../../component/RegionDropdown";
import TypeDropdown from "../../component/typeDropDown";
import useGeoLocation from "../../component/useGeoLocation";

export default function ListView({data, onSelect, onTypeSelect, onLocation}) {

    const [noResult, setNoResult] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [selectedCon, setSelectedCon] = useState('');
    const location = useGeoLocation();
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);


    const handleShowModal = (id) => {
        const item = data.find(item => item.id === id);
        console.log(item)
        setSelectedCon(item);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
        // data.length가 변경될 때마다 noResult 업데이트
        setNoResult(data.length === 0);
    }, [data]);

    const handleGetLocation = () => {
        if (location.loaded && !location.error) {
            const { lat, lng } = location.coordinates;
            alert(`위도: ${lat}, 경도: ${lng}`);
            setLat(lat);
            setLng(lng);
            onLocation(lat, lng); // 부모 컴포넌트에 위치 정보 전달
        } else if (location.error) {
            alert(`위치 정보 오류: ${location.error.message}`);
        } else {
            alert('위치 정보를 로딩 중입니다.');
        }
    };

    return (
        <div>
            <div>
                <RegionDropdown onSelect={onSelect} onlat={lat} onlng={lng}/>
                <TypeDropdown onTypeSelect={onTypeSelect}/>
                <button onClick={handleGetLocation} className="btn btn-info" style={{marginTop: '10px'}}>
                    내 위치 가져오기
                </button>
            </div>
            {noResult ? (
                <div>
                    결과가 없습니다.
                </div>
            ) : (
                <div>
                {data.map(item => (
                        <div key={item.id}>
                            <hr />
                            <div className="list-detail">
                                <div className="location-wrap">
                                    <div className="location">
                                        <div
                                            className={`location-num-wrap ${item.type === "도서관" ? 'color-first' : item.type === "문화공간" ? 'color-second' : 'color-third'}`}
                                        >
                                            <p className="location-num">{item.rowNum}</p>
                                        </div>
                                        <div className="location-img-wrap" onClick={() => handleShowModal(item.id)}>
                                            <div className="location-img-div">
                                                <img
                                                    src={item.img ? item.img : '/img/dadok_logo.png'}
                                                    className="location-img"
                                                    alt={item.name}
                                                />
                                            </div>
                                        </div>
                                        <div className="location-info" onClick={() => handleShowModal(item.id)}>
                                            <p className="title">{item.name}</p>
                                            <p className="addr">{item.address}</p>
                                            <p className="tag">{item.tag}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {showModal && <ModalView show={showModal} handleClose={handleCloseModal} content={selectedCon} myLat={lat} myLng={lng} />}
                </div>
            )}
        </div>
    );
}

