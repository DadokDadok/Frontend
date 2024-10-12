import * as React from 'react';
import "./ListView.css";
import { useEffect, useState } from "react";
import axios from "axios";
import NaverMapView from "./naver-map/NaverMapView";
import ListView from "./ListView";
import "./ListMapView.css";
import NavBar from "../../component/nav-bar/navBar";


export default function ListMapView() {
    const [data, setData] = useState([]);
    const [selectedCityDo, setSelectedCityDo] = useState('서울특별시');
    const [selectedSiGunGu, setSelectedSiGunGu] = useState('종로구');
    const [selectedType, setSelectedType] = useState('');
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [lastAction, setLastAction] = useState('');


    const fetchData = async () => {
        let url = '';
        if(lastAction === ''){
            url = `/api/books?cityDo=${selectedCityDo}&siGunGu=${selectedSiGunGu}${selectedType ? `&type=${selectedType}` : ''}`;
        } else if (lastAction === 'location') {
            url = `/api/books-me?lat=${lat}&lng=${lng}${selectedType ? `&type=${selectedType}` : ''}`;
        } else if (lastAction === 'search') {
            url = `/api/search-book?word=${searchTerm}`;
        } else if (lastAction === 'region') {
            url = `/api/books?cityDo=${selectedCityDo}&siGunGu=${selectedSiGunGu}${selectedType ? `&type=${selectedType}` : ''}`;
        }

        if (url) {
            try {
                const result = await axios.get(url);
                setData(result.data);
            } catch (error) {
                console.error("데이터 가져오기 오류:", error);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [lastAction, lat, lng, searchTerm, selectedCityDo, selectedSiGunGu, selectedType]);

    const handleSelect = (cityDo, siGunGu) => {
        setSelectedCityDo(cityDo);
        setSelectedSiGunGu(siGunGu);
        setLat(0);
        setLng(0);
        setLastAction('region'); // 최근 액션을 지역 선택으로 설정
    };

    const handleLocation = (lat, lng) => {
        setLat(lat);
        setLng(lng);
        setLastAction('location'); // 최근 액션을 위치로 설정
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setLastAction('search'); // 최근 액션을 검색으로 설정
    };

    const mapData = data && data.length > 0 ? data.map((item, index) => {
        // item이 null이 아닐 경우에만 접근
        if (!item) return null; // 혹시라도 item이 null인 경우를 처리

        return {
            rowNum: index + 1,
            id: item.id,
            name: item.name,
            type: item.type,
            address: item.address,
            tel: item.tel,
            latitude: item.latitude,
            longitude: item.longitude,
            homepage: item.homepage,
            closed: item.closed,
            open: item.open,
            description: item.description,
            img: item.img,
            tag: item.tag,
        };
    }).filter(item => item !== null) : []; // null을 제거한 새로운 배열 반환



    return (
        <>
            <NavBar />
            <div className="wrapper">
                <div className="result-wrap">
                    <ListView
                        data={mapData}
                        onSelect={handleSelect}
                        onTypeSelect={setSelectedType}
                        onLocation={handleLocation}
                        setSearchTerm={(setSearchTerm) => handleSearch(setSearchTerm)}
                    />
                </div>
                <div className="result-map">
                    <NaverMapView data={mapData} myLat={lat} myLng={lng} />
                </div>
                <div style={{paddingBottom: "8rem", backgroundColor: "#FAF7F0"}}>
                </div>
            </div>
        </>
    );
}
