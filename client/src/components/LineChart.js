import React, { useState, useEffect} from 'react'
import Chart from 'react-apexcharts'

function LineChart({data, ticker}) {
    console.log(data);
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
                stroke: {
                    curve: 'smooth'
                },
                xaxis: {
                    type: 'datetime'
                },
                title: {
                    text: `Stock mentions over time`,
                    align: 'center',
                    margin: 20,
                    offsetY: 20,
                    style: {
                        fontSize: "25px"
                    }
                },
                tooltip: {
                    x: {
                      format: 'dd MMM yyyy'
                    }
                }
            });
    const [series, setSeries] = useState([]);
    useEffect(() => {
        setSeries(series => ([
                {
                    name : 'mentions',
                    data : data
                }
            ]));
        setOptions(options => {
            return {...options, title: {
                ...options.title,
                text: `${ticker} mentions over time` 
            }}
        })

    },[data, ticker])
    return (<Chart 
        options = {options}
        series = {series}
        type='line'
        height = '450'
        width = '100%'
    />);
}

export default LineChart;