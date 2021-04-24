import React, { useState, useEffect} from 'react'
import Chart from 'react-apexcharts'

function LineChart({data, categories}) {
    console.log(data);
    console.log(categories);
    const [options, setOptions] = useState({
                chart: {
                    background: '#282c34',
                    foreColor: '#fff',
                    zoom: {
                        enabled: false
                    },
                    toolbar: {
                        show: false
                    }
                },
                xaxis: {
                    categories: categories
                },
                title: {
                    text: 'Chart title',
                    align: 'center',
                    margin: 20,
                    offsetY: 20,
                    style: {
                        fontSize: "25px"
                    }
                }
            });
    const [series, setSeries] = useState([]);
    useEffect(() => {
        setOptions(options => ({...options, xaxis: {
            categories: categories
            } 
        }))

        setSeries(series => ([
                {
                    name : 'Sample data',
                    data : data
                }
            ]))

    },[data, categories])
    return (<Chart 
        options = {options}
        series = {series}
        type='line'
        height = '450'
        width = '100%'
    />);
}

export default LineChart;