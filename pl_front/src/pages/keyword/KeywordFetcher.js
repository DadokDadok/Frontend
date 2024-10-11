import React, { useEffect, useState } from 'react';
import axios from 'axios';
import keywordData from './keyword.xml';

const KeywordFetcher = ({ onFetch }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchKeywords = async () => {
        try {

            // 요청해서 받는 방법
            // const fetchKeywords = async () => {
            //     try {
            //         const url = `http://data4library.kr/api/monthlyKeywords?authKey=${key}&month=2024-09`;
            //         const response = await axios.get(url);
            //         setData(response.data);
            //         const parsedKeywords = parseXMLtoKeywords(data);
            //         onFetch(parsedKeywords);
            //     } catch (err) {
            //         setError("Error fetching data");
            //     } finally {
            //         setLoading(false);
            //     }
            // };
            //
            //
            // fetchKeywords();

            const response = await fetch(keywordData);
            const text = await response.text();
            const parsedKeywords = parseXMLtoKeywords(text);
            onFetch(parsedKeywords);
        } catch (err) {
            setError("Error fetching data");
        } finally {
            setLoading(false);
        }
    };

    const parseXMLtoKeywords = (xmlString) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");

        const keywords = Array.from(xmlDoc.getElementsByTagName('keyword'));

        return keywords.map(keyword => {
            const word = keyword.getElementsByTagName('word')[0].textContent.trim();
            const weight = parseFloat(keyword.getElementsByTagName('weight')[0].textContent.trim());
            const link = keyword.getElementsByTagName('word')[0].textContent.trim();
            return { keyword: word, weight: weight, link: link };
        });
    };

    useEffect(() => {
        fetchKeywords();
    }, []); // 데이터 fetching을 한 번만 수행

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return null;
};

export default KeywordFetcher;