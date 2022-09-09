import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useState } from "react";
import socketIOClient from 'socket.io-client';
import { numberWithCommas } from "../helper";
import PriceContext from "./PriceContext";

const socket = socketIOClient("wss://api.kaspa.org/", {
    path: '/ws/socket.io'
});


const CBox = () => {
    const [circCoins, setCircCoins] = useState("-");
    const [isConnected, setIsConnected] = useState(false);
    const { price } = useContext(PriceContext);

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('coinsupply', (e) => {
            setCircCoins(Math.round(parseFloat(e.circulatingSupply)/100000000))
        })

        // join room to get updates
        socket.emit("join-room", "coinsupply")


        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('coinsupply');
        };
    }, [])


    useEffect(() => {
        document.getElementById('coins').animate([
            // keyframes
            { opacity: '1' },
            { opacity: '0.6' },
            { opacity: '1' },
          ], {
            // timing options
            duration: 300
          });
    }, [circCoins])


    return <>
        <div className="cardBox mx-0 mx-sm-5">
            <table>
                <tr>
                    <td colspan='2' className="text-center" style={{ "font-size": "4rem" }}>
                        <FontAwesomeIcon icon={faCoins} />
                        <div id="light1" className="cardLight" />
                    </td>
                </tr>
                <tr>
                    <td colspan="2" className="text-center">
                        <h3>Coin supply</h3>
                    </td>
                </tr>
                <tr>
                    <td className="cardBoxElement">
                        Circulating</td>
                    <td>
                        <div id="coins" className="utxo-value">{numberWithCommas(circCoins)} KAS
                        </div>
                    </td>
                </tr>
                <tr>
                    <td className="cardBoxElement">Total ~</td>
                    <td className="utxo-value">28,700,000,000 KAS</td>
                </tr>
                <tr>
                    <td className="cardBoxElement">Mined</td>
                    <td className="utxo-value">{(circCoins/28700000000*100).toFixed(2)} %</td>
                </tr>
                <tr>
                    <td className="cardBoxElement">MCAP</td>
                    <td className="utxo-value">${(circCoins*price / 1000000).toFixed(2)} M</td>
                </tr>
            </table>
        </div>
    </>
}


export default CBox