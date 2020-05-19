import React  from 'react';
import { withCookies } from 'react-cookie';
import PageScroller from '../components/PageScroller';
import {Container,Row,Col,Button,Badge,Tab,Nav} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Header from '../components/Header';
import {ProblemSolutionCard} from '../components/Cards';
import ProblemEvaluationModal from './ProblemEvaluationModal';
import {ProblemDetailsTable} from '../components/ProblemDetailsTable';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/webpack-resolver";
import 'brace/ext/language_tools';
import './ProblemPage.css';
import {capitalizeString} from '../utils/core';


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
            source_text:  '',
            current_language:"c++",
            editor_mode:'c_cpp',
            evaluation_data:[],
            evaluation_error:false,
            source_pending:false,
            evaluation_overlay:false,
            problem_solutions : [],
        };
    }


    areStringsEqual = (str1,str2) => {
        return !str1.localeCompare(str2);
    }

    closeOverlay = () => {
        this.setState({
            source_pending:false,
            evaluation_info:[],
            evaluation_overlay:false,
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

    updateSelectedProgrammingLanguage = programming_language => {
        this.updateSourceText(programming_language.default_snippet);
        this.setState({
            current_language: programming_language.name,
            editor_mode: this.ACE_MODES[programming_language.name],
        });
    }
             
    updateSourceText = source_text => {
        this.setState({
            source_text: source_text,
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
            source_pending:true,
            evaluation_overlay: true,
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
                console.log(resp);
                return resp.json();
            }
        )
        .then(
            resp_json => {
                console.log(resp_json);
                this.setState({
                        evaluation_data: resp_json,
                        source_pending:false,
                        evaluation_overlay: true,
                });
            }
        )
        .catch(
            err => {
                console.log("Error");
                console.log(err);
                this.setState({
                    evaluation_error: true,
                    evaluation_data: undefined,
                    source_pending: false,
                    evaluation_overlay: true
                });
            }
        )
    }

    componentWillMount() {
        this.setState(
            {
                page_data:require('../assets/strings/problem_page.json')
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
        var page_language = this.props.cookies.get('language') || 'ro';
        var tabs = this.state.page_data.tabs;
        if (this.state.problem && !this.state.problem.detail)
            return (
                <>
                    <Header logged_user={this.props.cookies.get('username')} />
                    <Container>
                        <Row className="justify-content-center">
                            <Col xs={12} className="problem_statement_wrapper">

                                <Tab.Container defaultActiveKey="first">
                                    <Row>
                                        <Col sm={12}>
                                            <Nav variant="pills" className="justify-content-center">
                                                <div>
                                                    <Nav.Link eventKey="first" className="text-center">{tabs.description.tab_title[page_language]}</Nav.Link>
                                                </div>
                                                <div>
                                                    <Nav.Link eventKey="second" className="text-center">{tabs.explanations.tab_title[page_language]}</Nav.Link>
                                                </div>
                                                <div>
                                                    <Nav.Link eventKey="third" className="text-center">{tabs.details.tab_title[page_language]}</Nav.Link>
                                                </div>
                                            </Nav>
                                        </Col>
                                        <Col sm={12} className="my-4">
                                            <Tab.Content>
                                                <Tab.Pane eventKey="first">
                                                    <h2 className="text-primary"><Badge variant="primary" className="p-2">{this.state.problem.name}</Badge></h2>
                                                    <h2>{tabs.description.tab_content.description[page_language]}</h2>
                                                    <p>{this.state.problem.description}</p>
                                                    <h2>{tabs.description.tab_content.input[page_language]}</h2>
                                                    <p>{this.state.problem.std_input}</p>
                                                    <h2>{tabs.description.tab_content.output[page_language]}</h2>
                                                    <p>{this.state.problem.std_output}</p>
                                                    <h2>{tabs.description.tab_content.restrictions[page_language]}</h2>
                                                    <div>{this.state.problem.restrictions}</div>
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="second" className="text-center">
                                                    {
                                                        this.state.problem.explanations_and_indications ? (
                                                            <div>{this.state.problem.explanations_and_indications}</div>
                                                        ):
                                                        (
                                                            <>
                                                                <p>{tabs.explanations.tab_content.no_explanation_massage[page_language]}</p>
                                                                <img className="gif_placeholder" src={require(`../assets/img/gifs/nif00.gif`)} alt=""/>
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
                                                    onClick={() => { this.updateSelectedProgrammingLanguage(lang) }}
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
                                        <span>{this.state.page_data.editor.send_solution_button_text[page_language]}</span>
                                        <FontAwesome name="upload"/>
                                    </Button>
                                </p>
                            </Col>
                        </Row>
                        {
                            (this.state.unauthorized) ? 
                        (this.state.page_data.solutions.unauthorized_message[page_language]) : 
                        (
                        <Row className="justify-content-center my-4">
                            <Col xs={12}>
                                <h2>{this.state.page_data.solutions.section_title[page_language]}</h2>
                                {
                                    this.state.problem_solutions.length === 0 ? (
                                        this.state.page_data.solutions.section_content.no_solutions_message[page_language]
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
                        (this.state.evaluation_overlay) ? (
                            <ProblemEvaluationModal
                                evaluation_error={this.state.evaluation_error}
                                evaluation_data={this.state.evaluation_data}
                                source_pending={this.state.source_pending}
                                hideOverlay = {this.closeOverlay} 
                            />
                        ) :
                        (<> </>)
                    }
                </>
            );
        else 
            return <></>
            //return <Page404 />  
    }
}

export default withCookies(ProblemPage);