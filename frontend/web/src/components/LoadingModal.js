import {Spinner,Col} from 'react-bootstrap';
import React from 'react';

export default function LoadingModal(props)
{
    return (
        <Col xs={12} className="text-center">
            <Spinner animation="grow" />
            <Spinner animation="grow" />
            <Spinner animation="grow" />

        </Col>
    );
}
