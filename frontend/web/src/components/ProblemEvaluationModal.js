import React from 'react';

import {
    Container,
    Row,
    Col,
    Button,
    Spinner,
    Modal,
    Table
} from 'react-bootstrap';

import {areStringsEqual} from '../utils/core';


export default class ProblemEvaluationModal extends React.Component {
    render() {
        return (
            <>
                <Modal
                    size="xl"
                    show={true}
                >
                    <Container fluid id="loading_overlay">
                        <Row className="justify-content-center align-items-center">
                            <Col xs={12} md={12} lg={12} id="loaders">
                                <>
                                    {
                                        this.props.eval_state.source_pending ? (
                                            [...Array(5)].map((val, i) => {
                                                return (
                                                    <Spinner key={i} animation="grow" />)
                                            })
                                        ) : ('')
                                    }
                                </>
                                <div id="evaluation_message">
                                    <p>
                                        {
                                            this.props.eval_state.source_pending ? ("In curs de evaluare") : ("Evaluare finalizata")
                                        }
                                    </p>
                                </div>
                                <div className="task_info">
                                    {
                                        this.props.eval_state.runtime_err ? (
                                            <p>
                                                {
                                                    this.props.eval_state.runtime_err
                                                }
                                            </p>
                                        ) : (
                                                <>
                                                    <Table bordered>
                                                        <tbody>
                                                            {
                                                                this.props.eval_state.evaluation_info.map(
                                                                    (task, index) => {
                                                                        if (task['compilation_error'])
                                                                            return (
                                                                                <tr key={index}>
                                                                                    <td className="text-danger">
                                                                                        {task['compilation_error']}
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        else
                                                                            return (
                                                                                <tr key={index} className={
                                                                                    (areStringsEqual(task['status'], "OK")) ? "bg-success" : "bg-danger"
                                                                                }>
                                                                                    <td>Test {index + 1}</td>
                                                                                    <td>{task['status']}</td>
                                                                                    <td>
                                                                                        {
                                                                                            task['stderr'] ? task['stderr'] : '-'
                                                                                        }
                                                                                    </td>
                                                                                    <td>{task['time']}</td>
                                                                                    <td>{task['returncode']}</td>
                                                                                </tr>
                                                                            )
                                                                    }
                                                                )
                                                            }
                                                        </tbody>
                                                    </Table>
                                                    {
                                                        this.props.eval_state.overall_score !== null ? (
                                                            <div>Scor : {this.props.eval_state.overall_score} p</div>
                                                        ) :
                                                            ('')
                                                    }
                                                </>
                                            )
                                    }
                                </div>
                            </Col>
                        </Row>
                        <Row className="justify-content-center align-items-center">
                            <Col xs={12}>
                                {
                                    this.props.eval_state.source_pending ?
                                        ('') : (
                                            <p className="text-center p-4">
                                                <Button variant="outline-primary" onClick={() => { this.props.hideOverlay() }}>OK</Button>
                                            </p>
                                        )
                                }
                            </Col>
                        </Row>
                    </Container>
                </Modal>
            </>
        );
    }
}