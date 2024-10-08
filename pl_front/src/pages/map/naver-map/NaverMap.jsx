import React, {useEffect, useState} from 'react';
import "./NaverMap.css";
import ModalView from "../ModalView";

function NaverMap({markers, center, myLat, myLng}) {
    const [showModal, setShowModal] = useState(false); // 모달 열림/닫힘 상태를 관리
    const [selectedCon, setSelectedCon] = useState(null);
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);

    useEffect(() => {
        const {naver: naverResult} = window;

        if (naverResult && naverResult.maps) {
            const centerLocation = new naverResult.maps.LatLng(center.latitude, center.longitude);

            const mapOptions = {
                center: centerLocation,
                // 중앙에 배치할 위치
                zoom: 13,
                // 확대 단계
            };
            const map = new naverResult.maps.Map('map', mapOptions);

            const naverMarkers = Object.values(markers).map(({
                                                                 id,
                                                                 latitude,
                                                                 longitude,
                                                                 rowNum,
                                                                 type,
                                                             }) => {
                const markerLocation = new naverResult.maps.LatLng(latitude, longitude);
                
                if (type == "도서관") {
                    const marker = new naverResult.maps.Marker({
                        map: map,
                        position: markerLocation,
                        icon: {
                            content: `<div class="shape-container">
                     <div class="inner-triangle"></div>
                     <div class="wrap-circle"><div class="circle"></div></div>
                     <div class="inner-circle_1"><span class="index-text">${rowNum}</span></div>
                     <div class="triangle-container"></div></div>`,
                            size: new naverResult.maps.Size(50, 52),
                            anchor: new naverResult.maps.Point(16, 40)
                        }
                    });

                    // 마커 클릭 이벤트 핸들러 등록
                    marker.addListener('click', () => {
                        // 클릭된 마커의 위치를 지도의 중심으로 설정
                        map.setCenter(markerLocation);
                        const item = markers.find(item => item.id === id);
                        setSelectedCon(item);
                        setShowModal(true);
                    });

                    return marker;
                }
                if (type == "문화공간") {
                    const marker = new naverResult.maps.Marker({
                        map: map,
                        position: markerLocation,
                        icon: {
                            content: `<div class="shape-container">
                     <div class="inner-triangle"></div>
                     <div class="wrap-circle"><div class="circle"></div></div>
                     <div class="inner-circle_2"><span class="index-text">${rowNum}</span></div>
                     <div class="triangle-container"></div></div>`,
                            size: new naverResult.maps.Size(50, 52),
                            anchor: new naverResult.maps.Point(16, 40)
                        }
                    });

                    // 마커 클릭 이벤트 핸들러 등록
                    marker.addListener('click', () => {
                        // 클릭된 마커의 위치를 지도의 중심으로 설정
                        map.setCenter(markerLocation);
                        const item = markers.find(item => item.id === id);
                        setSelectedCon(item);
                        setShowModal(true);
                    });

                    return marker;
                }
                if (type == "서점") {
                    const marker = new naverResult.maps.Marker({
                        map: map,
                        position: markerLocation,
                        icon: {
                            content: `<div class="shape-container">
                     <div class="inner-triangle"></div>
                     <div class="wrap-circle"><div class="circle"></div></div>
                     <div class="inner-circle_3"><span class="index-text">${rowNum}</span></div>
                     <div class="triangle-container"></div></div>`,
                            size: new naverResult.maps.Size(50, 52),
                            anchor: new naverResult.maps.Point(16, 40)
                        }
                    });

                    // 마커 클릭 이벤트 핸들러 등록
                    marker.addListener('click', () => {
                        // 클릭된 마커의 위치를 지도의 중심으로 설정
                        map.setCenter(markerLocation);
                        const item = markers.find(item => item.id === id);
                        console.log(id)
                        setSelectedCon(item);
                        setShowModal(true);
                    });

                    return marker;
                }

            });
        }
    }, [markers, center]);

    const handleCloseModal = () => {
        // 모달 닫기
        setShowModal(false);
    };

    return (
        <>
            <div id="map" style={{width: '100%', height: '85vh'}}/>
            {/* 모달 */}
            {showModal && <ModalView show={showModal} handleClose={handleCloseModal} content={selectedCon} myLat={myLat} myLng={myLng}/>}
        </>
    );
}

export default NaverMap;