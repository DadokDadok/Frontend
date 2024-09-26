import * as React from 'react';
import { useEffect, useState } from "react";
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
            console.log("Success:", res);
            setResponseMessage(res.data);
        } catch (error) {
            console.error("Error submitting data:", error);
            setResponseMessage("Error submitting data.");
        }
    };

    const handleGetInput = async () => {
        try {
            const res = await axios.get(`/api/get/${inputValue}`);
            setResponseMessage(res.data);
        } catch (error) {
            console.error("Error fetching input:", error);
            setResponseMessage("Error fetching input.");
        }
    };

    const handleCreateInput = async () => {
        try {
            await axios.post(`/api/post/${inputValue}`);
            setResponseMessage("Input created successfully.");
        } catch (error) {
            console.error("Error creating input:", error);
            setResponseMessage("Error creating input.");
        }
    };

    const handleUpdateInput = async () => {
        try {
            await axios.put(`/api/put/${inputValue}`);
            setResponseMessage("Input updated successfully.");
        } catch (error) {
            console.error("Error updating input:", error);
            setResponseMessage("Error updating input.");
        }
    };

    const handleDeleteInput = async () => {
        try {
            await axios.delete(`/api/delete/${inputValue}`);
            setResponseMessage("Input deleted successfully.");
        } catch (error) {
            console.error("Error deleting input:", error);
            setResponseMessage("Error deleting input.");
        }
    };

    return (
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
                <button onClick={handleGetInput}>Get Input</button>
                <button onClick={handleCreateInput}>Create Input</button>
                <button onClick={handleUpdateInput}>Update Input</button>
                <button onClick={handleDeleteInput}>Delete Input</button>
                <div>
                    <h2>서버 응답:</h2>
                    <p>{responseMessage}</p>
                </div>
            </div>
        </>
    );
}