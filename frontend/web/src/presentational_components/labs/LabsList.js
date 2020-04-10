import React, { useState, useEffect, useContext } from 'react';
import './css/LabsList.css';
import {withCookies} from 'react-cookie';
import {Container,Row,Col,Card} from 'react-bootstrap';
import Header from '../../components/Header';
import PageScroller from '../../components/PageScroller';
import {LabCard} from '../../components/Cards';

function LabsList(props) {

    let LAB_IMAGES = [
        'black_background.jpg',
    ]

    const [labList,setLabList] = useState([]);

    function fetchLabList() {
        fetch(`${process.env.REACT_APP_API_URL}/api/labs/`)
        .then(resp=>resp.json())
        .then(resp => setLabList(resp))
    }

    useEffect(
        () => {
            fetchLabList();
        }, []
    );

    return (
        <>
        <Header logged_user={props.cookies.get('username')}/>
        <Container>
            <Col xs={12} className="my-4">
                <h2 className="text-center">Laboratoare</h2>
            </Col>
            <Row className="my-4" >
                {
                    labList.map((lab, index) => {
                        return (
                            <LabCard key={index}  lab={lab} img_src={LAB_IMAGES[index%LAB_IMAGES.length]}/>
                        );
                    })
                }
            </Row>
            <PageScroller />
        </Container>
        </>
    );
}


export default withCookies(LabsList);