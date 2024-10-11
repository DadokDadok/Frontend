import React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function KeywordModal({ show, handleClose, keyword}) {

    const navigate = useNavigate();

    // http://data4library.kr/api/srchBooks?authKey=[발급받은키]&keyword=역사&pageNo=1&pageSize=10


    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>키워드 {keyword}</Modal.Title> {/* 키워드 표시 */}
            </Modal.Header>
            <Modal.Body>
                <Background>
                    <MainContainer>
                        <MainRow>
                            <MainCol xs={4}>
                                <ImageContainer>
                                    <MainText>
                                        <h4>키워드 기반 도서 추천</h4>
                                        <br />
                                        <MainTextP>빅데이터 분석 플랫폼에서 수집된 대출 정보를 기반으로 분석하여</MainTextP>
                                        <MainTextP>이번달 키워드를 바탕으로 도서를 추천해드립니다!</MainTextP>
                                    </MainText>
                                </ImageContainer>
                            </MainCol>
                            <MainCol xs={4}>
                                <ImageContainer>
                                    <MainText>
                                        <h4>키워드 기반 도서 추천</h4>
                                        <br />
                                        <MainTextP>빅데이터 분석 플랫폼에서 수집된 대출 정보를 기반으로 분석하여</MainTextP>
                                        <MainTextP>이번달 키워드를 바탕으로 도서를 추천해드립니다!</MainTextP>
                                    </MainText>
                                </ImageContainer>
                            </MainCol>
                            <MainCol xs={4}>
                                <Overlay className="overlay">
                                    <MainButton onClick={() => navigate('/page1')}>
                                        이동
                                    </MainButton>
                                </Overlay>
                            </MainCol>
                        </MainRow>
                        <MainRow>
                            <MainCol xs={4}>
                                <ImageContainer>
                                </ImageContainer>
                            </MainCol>
                            <MainCol xs={4}>
                                <ImageContainer>
                                    {/* 추가 콘텐츠 */}
                                </ImageContainer>
                            </MainCol>
                            <MainCol xs={4}>
                                <Overlay className="overlay">
                                    <MainButton onClick={() => navigate('/page2')}>
                                        이동
                                    </MainButton>
                                </Overlay>
                            </MainCol>
                        </MainRow>
                    </MainContainer>
                </Background>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default KeywordModal;



const Background = styled.div`
    background-color: #FAF7F0;
    padding-top: 80px;
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
    position: relative;
    &:hover .overlay {
        opacity: 1;
    }
`;

const ImageContainer = styled.div`
    position: relative;
`;

const MainImage = styled(Image)`
    width: 98%;
    height: auto;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border-radius: 15px;
`;

const MainButton = styled(Button)`
    width: 40%;
    margin-left: auto;
    margin-right: auto;
    margin-top: -3%;
    background-color: #6096B4;
    color: white;
    border: none;
`;

const Overlay = styled.div`
    width: 99%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.2);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: auto;
    border-radius: 15px;
`;


const MainText = styled.div`
    width: 98%; /* 컬럼 너비에 맞춤 */
    height: auto; /* 비율 유지 */
    aspect-ratio: 1 / 1; /* 정사각형 비율 */
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