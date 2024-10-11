import React, { useState } from 'react';
import KeywordFetcher from './KeywordFetcher';
import styled from "styled-components";
import KeywordCloud from "./KeywordCloud"; // KeywordAnalysis 컴포넌트 경로

const KeywordView = () => {
    const [keywords, setKeywords] = useState([]);

    const handleKeywordsFetch = (fetchedKeywords) => {
        setKeywords(fetchedKeywords);
    };

    return (
        <Background>
            <KeywordFetcher onFetch={handleKeywordsFetch} />
            <KeywordCloud keywords={keywords} />
        </Background>
    );
};

export default KeywordView;

const Background = styled.div`
    background-color: #FAF7F0;
    padding-top: 80px
`;
