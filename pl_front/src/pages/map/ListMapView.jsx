import * as React from 'react';
import "./ListView.css";
import {useEffect, useState} from "react";
import axios from "axios";
import NaverMapView from "./naver-map/NaverMapView";
import ListView from "./ListView";
import "./ListMapView.css"
import Spinner from 'react-bootstrap/Spinner';
import {useNavigate, useParams} from "react-router-dom";
import map from "./map.json";
import useGeoLocation from "../../component/useGeoLocation";

export default function ListMapView() {
    const [data, setData] = useState([]);

    // 이후 로딩 상태 원복(false -> true)
    const [selectedCityDo, setSelectedCityDo] = useState('서울특별시');
    const [selectedSiGunGu, setSelectedSiGunGu] = useState('종로구');
    const [selectedType, setSelectedType] = useState('');
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);

    const fetchRegionData = async () => {
        try {
            const result = await axios.get(`/api/get/books?cityDo=${selectedCityDo}&siGunGu=${selectedSiGunGu}${selectedType ? `&type=${selectedType}` : ''}`);
            setData(result.data);
        } catch (error) {
            console.error("Error fetching region data:", error);
        }
    };

    const fetchLocationData = async () => {
        try {
            const result = await axios.get(`/api/get/books-me?lat=${lat}&lng=${lng}${selectedType ? `&type=${selectedType}` : ''}`);
            setData(result.data);
        } catch (error) {
            console.error("Error fetching location data:", error);
        }
    };

    useEffect(() => {
        fetchRegionData();
    }, []);

    useEffect(() => {
        if (lat !== 0 && lng !== 0) {
            fetchLocationData();
        } else {
            fetchRegionData();
        }
    }, [selectedCityDo, selectedSiGunGu, selectedType, lat, lng]);

    const handleSelect = (cityDo, siGunGu) => {
        setSelectedCityDo(cityDo);
        setSelectedSiGunGu(siGunGu);
        setLat(0);
        setLng(0);
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
            <div className="wrapper">
                <>
                    <div className="result-wrap"><ListView data={mapData}
                                                           onSelect={handleSelect}
                                                           onTypeSelect={(type) => {
                                                               setSelectedType(type)
                                                           }}
                                                           onLocation={(lat, lng) => {
                                                               setLat(lat);
                                                               setLng(lng);
                                                           }}

                    /></div>
                    <div className="result-map"><NaverMapView data={mapData} myLat={lat} myLng={lng}/></div>
                </>
            </div>
        </>
    );
}