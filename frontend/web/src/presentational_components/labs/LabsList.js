import React, { useEffect, useContext } from 'react';
import './css/LabsList.css';
import {withCookies} from 'react-cookie';
import {Container,Row,Col,Card} from 'react-bootstrap';
import Header from '../../components/Header';
import FontAwesome from 'react-fontawesome';
import PageScroller from '../../components/PageScroller';


function LabsList(props) {

    let LAB_IMAGES = [
        'lab_img.png',
        'php_lab_image.jpg',
        'python_lab_img.jpg',
        'asset003.jpg',
    ]

    return (
        <Container>
            <Col xs={12}>
                <h2 className="text-center">Laboratoare</h2>
            </Col>
            <Row className="my-4" >
                {
                    [...Array(10)].map((lab, index) => {
                        return (
                            <Col key={index}
                                xs={12}
                                sm={12}
                                md={6}
                                lg={6}
                                className="my-4"
                                onClick={
                                    () => {
                                        window.location.href = `/laboratoare/${34}`
                                    }
                                }
                            >
                                <Card className="lab_card">
                                    <Card.Img className="lab_image" variant="top" src={
                                        require(`../../assets/img/${LAB_IMAGES[index % LAB_IMAGES.length]}`)
                                    } />
                                    <Card.Body>
                                        <Card.Title>
                                            Tutorial name
                                            </Card.Title>
                                        <Card.Text>
                                            Tutorial linux
                                            </Card.Text>
                                        <Card.Text>
                                            Tutorialul nr 1 Linux
                                            </Card.Text>
                                    </Card.Body>
                                    <Card.Footer>

                                    </Card.Footer>
                                </Card>
                            </Col>
                        );
                    })
                }
            </Row>
            <PageScroller />
        </Container>
    );
}


export default LabsList;