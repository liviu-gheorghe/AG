import React  from 'react';
import { withCookies } from 'react-cookie';
import PageScroller from './components/PageScroller';
import {Container,Row,Col,Button,Card,Badge,Tab,Nav} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Header from './components/Header';
import {ProblemSolutionCard} from './components/Cards';
import ProblemEvaluationModal from './components/ProblemEvaluationModal';
//import Page404 from './components/Page404';
import {ProblemDetailsTable} from './components/ProblemDetailsTable';
import './ProblemPage.css';
//Ace editor imports
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/webpack-resolver";
import 'brace/ext/language_tools';

import {capitalizeString} from './utils/core';




         
class ProblemPage extends React.Component {
          
    // Ace modes used for text editor highlighting
    ACE_MODES = {
    "c++"        : "c_cpp",
    "c"          : "c_cpp",
    "java"       : "java",
    "python"     : "python",
    "javaScript" : "javascript",
    'ruby'       : "ruby",
    }
          
    constructor(props) {
        super(props);
        this.state = {
            unauthorized:false,
            problem : null,
            languages: [],
            source_text:  ``,
            current_language:"C++",
            editor_mode:'c_cpp',
            evaluation : {
                evaluation_info: [],
                evaluation_overlay: false,
                source_pending: false,
            },
            problem_solutions : [],
        };
    }


    areStringsEqual = (str1,str2) => {
        return !str1.localeCompare(str2);
    }

    closeOverlay = () => {
        this.setState({
            evaluation: {
                evaluation_info: [],
                evaluation_overlay: false,
                source_pending: false,
            }
    });
    }


    fetchSnippets = () => {
        fetch(
            `${process.env.REACT_APP_API_URL}/api/languages/`,
            {
                method : 'GET',
            }
        )
        .then(
            resp => resp.json()
        )
        .then(
            resp => {
                this.setState({
                    languages : resp,
                });
            })
    }


    fetchProblemSolutions = () => {
        let problem_id = this.props.match.params.problem_id;
        fetch(
            `${process.env.REACT_APP_API_URL}/api/problem_solutions/?author=self&problem=${problem_id}`,
            {
                method: 'get',
                headers: {
                    "Authorization" : `Token ${this.props.cookies.get('auth_token')}`,
                }
            }
        )
        .then(
            resp => {
                if(resp.status === 401)
                {
                    console.log("AICI");
                    this.setState({
                        unauthorized : true,
                    })
                }
                else
                return resp.json()
            }
        )
        .then(
            (resp) =>
                {
                    if(this.state.unauthorized === false)
                    {
                    console.log(resp)
                    //console.log("Setting up problems");
                    this.setState({
                        problem_solutions : resp
                    })
                    }
                    else 
                    {
                       // console.log("It seems that you're not authorized");
                    }
                }
        )
        .catch(err => console.error(err))
    }

            
    fetchProblemData = (problem_id) => {
        fetch(
            `${process.env.REACT_APP_API_URL}/api/problems/${problem_id}/`,
            {
                method: 'GET',
            }
        )
        .then(
            resp => resp.json()
        )
        .then(
            resp => {
            this.setState({
                problem : resp,
            });
        })
        .catch(err => {console.log(err)})
    }

    toggleSelectedLanguage = lang => {
        this.updateSourceText(lang.default_snippet);
        this.setState({
            current_language: lang.name,
            editor_mode: this.ACE_MODES[lang.name],
        });
    }
             
    updateSourceText = new_source_text => {
        this.setState({
            source_text: new_source_text,
        });
    }
             
    updateInput = event => {
        this.setState({
            std_input: event.target.value,
        });
    }
             

    denySending = () => {
        alert("Pentru a trimite solutii trebuie sa fii conectat");
    }

    sendSolution = () => {
        this.setState({
            evaluation: {
                evaluation_overlay: true,
                source_pending: true,
                evaluation_info: [],
                overall_score : null,
                runtime_err : null,
            },
        });
        var language_extension = this.state.current_language.toLowerCase();
        fetch(
            `${process.env.REACT_APP_API_URL}/evaluate/`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${this.props.cookies.get('auth_token')}`
                },
                body: JSON.stringify({
                    "source_text": this.state.source_text.replace(/'/g, `"`),
                    "type_of_source": language_extension,
                    "problem_id": this.state.problem.id, 
                    "problem_name" : this.state.problem.name,
                    "time_limit": this.state.problem.time_limit,
                    "memory_limit": this.state.problem.memory_limit
                }),
            }
        )
        .then(
            resp => {
                console.log(resp.status);
                return resp.json();
            }
        )
        .then(
            resp_json => {
                console.log(resp_json);
                this.setState({
                        evaluation: {
                            source_pending: false,
                            evaluation_overlay: true,
                            evaluation_info: resp_json['tests'],
                            overall_score : resp_json['score'],
                            runtime_err : resp_json['message'],
                        },
                });
            }
        )
        .catch(
            err => {
                console.log(err);
                this.setState({
                    evaluation: {
                        source_pending: false,
                        evaluation_overlay: true,
                        evaluation_info: [],
                    },
                });
            }
        )
    }

    componentDidMount () {
        // fetch problem data from the API 
        this.fetchProblemData(this.props.match.params.problem_id);
        // fetch code snippents from the API
        this.fetchSnippets();
        //fetch current problem solutions from the API
        if (!this.props.cookies.get('auth_token')) {
            this.setState({
                unauthorized: true,
            })
        }
        if (!this.state.unauthorized) {
            console.log("Fetching problem solutions");
            this.fetchProblemSolutions();
        }
    }
    render() {
        if (this.state.problem && !this.state.problem.detail)
            return (
                <div style={{"position": "relative"}}>
                    <Header logged_user={this.props.cookies.get('username')} />
                    <Container>
                        <Row className="justify-content-center">
                            <Col xs={12} className="problem_statement_wrapper">

                                <Tab.Container defaultActiveKey="first">
                                    <Row>
                                        <Col sm={12}>
                                            <Nav variant="pills" className="justify-content-center">
                                                <div>
                                                    <Nav.Link eventKey="first" className="text-center">Descriere</Nav.Link>
                                                </div>
                                                <div>
                                                    <Nav.Link eventKey="second" className="text-center">Explicatii/Indicatii</Nav.Link>
                                                </div>
                                                <div>
                                                    <Nav.Link eventKey="third" className="text-center">Detalii problema</Nav.Link>
                                                </div>
                                            </Nav>
                                        </Col>
                                        <Col sm={12} className="my-4">
                                            <Tab.Content>
                                                <Tab.Pane eventKey="first">
                                                    <h2 className="text-primary"><Badge variant="primary" className="p-2">{this.state.problem.name}</Badge></h2>
                                                    <h2>Descrierea problemei</h2>
                                                    <p>{this.state.problem.description}</p>
                                                    <h2>Date de intrare </h2>
                                                    <p>{this.state.problem.std_input}</p>
                                                    <h2>Date de iesire </h2>
                                                    <p>{this.state.problem.std_output}</p>
                                                    <h2>Restrictii si precizari</h2>
                                                    <div>{this.state.problem.restrictions}</div>
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="second" className="text-center">
                                                    {
                                                        this.state.problem.explanations_and_indications ? (
                                                            <div>{this.state.problem.explanations_and_indications}</div>
                                                        ):
                                                        (
                                                            <>
                                                            <p>Nu exista explicatii/indicatii pentru aceasta problema</p>
                                                            <img className="gif_placeholder" src={require(`./assets/img/gifs/nif00.gif`)} />
                                                            </>
                                                        )
                                                    }
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="third">
                                                <ProblemDetailsTable problem={this.state.problem}/>
                                                </Tab.Pane>
                                            </Tab.Content>
                                        </Col>
                                    </Row>
                                </Tab.Container>

                            </Col>
                            <Row
                                className="justify-content-center languages_list_wrapper noselect"
                            >
                                {
                                    this.state.languages.map(
                                        (lang, index) => {
                                            return (
                                                <span
                                                    key={lang.name}
                                                    className = {
                                                        (this.areStringsEqual(this.state.current_language, lang.name)) ? "active_language" : ""
                                                    }
                                                    onClick={() => { this.toggleSelectedLanguage(lang) }}
                                                >
                                                {capitalizeString(lang.name)}
                                                </span>
                                            );
                                        }
                                    )
                                }
                            </Row>   
                            <Col xs={12}>
                                <AceEditor
                                    placeholder=""
                                    mode={this.state.editor_mode}
                                    theme="monokai"
                                    name="ace_editor"
                                    width={"100%"}
                                    onChange={this.updateSourceText}
                                    fontSize={17}
                                    showPrintMargin={false}
                                    showGutter={true}
                                    highlightActiveLine={true}
                                    value={this.state.source_text} 
                                    setOptions={{
                                        enableBasicAutocompletion: true,
                                        enableLiveAutocompletion: true,
                                        enableSnippets: true,
                                        showLineNumbers: true,
                                        tabSize: 2,
                                    }}
                                />
                                <p className="text-center">
                                    <Button 
                                    id="send_solution_button" 
                                    onClick={
                                        this.state.unauthorized ? this.denySending : this.sendSolution
                                    }
                                    >
                                        <span>Trimite solutia </span>
                                        <FontAwesome name="upload"/>
                                    </Button>
                                </p>
                            </Col>
                        </Row>
                        {
                            (this.state.unauthorized) ? 
                        ('Nu esti conectat :(') : 
                        (
                        <Row className="justify-content-center my-4">
                            <Col xs={12}>
                                <h2>Solutiile mele</h2>
                                {
                                    this.state.problem_solutions.length === 0 ? (
                                        'Inca nu ai adaugat solutii pentru acesta problema'
                                    ) : ('')
                                }
                            </Col>
                                {
                                    this.state.problem_solutions.map(
                                        (solution,index) => {
                                            return (
                                                < ProblemSolutionCard key={index} solution={solution}/>
                                            );
                                        }
                                    )
                                }
                        </Row>                                
                            )
                        }
                        <PageScroller />
                    </Container>
                    {
                        (this.state.evaluation.evaluation_overlay) ? (
                            <ProblemEvaluationModal  eval_state={this.state.evaluation} hideOverlay = {this.closeOverlay} />
                        ) :
                        (<> </>)
                    }
                </div>
            );
        else 
            return <></>
            //return <Page404 />  
    }
}

export default withCookies(ProblemPage);