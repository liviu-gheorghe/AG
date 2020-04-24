import React, { useState, useEffect, useContext } from 'react';
import './css/LabsList.css';
import {withCookies} from 'react-cookie';
import {Container,Row,Col,Button,Modal} from 'react-bootstrap';
import Header from '../../components/Header';
import PageScroller from '../../components/PageScroller';
import {LabCard} from '../../components/Cards';
import  LoadingModal  from '../../components/LoadingModal';
import WebPlayground from './WebPlayground';
import FontAwesome from 'react-fontawesome';
import {useComponentWillMount} from '../../custom_hooks';

function LabsList(props) {

    let LAB_IMAGES = [
        'black_background.jpg',
    ]

    const [labList,setLabList] = useState([]);
    const [showModal,setShowModal] = useState(false);
    const [fetchPending,setFetchPending] = useState(true);
    const [pageData,setPageData] = useState(null);

    function fetchLabList() {
        fetch(`${process.env.REACT_APP_API_URL}/api/labs/`)
        .then(resp=>resp.json())
        .then(resp => {setLabList(resp); setFetchPending(false)})
    }


    useEffect(
        () => {
            setPageData(require('../../assets/strings/labs_list.json'));
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
            {
                fetchPending ? (
                    <Row className="h-100">
                    <LoadingModal />
                    </Row>
                ) : (
                    <Row className = "my-4" >
                        {
                            labList.map((lab, index) => {
                                return (
                                    <LabCard key={index} lab={lab} img_src={LAB_IMAGES[index % LAB_IMAGES.length]} />
                                );
                            })
                        }
                    </Row>
                )
            }
            <Row className="my-4">
            <Col xs={12}>
                <h2 className="text-center my-4">Mod antrenament</h2>
                <p className="text-center">
                    <FontAwesome 
                    style={{
                        fontSize:'60px',
                        cursor:'pointer'
                    }}
                    name="basketball-ball"
                    onClick = {
                        () => {
                            setShowModal(true);
                        }
                    }
                    />
                </p>
            </Col>
            </Row>
            <PageScroller />
        </Container>
      <Modal
        show={showModal}
        size="xl"
        onHide={() => setShowModal(false)}
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <h2 className="text-center">
            Modul antrenament
          </h2>
        </Modal.Header>
        <Container fluid>
        <Row className="justify-content-center">
        {
            pageData ? (     
                pageData['training_modes'].map(
                    (mode, index) => {
                        return (
                            <Col xs={12} md={6} className="text-center my-4" key={index}>
                                <h5 className="mx-4">{mode.name['ro']}</h5>
                                <Button onClick={()=>window.location.href=mode.link['ro']} variant=""><FontAwesome name={mode.icon_name} style={{ fontSize: '50px', color:'#28a745' }} /></Button>
                                <p className="my-4">{mode.description['ro']}</p>
                            </Col>
                        );
                    }
                )
            ): ('')
        }
        </Row>
        </Container>
      </Modal>
        </>
    );
}


export default withCookies(LabsList);