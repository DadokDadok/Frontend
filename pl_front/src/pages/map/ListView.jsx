import * as React from 'react';
import "./ListView.css";
import {useEffect, useState} from "react";
import ModalView from "./ModalView.jsx";
import RegionDropdown from "../../component/RegionDropdown";
import TypeDropdown from "../../component/typeDropDown";
import useGeoLocation from "../../component/useGeoLocation";
import Pagination from '@mui/material/Pagination';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import SearchBar from "../../component/SearchBar";
import {Dialog, DialogActions, DialogContent, DialogTitle, Button} from '@mui/material';
import Badge from 'react-bootstrap/Badge';

const LocationRequestDialog = ({open, onClose, onConfirm}) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>위치 정보 요청</DialogTitle>
        <DialogContent>
            <p>현재 위치를 사용하시겠습니까?</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary">아니요</Button>
            <Button onClick={onConfirm} color="primary">예</Button>
        </DialogActions>
    </Dialog>
);

export default function ListView({data, onSelect, onTypeSelect, onLocation, setSearchTerm}) {
    const [noResult, setNoResult] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedCon, setSelectedCon] = useState('');
    const location = useGeoLocation();
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [showLocationDialog, setShowLocationDialog] = useState(false);

    // 선택된 도시와 지역 상태
    const [selectedCityDo, setSelectedCityDo] = useState('');
    const [selectedSiGunGu, setSelectedSiGunGu] = useState('');

    // 페이징 관련 상태
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // 한 페이지당 표시할 항목 수

    // 검색 로직
    const [searchTermState, setSearchTermState] = useState('');

    useEffect(() => {
        setNoResult(data.length === 0);
    }, [data]);

    useEffect(() => {
        setCurrentPage(1);
    }, [onSelect]);

    const handleSearchChange = (event) => {
        setSearchTermState(event.target.value);
    };

    const executeSearch = () => {
        setSearchTerm(searchTermState);
        setCurrentPage(1);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            executeSearch();
        }
    };

    const handleShowModal = (id) => {
        const item = data.find(item => item.id === id);
        setSelectedCon(item);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleGetLocation = () => {
        setShowLocationDialog(true);
    };

    const handleConfirmLocation = () => {
        setShowLocationDialog(false);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                onLocation(latitude, longitude);
                setCurrentPage(1);
            },
            (error) => {
                console.error("Error obtaining location:", error);
                // 에러 처리 로직 추가 가능
            }
        );
    };


    // 페이징 로직
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentItems = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="background">
            <div className="search-bar">
                <div className="explore">
                    <div className="region-dropdown">
                        <RegionDropdown onSelect={onSelect} />
                    </div>
                    <div className="type-dropdown">
                        <TypeDropdown onTypeSelect={onTypeSelect}/>
                    </div>
                    <button onClick={handleGetLocation} className="btn btn-info"
                            style={{backgroundColor: '#335061', color: '#ffffff'}}>
                        <GpsFixedIcon/> 내 위치
                    </button>
                </div>
                <SearchBar
                    value={searchTermState}
                    onChange={handleSearchChange}
                    onSearch={executeSearch}
                    onKeyPress={handleKeyPress}
                />
            </div>


            {noResult ? (
                <div className="list-wrap">결과가 없습니다.</div>
            ) : (
                <div className="list-wrap">
                    {currentItems.map(item => (
                        <div key={item.id}>
                            <hr/>
                            <div className="list-detail">
                                <div className="location-wrap">
                                    <div className="location">
                                        <div
                                            className={`location-num-wrap ${item.type === "도서관" ? 'color-first' : item.type === "문화공간" ? 'color-second' : 'color-third'}`}>
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
                                            <div className="tags">
                                                {item.tag.split('#').map((tag, index) => (
                                                    tag.trim() && <p key={index} className="tag">#{tag.trim()}</p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {showModal && (
                        <ModalView show={showModal} handleClose={handleCloseModal} content={selectedCon} myLat={lat}
                                   myLng={lng}/>
                    )}

                    <div>
                        <div className="pagination">
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={(event, value) => setCurrentPage(value)}
                                variant="outlined"
                                shape="rounded"
                            />
                        </div>

                    </div>
                </div>
            )}

            <LocationRequestDialog
                open={showLocationDialog}
                onClose={() => setShowLocationDialog(false)}
                onConfirm={handleConfirmLocation}
            />
        </div>
    );
}
