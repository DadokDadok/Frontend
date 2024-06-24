import * as React from 'react';
import {useEffect, useState} from "react";
import axios from "axios";

export default function TestPage() {

    const [data, setData] = useState([null]);

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await axios.get(`/test/1`);
                setData(result.data);
                console.log(result.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();

    }, []);

    return(
        <>
            {data}
        </>

    );


}

