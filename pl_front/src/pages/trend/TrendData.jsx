// useTrendData.js
import { useEffect, useState } from 'react';
import axios from 'axios';

const fetchTrendingSearches = async () => {
    const response = await axios.get('/api/trends');
    let jsonData = response.data.replace(/.*?\)\]}'\s*,?\s*/, '').trim();

    try {
        return JSON.parse(jsonData);
    } catch (error) {
        console.error("JSON 파싱 오류:", error);
        throw new Error("유효한 JSON 데이터가 아닙니다.");
    }
};

const useTrendData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const result = await fetchTrendingSearches();

                const extractedData = result.default.trendingSearchesDays.flatMap(day =>
                    day.trendingSearches.map(search => ({
                        date: day.date,
                        formattedDate: day.formattedDate,
                        query: search.title.query,
                        formattedTraffic: parseInt(search.formattedTraffic.replace(/[K+]/g, '').trim()) * (search.formattedTraffic.includes('K') ? 1000 : 1), // K가 포함되면 1000을 곱함
                        articles: search.articles.map(article => ({
                            title: article.title,
                            timeAgo: article.timeAgo,
                            source: article.source,
                            snippet: article.snippet,
                            url: article.url,
                            newsUrl: article.image ? article.image.newsUrl : null, // 이미지가 있는 경우에만 가져오기
                            imageUrl: article.image ? article.image.imageUrl : null, // 이미지 URL
                        })),
                    }))
                );


                setData(extractedData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, []);

    return { data, loading, error };
};

export default useTrendData;
