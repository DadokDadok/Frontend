import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import styled from "styled-components";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import NavBar from "../../component/nav-bar/navBar";


function Main() {
    const [bookMap, setBookMap] = useState(''); // 지도
    const [reader, setReader] = useState(''); // 다독자
    const [trend, setTrend] = useState(''); // 사서 추천

    const navigate = useNavigate();

    const fetchPhotos = async (query, setState) => {
        const accessKey = process.env.REACT_APP_UNSPLASH_CLIENT_ID;
        try {
            const response = await axios.get(`https://api.unsplash.com/search/photos`, {
                params: {
                    query: query,
                    client_id: accessKey
                }
            });

            const photos = response.data.results;
            if (photos.length > 0) {
                const randomIndex = Math.floor(Math.random() * photos.length);
                setState(photos[randomIndex].urls.regular);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchPhotos('book', setBookMap);
        fetchPhotos('library', setReader);
        fetchPhotos('trend', setTrend);
    }, []);

    function moveMap() {
        navigate('/map');
    }

    function moveKeyword() {
        navigate('/keyword');
    }

    function moveTrend() {
        navigate('/trend');
    }


    return (
        <Background>
            <MainContainer>
                <MainRow>
                    <MainCol xs={6} md={6}>
                        <ImageContainer>
                            {bookMap && <MainImage src={bookMap} />}
                        </ImageContainer>
                    </MainCol>
                    <MainCol xs={6} md={6}>
                        <ImageContainer>
                            <MainText>
                                <h4>도서 지도</h4>
                                <br />
                                <MainTextP>다양한 도서관과 서점을 한 곳에서 확인하세요!</MainTextP>
                            </MainText>
                        </ImageContainer>
                    </MainCol>
                    <Overlay className="overlay">
                        <MainButton
                            variant="outline-light"
                            onClick={moveMap}>
                            도서 지도로 이동
                        </MainButton>
                    </Overlay>
                </MainRow>
                <MainRow>
                    <MainCol xs={6} md={6}>
                        <ImageContainer>
                            <MainText>
                                <h4>트렌드 기반 도서 추천</h4>
                                <br />
                                <MainTextP>구글 사용자들의 검색을 취합하여 분석된</MainTextP>
                                <MainTextP>트렌드를 바탕으로 도서를 추천해드립니다!</MainTextP>
                            </MainText>
                        </ImageContainer>
                    </MainCol>
                    <MainCol xs={6} md={6}>
                        <ImageContainer>
                            {trend && <MainImage src={trend} />}
                        </ImageContainer>
                    </MainCol>
                    <Overlay className="overlay">
                        <MainButton
                            variant="outline-light"
                            onClick={moveTrend}>
                            트렌드 기반 도서 추천
                        </MainButton>
                    </Overlay>
                </MainRow>
                <MainRow>
                    <MainCol xs={6} md={6}>
                        <ImageContainer>
                            <MainText>
                                <h4>키워드 기반 도서 추천</h4>
                                <br />
                                <MainTextP>빅데이터 분석 플랫폼에서 수집된 대출 정보를 기반으로 분석하여</MainTextP>
                                <MainTextP>이번달 키워드를 바탕으로 도서를 추천해드립니다!</MainTextP>
                            </MainText>
                        </ImageContainer>
                    </MainCol>
                    <MainCol xs={6} md={6}>
                        <ImageContainer>
                            {reader && <MainImage src={reader} />}
                        </ImageContainer>
                    </MainCol>
                    <Overlay className="overlay">
                        <MainButton
                            variant="outline-light"
                            onClick={moveKeyword}>
                            키워드 기반 도서 추천
                        </MainButton>
                    </Overlay>
                </MainRow>
            </MainContainer>
            <div style={{paddingBottom: "8rem", backgroundColor: "#FAF7F0"}}>
            </div>
        </Background>
    );
}

const Background = styled.div`
    background-color: #FAF7F0;
    padding-top: 80px
`;


const MainContainer = styled(Container)`
    padding: 0;
`;

const MainCol = styled(Col)`
    padding: 0;
`;

const MainRow = styled(Row)`
    padding: 0;
    margin-bottom: 0.5rem;
    position: relative; /* Overlay 위치를 위해 */
    &:hover .overlay {
        opacity: 1; /* Hover 시 오버레이 나타나기 */
    }
`;

const ImageContainer = styled.div`
    position: relative; /* Positioned for overlay */
`;

const MainImage = styled(Image)`
    width: 98%; /* 컬럼 너비에 맞춤 */
    height: auto; /* 비율 유지 */
    aspect-ratio: 4 / 3; /* 정사각형 비율 */
    object-fit: cover; /* 이미지가 정사각형으로 잘림 */
    border-radius: 15px; /* 둥근 모서리 */
`;

const MainText = styled.div`
    width: 98%; /* 컬럼 너비에 맞춤 */
    height: auto; /* 비율 유지 */
    aspect-ratio: 4 / 3; /* 정사각형 비율 */
    border-radius: 15px; /* 둥근 모서리 */
    background-color: #FAF7F0;
    display: flex; /* flex 컨테이너로 설정 */
    flex-direction: column; /* 세로 방향으로 정렬 */
    justify-content: center; /* 수직 가운데 정렬 */
    align-items: center; /* 수평 가운데 정렬 */
    text-align: center; /* 텍스트 가로 가운데 정렬 */
    padding: 1rem; /* 패딩 추가 */
`;

const MainTextP = styled.p`
    margin: 0; /* 마진 없애기 */
`;

const MainButton = styled(Button)`
    width: 40%;
    margin-left: auto;
    margin-right: auto;
    margin-top: -3%;
    background-color: #6096B4; /* 기본 배경색 */
    color: white; /* 기본 글씨색 */
    border: none; /* 기본 테두리 없애기 */
`;

const Overlay = styled.div`
    width: 99%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.2); /* 반투명 검정색 배경 */
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0; /* 초기 상태에서 보이지 않음 */
    transition: opacity 0.3s ease; /* 부드러운 전환 효과 */
    pointer-events: auto; /* 클릭 이벤트를 받을 수 있도록 설정 */
    border-radius: 15px; /* 둥근 모서리 */
`;

export default Main;
