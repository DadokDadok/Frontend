import React, {useState} from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Cell} from 'recharts';
import useTrendData from "./TrendData";
import KeywordBooks from "../../component/KeywordBooks";
import styled from "styled-components";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const TrendChart = () => {
    const {data, loading, error} = useTrendData();
    const [keyword, setKeyword] = useState("");
    const [tooltipData, setTooltipData] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({x: 0, y: 0});
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [showTabs, setShowTabs] = useState(false);
    const [articles, setArticles] = useState([]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const colorPalette = ['#609684', '#93BFCF', '#BDCDD6'];

    const getColorForDate = (date) => {
        const hashCode = date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colorPalette[hashCode % colorPalette.length];
    };

    const chartData = data.map(day => ({
        name: day.query,
        value: day.formattedTraffic,
        date: day.date,
        color: getColorForDate(day.date),
    }));

    const articlesData = data.map(item => ({
        query: item.query,
        articles: item.articles || [],
    }));

    const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    const decodeHtml = (html) => {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = html;
        return textArea.value;
    };

    const handleBarClick = (entry) => {
        setKeyword(entry.name);
    };

    const handleOverlayClick = (entry) => {
        setKeyword(entry.name);
        setShowTabs(true);

        const selectedArticles = articlesData.find(item => item.query === entry.name)?.articles || [];
        setArticles(selectedArticles);
    };

    const uniqueDates = [...new Set(chartData.map(entry => entry.date))];
    const totalValue = chartData.reduce((sum, entry) => sum + entry.value, 0);
    const averageValue = totalValue / chartData.length;

    const chartWidth = 1100;
    const chartHeight = 450;
    const barHeight = chartHeight - (chartHeight * 0.285);
    const barWidth = (chartWidth - (chartWidth / 10)) / chartData.length;
    const barBottom = (chartHeight * 0.265);

    return (
        <Background>
            <TypoWrap>
                <TypographyTitle>
                    <TitleText>오늘의 트렌드 키워드</TitleText>
                    <HorizontalLine/>
                </TypographyTitle>
                <TypographyText>
                    구글 트렌드 데이터를 기반으로 인기 검색어와 해당 검색어의 검색량을 보여드립니다.<br/>
                    관심이 가는 키워드의 그래프를 클릭하시면, <br/>
                    해당 키워드와 관련된 도서 추천과 해당 트렌드와 관련된 기사를 조회하실 수 있습니다.<br/>
                    검색량은 1,000 단위로 표시됩니다.
                </TypographyText>
            </TypoWrap>
            <TrendChartWrap>
                <BarChart
                    width={chartWidth}
                    height={chartHeight}
                    data={chartData}
                    margin={{top: 20, right: 30, left: 20, bottom: 5}}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name" angle={-45} textAnchor="end"/>
                    <YAxis domain={[0, averageValue]} tickFormatter={formatNumber}/>
                    <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        wrapperStyle={{paddingTop: "50px"}}
                        payload={uniqueDates.map((date, index) => ({
                            value: date,
                            type: 'bar',
                            id: `id-${index}`,
                            color: getColorForDate(date),
                        }))}
                    />
                    <Bar dataKey="value" barSize={20}>
                        {chartData.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={entry.color}
                                onClick={() => handleBarClick(entry)}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </TrendChartWrap>
            <OverlayParent>
                <OverlayLayerWrap>
                    {chartData.map((entry, index) => (
                        <OverlayLayer
                            key={index}
                            style={{
                                width: `${barWidth}px`,
                                height: `${barHeight}px`,
                                bottom: `${barBottom}px`,
                                left: `${index * barWidth}px`,
                                backgroundColor: hoveredIndex === index ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0)',
                                transition: 'background-color 0.2s ease',
                            }}
                            onMouseEnter={() => {
                                setTooltipData(entry);
                                setHoveredIndex(index);
                            }}
                            onMouseLeave={() => {
                                setTooltipData(null);
                                setHoveredIndex(null);
                            }}
                            onMouseMove={(e) => {
                                setTooltipPosition({x: e.clientX, y: e.clientY});
                            }}
                            onClick={() => handleOverlayClick(entry)}
                        >
                            {tooltipData && tooltipData.name === entry.name && (
                                <TooltipWrapper
                                    style={{
                                        left: 15,
                                        top: tooltipPosition.y - barHeight / 1.2,
                                    }}
                                >
                                    {tooltipData.name}: {formatNumber(tooltipData.value)}
                                </TooltipWrapper>
                            )}
                        </OverlayLayer>
                    ))}
                </OverlayLayerWrap>
            </OverlayParent>
            {showTabs && (
                <KeywordBookList>
                    <Tabs
                        defaultActiveKey="recommend"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                        style={{marginLeft: "3rem"}}
                    >
                        <Tab eventKey="recommend" title="도서 추천">
                            {keyword && <KeywordBooks keyword={keyword}/>}
                        </Tab>
                        <Tab eventKey="article" title="신문 기사">
                            <NewsListWrap>
                                {articles.length > 0 ? (
                                    articles.map((article, index) => (
                                        <ArticleDetail key={index}>
                                            <ArticleWrap>
                                                <ArticleImgWrap onClick={() => window.open(article.url, '_blank')}>
                                                    <ArticleImgDiv>
                                                        {article.imageUrl ? (
                                                            <ArticleImg src={article.imageUrl} alt={article.title}/>
                                                        ) : (
                                                            <ArticleImg src="/img/dadok_logo.png" alt={article.title}/>
                                                        )}
                                                    </ArticleImgDiv>
                                                </ArticleImgWrap>
                                                <ArticleInfo>
                                                    <Title>{decodeHtml(article.title)}</Title>
                                                    <Addr>{article.timeAgo} - {article.source}</Addr>
                                                    <Snippet>{decodeHtml(article.snippet)}</Snippet>
                                                    <a onClick={() => window.open(article.url, '_blank')}>더보기</a>
                                                </ArticleInfo>
                                            </ArticleWrap>
                                        </ArticleDetail>
                                    ))
                                ) : (
                                    <p>기사를 선택하세요.</p>
                                )}
                            </NewsListWrap>
                        </Tab>
                    </Tabs>
                </KeywordBookList>
            )}
        </Background>
    );
};

export default TrendChart;

// 스타일 컴포넌트 정의
const TypoWrap = styled.div`
    z-index: 0;
    pointer-events: none;
    width: 100%;
    padding-top: 1rem;
    height: 12rem;
`;

const TypographyTitle = styled.div`
    height: 3.5rem;
    padding-left: 3rem;
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
`;

const TitleText = styled.h1`
    width: 35rem;
`;

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

const OverlayLayer = styled.div`
    position: absolute;
    cursor: pointer;
    z-index: 100;
`;

const OverlayLayerWrap = styled.div`
    position: relative;
    width: 100%;
`;

const OverlayParent = styled.div`
    display: flex;
    justify-content: center;
    position: relative;
    width: 900px;
    left: 50%;
    transform: translateX(-50%);
    margin-left: -20px;
    height: 10px;
`;

const TooltipWrapper = styled.div`
    position: absolute;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px;
    border-radius: 5px;
    z-index: 200;
    width: auto;
    max-width: 120px;
    white-space: nowrap;
    pointer-events: none;
    transition: left 0.2s ease, top 0.2s ease;
`;

const Background = styled.div`
    padding-top: 80px;
`;

const TrendChartWrap = styled.div`
    display: flex;
    justify-content: center;
    position: relative;
    width: 1100px;
    overflow: hidden;
    left: 50%;
    transform: translateX(-50%);
`;

const KeywordBookList = styled.div`
    z-index: 100;
    background-color: #FAF7F0;
    padding-top: 5rem;
`;

const NewsListWrap = styled.div`
    margin-left: 3rem;
    padding-bottom: 10rem;
`;

const ArticleDetail = styled.div`
    margin-bottom: 1rem;
`;

const ArticleWrap = styled.div`
    background-color: #FAF7F0;
    padding: 1rem;
    display: flex;
    align-items: center;
`;

const ArticleImgWrap = styled.div`
    text-align: center;
    margin-left: 1rem;
    cursor: pointer;
`;

const ArticleImgDiv = styled.div`
    display: table-cell;
    vertical-align: middle;
`;

const ArticleImg = styled.img`
    width: 10rem;
    height: 10rem;
    border-radius: 10%;
`;

const ArticleInfo = styled.div`
    padding-left: 1rem;
    cursor: pointer;
`;

const Title = styled.p`
    margin: 5px 0 0 0;
    font-weight: bold;
`;

const Addr = styled.p`
    margin: 0;
    font-size: 80%;
    color: #808080;
`;

const Snippet = styled.p`
    margin: 0.5rem 0;
`;

