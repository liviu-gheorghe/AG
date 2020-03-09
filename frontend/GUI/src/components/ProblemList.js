import React from 'react';
import {  Row } from 'react-bootstrap';

import "./ProblemList.css";


class ProblemList extends React.Component {
    render() {
        return (
<Row className="justify-content-center list_wrapper">
{
["Cautare binara", 
"Suma",
"Arhipelag", 
"Graf Tare Conex",
"Dijkstra",
"Conexiune",
"Orase",
"Weekend",
"Graf Tare Conex",
"Dijkstra",
"Conexiune",
"Orase",
"Weekend",
].map((problem,index) => {
    return (
    <span key={index} className="text-center">
        <a href="#about">{problem}</a>
    </span>
    )
})
}
</Row>
        );
    }
}

export default ProblemList;