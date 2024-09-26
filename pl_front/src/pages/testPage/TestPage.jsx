import * as React from 'react';
import {useEffect, useState} from "react";
import axios from "axios";

export default function TestPage() {
    const [data, setData] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await axios.get(`/api/test/1`);
                setData(result.data);
                console.log(result.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, []);

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            const res = await axios.post('/api/test/submit', { input: inputValue });
            console.log("sussess", res);
            setResponseMessage(res.data);
        } catch (error) {
            console.error("Error submitting data:", error);
            setResponseMessage("Error submitting data.");
        }
    };

    return(
        <>
            <div>
                <h1>서버 Get 응답:</h1>
                <p>{data}</p>
            </div>
            <div>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    placeholder="Enter something"
                />
                <button onClick={handleSubmit}>Submit</button>
                <div>
                    <h2>서버 Post 응답:</h2>
                    <p>{responseMessage}</p>
                </div>
            </div>
        </>

    );


}

