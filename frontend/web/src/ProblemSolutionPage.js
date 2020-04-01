import React from 'react';
import {withCookies} from 'react-cookie';
import './ProblemSolutionPage.css'
import {Container,Row,Col,Spinner,Table,Badge} from 'react-bootstrap';
import Header from './components/Header';
import FontAwesome from 'react-fontawesome';
//Ace editor imports
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/webpack-resolver";
import 'brace/ext/language_tools';




export function ProblemDetailsTable (props) {
        return (
            <Table striped bordered className="problem_info_table">
                <caption className="py-2">Detalii problema {props.problem.name}</caption>
                <tbody>
                    <tr>
                        <td><FontAwesome name="layer-group" /></td>
                        <td>
                            <Badge variant="secondary" className="p-2">{props.problem.difficulty}</Badge>
                        </td>
                    </tr>
                    <tr>
                        <td><FontAwesome name="crosshairs" /></td>
                        <td>
                            {
                                props.problem.tags.split(",").map(
                                    (tag, index) => {
                                        return <Badge key={index} variant="primary" className="p-2 m-2">{tag}</Badge>
                                    }
                                )
                            }
                        </td>
                    </tr>
                    <tr>
                        <td><FontAwesome name="calendar" /></td>
                        <td>
                            {`${props.problem.date_posted}`}
                        </td>
                    </tr>
                    <tr>
                        <td><FontAwesome name="user" /></td>
                        <td>{`${props.problem.author.first_name} ${props.problem.author.last_name}`}</td>
                    </tr>
                    <tr>
                        <td><FontAwesome name="clock" /></td>
                        <td>{props.problem.time_limit} s</td>
                    </tr>
                    <tr>
                        <td><FontAwesome name="memory" /></td>
                        <td>{props.problem.memory_limit} MB</td>
                    </tr>
                </tbody>
            </Table>
        );
}





class ProblemSolutionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            solution : {},
            authorized : false,
            solution_found : false,
            network_error : false,
            fetch_pending : false,
        }
    }


    fetchProblemSolution = () => {
        let solution_id = this.props.match.params.solution_id;
        this.setState({fetch_pending:true});
        fetch(
            `${process.env.REACT_APP_API_URL}/api/problem_solutions/${solution_id}/`,
            {
                method: 'get'
            }
        )
            .then(resp => {
               // console.log("DA")
               // console.log(resp.status)
                if(resp.status === 200)
                this.setState({
                    solution_found : true,
                })
                return resp.json()
            })
            .then(
                (resp) => {
                        console.log(resp)
                        this.setState({
                            solution: resp,
                            fetch_pending:false,
                        })
                }
            )
            .catch(err => {console.log(err); this.setState({network_error:true,fetch_pending:false})})
    }



    componentDidMount () {
        this.fetchProblemSolution();
    }
    render () {
        if(this.state.fetch_pending === false)
        return (
            <>
                <Header bgVariant="dark" logged_user={this.props.cookies.get('username')} />
                {
                    this.state.solution_found ? (
                        <Container fluid id="page_wrapper">
                            <Row className="align-items-center justify-content-center">
                                <Col xs={12} className="m-4">
                                    <h2>Sursa #{this.state.solution.id}</h2>
                                </Col>
                                <Col xs={12} lg={2} className="my-4">
                                    <Row className="editor_options_wrapper"> 
                                        <Col xs={3} lg={12} className="editor_option"><FontAwesome name="edit"></FontAwesome></Col>
                                        <Col xs={3} lg={12} className="editor_option"><FontAwesome name="copy"></FontAwesome></Col>
                                        <Col xs={3} lg={12} className="editor_option"><FontAwesome name="download"></FontAwesome></Col>
                                        <Col xs={3} lg={12} className="editor_option"><FontAwesome name="play"></FontAwesome></Col>
                                    </Row>
                                </Col>
                                <Col xs={12} lg={10} className="my-4">
                                    <AceEditor
                                        placeholder=""
                                        mode="c_cpp"
                                        theme="monokai"
                                        width={"100%"}
                                        height={"600px"}
                                        fontSize={16}
                                        readOnly={true}
                                        showPrintMargin={false}
                                        showGutter={true}
                                        highlightActiveLine={false}
                                        value={this.state.solution.source_text}
                                        setOptions={{
                                            enableBasicAutocompletion: false,
                                            enableLiveAutocompletion: false,
                                            enableSnippets: false,
                                            showLineNumbers: true,
                                            tabSize: 4,
                                        }}
                                    />
                                </Col>
                                <Col xs={12} md={8} >
                                    <Table striped bordered  className="source_info_table">
                                        <caption className="py-2">Detalii solutie #{this.state.solution.id}</caption>
                                        <tbody>
                                            <tr>
                                                <td><FontAwesome name="square-root-alt"/></td>
                                                <td>
                                                    <a
                                                        href={`/probleme/${this.state.solution.problem.id}`}>
                                                        {this.state.solution.problem.name}
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><FontAwesome name="user" /></td>
                                                <td>
                                                    <a
                                                    href={`/utilizatori/${this.state.solution.author.username}`}>
                                                    {`${this.state.solution.author.first_name} ${this.state.solution.author.last_name}`}
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><FontAwesome name="calendar" /></td>
                                                <td>{`${this.state.solution.date_posted} ${this.state.solution.time_posted}`}</td>
                                            </tr>
                                            <tr>
                                                <td><FontAwesome name="chart-pie" /></td>
                                                <td>{`${this.state.solution.score} puncte`}</td>
                                            </tr>
                                            <tr>
                                                <td><FontAwesome name="language" /></td>
                                                <td>{this.state.solution.source_type}</td>
                                            </tr>
                                        </tbody>
                                    </Table>






                                    <ProblemDetailsTable problem={this.state.solution.problem} />
                                </Col>
                            </Row>
                        </Container>
                    ) : (
                            this.state.network_error ? (
                                <p>Net err</p>
                            ) : (
                                <p>Not found</p>
                            )
                        
                    )
                }
            </>
        );
        else 
        return (
            <Col xs={12} className="text-center">
                <Spinner animation="grow" />
                <Spinner animation="grow" />
                <Spinner animation="grow" />

            </Col>
        );
    }
}

export default withCookies(ProblemSolutionPage);