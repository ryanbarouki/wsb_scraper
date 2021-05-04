import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LineChart from './components/LineChart'
import {useState, useEffect} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'

function App() {
	const [data, setData] = useState([]);
	const [tickers, setTickers] = useState([]);
	const [chosenTicker, setChosenTicker] = useState('Stock');
	//   const [categories, setCat] = useState([]);	§
	useEffect(() => {
		async function fetchTickers() {
			const rawData = await fetch('/getTickerList');
			const jsonData = await rawData.json();
			setTickers(jsonData.tickers);
		}
		fetchTickers();
	}, []);
	let tickerDropdown = [];
	console.log(tickers);
	tickers.forEach(ticker => tickerDropdown.push(<Dropdown.Item onClick={() => {setChosenTicker(ticker.name)}}>{ticker.name}</Dropdown.Item>))

	useEffect(() => {
		async function fetchData() {
			const rawData = await fetch(`/getTicker/${chosenTicker}`);
			const jsonData = await rawData.json();
			setData(jsonData.data);
		}
		fetchData();
	}, [chosenTicker]);
	return (
		<div className="container">
			<div className="row justify-content-center">
				<h1>
					Wall Street Bets Scraper
				</h1>
			</div>
			<div className="row justify-content-center">
				<Dropdown>
					<Dropdown.Toggle variant="success" id="dropdown-basic">
						Select Ticker
					</Dropdown.Toggle>

					<Dropdown.Menu style={{overflowY: 'scroll', maxHeight: '20rem'}}>
						{tickerDropdown}
					</Dropdown.Menu>
				</Dropdown>
			</div>
			<LineChart data={data} ticker={chosenTicker} />
		</div>
	);
}

export default App;
