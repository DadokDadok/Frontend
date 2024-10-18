import * as React from 'react';
import styled from "styled-components";

function Footer() {
    return (
        <Rights>
            <RightsP>ⓒ박상은, 2024</RightsP>
            <RightsP>ⓒ행정안전부 ©동네서점지도 ©bookshopmap.com. All rights reserved.</RightsP>
        </Rights>
    );
}

export default Footer;

const Rights = styled.div`
    position: fixed; /* 고정 위치로 설정 */
    bottom: 0; /* 화면 아래에 위치 */
    left: 50%; /* 왼쪽 기준으로 */
    transform: translateX(-50%); /* 가운데 정렬을 위해 수평 이동 */
    display: flex; /* flexbox로 설정 */
    flex-direction: column; /* 세로 방향으로 정렬 */
    align-items: center; /* 가운데 정렬 */
    width: 100%; /* 전체 너비 */
    height: 7rem;
    padding: 10px 0; /* 상하 여백 추가 */
    background-color: #EEE9D4; /* 배경 색상 추가 (선택 사항) */
    z-index: 100;
`;

const RightsP = styled.p`
    margin: 0;
    font-size: 0.8rem;
    text-align: center; /* 텍스트 가운데 정렬 */
`;
