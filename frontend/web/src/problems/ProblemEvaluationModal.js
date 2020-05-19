import React from 'react';

import {
    Container,
    Row,
    Col,
    Button,
    Table
} from 'react-bootstrap';

import LoadingModal from '../components/LoadingModal';
import './ProblemEvaluationModal.css'


class ProblemEvaluationModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            short_compilation_error_message: null,
        }
    }


    componentDidMount() {
        document.body.style.overflow = 'hidden';

    }

    shouldComponentUpdate(nextProps,nextState) {
        if(this.props === nextProps && this.state === nextState) return false;
        return true;
    }
    componentDidUpdate() {
        try {
            let compilation_error_message = this.props.evaluation_data.tests[0].compilation_error;
            if (!this.state.expand_error_message && !this.state.short_compilation_error_message)
            if(compilation_error_message.length > 512)
            {
                this.setState({
                    short_compilation_error_message: compilation_error_message.substr(0,512)+"..."
                });
            }
        } catch (error) {
        }
    }
    componentWillUnmount() {
        document.body.style.overflow = 'auto';
    }

    render() {
        if(this.props.source_pending === true) {
            return (
                <Container fluid className="loading_overlay">
                    <Row className="justify-content-center align-items-center">
                        <LoadingModal />
                    </Row>
                </Container>
            );
        }
        else if (this.props.evaluation_data === undefined) {
            return (
                <Container fluid className="loading_overlay">
                    <Row className="justify-content-center align-items-center" style={{height:'100vh'}}>
                        <Col xs={12} className="text-center">
                            <p>A aparut o eroare in procesul de evaluare a solutiei.Te rugam incearca mai tarziu</p>
                            <img className="gif_placeholder" src={require('../assets/img/gifs/socket.gif')}  alt=""/>   
                        </Col>
                        <Col xs={12} className="text-center">
                            <Button
                                style={{ width: '100px' }}
                                variant="outline-primary"
                                onClick={() => { this.props.hideOverlay() }}>OK
                            </Button>
                        </Col>
                    </Row>
                </Container>
            );
        }
        else return (
            <Container fluid className="loading_overlay">
                <Row style={{ overflowX: 'auto' , height:'100vh' }}>
                    <Col xs={12} md={6} className="tests_table_wrapper d-flex flex-column align-items-center justify-content-center">
                        {
                            this.props.evaluation_data.tests[0] && this.props.evaluation_data.tests[0]['compilation_error'] ? (
                                <>
                                <h2 className="text-dark">Eroare de compilare</h2>
                                {
                                    this.state.short_compilation_error_message ? (
                                    <>
                                        <span 
                                            className="text-danger p-2"
                                            style={{ overflowY: 'auto' }}
                                        >
                                            {this.state.short_compilation_error_message}
                                        </span>

                                        <Button
                                            onClick = {
                                                () => {
                                                this.setState({
                                                    short_compilation_error_message: null,
                                                    expand_error_message:true
                                                });
                                            }}
                                        >
                                            Vezi mesajul complet
                                        </Button>
                                    </>

                                    ) : (
                                        <>
                                            <span 
                                                className = "text-danger p-2" 
                                                style = {{ overflowY: 'auto' }}
                                            >
                                                {this.props.evaluation_data.tests[0]['compilation_error']}
                                            </span>
                                            {
                                                this.props.evaluation_data.tests[0]['compilation_error'].length > 512 ? (
                                            <Button
                                                onClick={
                                                    () => {
                                                        this.setState({
                                                            short_compilation_error_message: null,
                                                            expand_error_message: false
                                                        });
                                                    }}
                                            >
                                                Restrangere mesaj
                                            </Button> 
                                                ) : (
                                                    '' 
                                                )
                                            }
                                           
                                        </>
                                    )
                                }
                                </>
                            ) : (
                        <Table variant="light" bordered striped responsive>
                        <thead className="text-center">
                            <td>Test</td>
                            <td>Erori</td>
                            <td>Timp de executare</td>
                            <td>Status</td>
                            <td>Cod de iesire</td>

                        </thead>
                        <tbody>
                        {
                            this.props.evaluation_data.tests.map(
                                (test,index) => {
                                    return (
                                        <tr className="text-center" key={index}>
                                            <td>{index}</td>
                                            <td className="text-danger">{(test.stderr) ? test.stderr : '-' }</td>
                                            <td>{test.time}</td>
                                            <td>{test.status}</td>
                                            <td>{test.returncode}</td>
                                        </tr>
                                    );
                                }
                            )
                        }
                        </tbody>
                        </Table>                                
                            )
                        }

                    </Col>
                    <Col xs={12} md={6} className="stats_details_wrapper d-flex flex-column align-items-center justify-content-center">
                    <p>Scor : {this.props.evaluation_data.score}</p>
                        <p className="p-4">
                            <Button
                                style={{ width: '100px'}}
                                variant="outline-primary"
                                onClick={() => { this.props.hideOverlay() }}>OK
                            </Button>
                        </p>
                    </Col>
                </Row>
            </Container>
        );
    }
}
export default ProblemEvaluationModal;
