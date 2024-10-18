import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import axios from "axios";
import KeywordBooks from "../../component/KeywordBooks";

const KeywordCloud = () => {
    const svgRef = useRef();
    const [keyword, setKeyword] = useState(null);
    const [year, setYear] = useState();
    const [month, setMonth] = useState();

    useEffect(() => {
        const fetchKeywords = async () => {
            const { year, month } = getLastMonth();
            try {
                const response = await axios.get(`https://data4library.kr/api/monthlyKeywords?authKey=${process.env.REACT_APP_LIBRARY_CLIENT_KEY}&format=json&month=${year}-${month}`);

                const words = response.data.response.keywords.map(({ keyword }) => ({
                    text: keyword.word,
                    size: Math.sqrt(keyword.weight) * 7
                }));

                const layout = cloud()
                    .size([1200, 400])
                    .words(words)
                    .padding(5)
                    .rotate(() => (Math.random() > 0.5 ? 90 : 0))
                    .fontSize(d => d.size)
                    .font("sans-serif")
                    .on("end", draw);

                layout.start();

                function draw(words) {
                    d3.select(svgRef.current).selectAll("*").remove();

                    const g = d3.select(svgRef.current)
                        .append("g")
                        .attr("transform", "translate(600, 200)");

                    g.selectAll("text")
                        .data(words)
                        .enter().append("text")
                        .style("font-size", d => `${d.size}px`)
                        .style("fill", (d, i) => d3.schemeCategory10[i % 10])
                        .attr("text-anchor", "middle")
                        .attr("transform", d => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`)
                        .text(d => d.text)
                        .on("mousedown", (event, d) => {
                            event.preventDefault();
                            handleKeywordClick(d.text);
                        })
                        .style("cursor", "default");
                }
            } catch (error) {
                console.error("Error fetching keywords", error);
            }
        };

        fetchKeywords();
    }, []);

    const handleKeywordClick = (keyword) => {
        setKeyword(keyword);
    }

    const getLastMonth = () => {
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
        const year = lastMonth.getFullYear();
        const month = String(lastMonth.getMonth() + 1).padStart(2, '0');
        setYear(year);
        setMonth(month);
        return { year, month };
    };

    return (
        <Background>
            <TypoWrap>
                <TypographyTitle>
                    <TitleText>
                        이 달의 키워드
                    </TitleText>
                     <HorizontalLine />
                </TypographyTitle>
                <TypographyText>
                    {year}년 {month}월 기준으로 빅데이터 분석 플랫폼에서 수집된 서지 정보를 기반으로 분석된 <br />
                    핵심 키워드와 각 단어들이 가진 가중치를 보여드립니다.<br />
                    관심이 가는 키워드를 클릭하시면 해당 키워드와 관련된 도서를 추천해드립니다.
                </TypographyText>
            </TypoWrap>
            <TypographyContainer>
                <svg ref={svgRef} width="80rem" height="400px"></svg>
            </TypographyContainer>
            <KeywordBookList>
                {keyword && <KeywordBooks keyword={keyword} />}
            </KeywordBookList>
        </Background>
    );
};

export default KeywordCloud;

const TypographyContainer = styled.div`
    display: flex;
    width: 100%;
    padding-top: 2rem;
    height: auto;
    justify-content: center;
    text-align: center;
    padding-bottom: 5rem;
    background-color: #FAF7F0;
    z-index: 100;
    position: relative;
`;

const TypoWrap = styled.div`
    z-index: 0;
    pointer-events: none;
    width: 100%;
`;

const TypographyTitle = styled.div`
    padding-top: 1rem;
    height: 3.5rem;
    padding-left: 3rem;
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
`;

const TitleText = styled.h1`
    width: 22rem;
`

const HorizontalLine = styled.hr`
    margin: 3px;
    width: 110%;
`;

const TypographyText = styled.p`
    width: 100%;
    height: 3.5rem;
    padding-left: 3rem;
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
`;

const KeywordBookList = styled.div`
    z-index: 100;
    background-color: #FAF7F0;
`;

const Background = styled.div`
    padding-top: 80px;
`;
