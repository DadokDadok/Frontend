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

export default function ListMapView() {
    // const [data, setData] = useState([null]);
    const {data} = map;

    // 이후 로딩 상태 원복(false -> true)
    const [loading, setLoading] = useState(false);
    const [selectedCityDo, setSelectedCityDo] = useState('');
    const [selectedSiGunGu, setSelectedSiGunGu] = useState('');
    const navigate = useNavigate();

    const mapData = data.map((item, index) => {
        let cityDo = item.city_do;
        let siGunGu = item.si_gun_gu;
        return {
            rowNum: index + 1,
            id: item.id,
            name: item.name,
            type: item.type,
            cityDo: cityDo,
            siGunGu: siGunGu,
            address: item.address,
            tel: item.tel,
            latitude: item.latitude,
            longitude: item.longitude,
            homepage: item.homepage,
            closed: item.closed,
            operatingTime: item.operatingTime,
            description: item.description,
            img: item.img,
            tag: item.tag,
        };
    });

    const handleSelect = (cityDo, siGunGu) => {
        setSelectedCityDo(cityDo);
        setSelectedSiGunGu(siGunGu);
    };

    useEffect(() => {
        console.log(selectedCityDo, '/', selectedSiGunGu);
        // 여기서 axios 요청 보내야함

    }, [selectedCityDo, selectedSiGunGu]);

    // useEffect(() => {
    //     async function fetchData() {
    //         try {
    //             const result = await axios.get(`/courseId/${nickname}/${courseNo}`);
    //             const newData = result.data;
    //             setData(newData);
    //             // 데이터를 가져온 후에 공유 비밀번호 설정
    //             Object.values(newData).forEach(item => {
    //                 setSharePw(item[0].sharePw);
    //             });
    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    //
    //     fetchData();
    //
    //     return () => {
    //         setData([]);
    //         setSharePw('');
    //     };
    //
    // }, []);


    // Axios 요청 보내기
    // axios.post('/your-api-endpoint', {
    //     cityDo: cityDo,
    //     siGunGu: siGunGu
    // })
    //     .then(response => {
    //         console.log('Success:', response.data);
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //     });


    return (
        <>
            <div className="wrapper">
                {loading ? (
                    <div className="loading-wrap">
                        <div className="loading">
                            <Spinner animation="border" style={{width: '3rem', height: '3rem'}}/>
                        </div>
                        <br/>
                        <h2>Loading...</h2>
                    </div>
                ) : (
                    <>
                        <div className="result-wrap"><ListView data={mapData} onSelect={handleSelect}/></div>
                        <div className="result-map"><NaverMapView data={mapData}/></div>
                    </>
                )}
            </div>
        </>
    );
}