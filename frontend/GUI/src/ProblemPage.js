import React  from 'react';
import { withCookies } from 'react-cookie';
import {
    Container, Row, Col, Button, Spinner, Modal
} from 'react-bootstrap';
import Header from './components/Header';
import Page404 from './components/Page404';
import './ProblemPage.css';
//Ace editor imports
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/webpack-resolver";
import 'brace/ext/language_tools';



// eslint-disable-next-line
class EvaluationModal extends React.Component {
    render() {
        return (
            <>
                <Modal
                    size="xl"
                    show={true}
                >
                <Container fluid id="loading_overlay">
                    <Row className="justify-content-center align-items-center">
                        <Col xs={10} id="loaders">
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
                                <p>{this.props.eval_state.source_pending ? ("In curs de evaluare") : ("Evaluare finalizata")}</p>
                            </div>
                            <div className="task_info">
                                {this.props.eval_state.runtime_err ? (
                                    <p>{this.props.eval_state.runtime_err}</p>
                                ) : (
                                        <>
                                            {
                                                this.props.eval_state.evaluation_info.map((task, index) => {
                                                    if (task['compilation_error'])
                                                        return (
                                                            <div key={index}>
                                                                ERROR ----> {task['compilation_error']}
                                                            </div>
                                                        )
                                                    else
                                                        return (
                                                            <div key={index}>
                                                                Test {index + 1} {task['status']}---> {task['time']}
                                                            </div>
                                                        )
                                                })
                                            }
                                            {
                                                this.props.eval_state.overall_score !== null ? (
                                                    <div>Scor : {this.props.eval_state.overall_score} p</div>
                                                ) : ('')
                                            }
                                        </>
                                    )}
                            </div>
                        </Col>
                    </Row>
                    <Row className="justify-content-center align-items-center">
                        <Col xs={12}>
                            {
                                this.props.eval_state.source_pending ?
                                    ('') :
                                    (
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

class ProblemPage extends React.Component {

// Ace modes used for text editor highlighting
	 ACE_MODES = {
		"Cpp"        : "c_cpp",
		"C"          : "c_cpp",
		"Java"       : "java",
		"Python"     : "python",
        "JavaScript" : "javascript",
        'Ruby'       : "ruby",
	}

    constructor(props) {
        super(props);
        this.state = {
            problem_statement_data : null,
            source_text:  ``,
            std_input: '',
            output : null,
            errors : null,
            available_languages:[],
            current_language:"Cpp",// current selected language
            editor_mode:'c_cpp',

            evaluation_state : {
                evaluation_info: [],
                evaluation_overlay: false,
                source_pending: false,
            }
        };
    }

    areStringsEqual = (str1,str2) =>
    {
        return !str1.localeCompare(str2);
    }

    closeOverlay = () => {
        this.setState({
            evaluation_state: {
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
        .then(resp => resp.json())
        .then(resp =>
        {
            this.setState({
                available_languages : resp,
            });
        })
    }
    

    
    fetchProblemData = (problem_id) =>
    {
        fetch(
            `${process.env.REACT_APP_API_URL}/api/problems/${problem_id}/`,
            {
                method: 'GET',
            }
        )
            .then(resp => resp.json())
            .then(resp => {
                this.setState({
                    problem_statement_data : resp,
                });
            })
    }
	
	toggleSelectedLanguage = lang => {
		//this.updateSourceText(lang.default_snippet);
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

    sendSolution = () => {
		this.setState({
            evaluation_state: {
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
                body: JSON.stringify({
                    "problem_id": this.state.problem_statement_data.id, 
                    "type": language_extension,
                    "content": this.state.source_text.replace(/'/g, `"`),
                    "stdin" : "",
                    "filename" : this.state.problem_statement_data.name,
                    "time_limit": ""
                }),
            }
        )
           .then(resp => resp.json())
           .then(resp_json => {
               console.log(resp_json);
                this.setState({
                    evaluation_state: {
                        source_pending: false,
                        evaluation_overlay: true,
                        evaluation_info: resp_json['tests'],
                        overall_score : resp_json['score'],
                        runtime_err : resp_json['message'],
                    },
                });
            })
            .catch(err => {
				console.log(err);
				this.setState({
                    evaluation_state: {
                        source_pending: false,
                        evaluation_overlay: true,
                        evaluation_info: ["DE ACORD"],
                    },
				});
            }
            )
    }

    componentDidMount()
    {
        // fetching problem data from the API 
        this.fetchProblemData(this.props.match.params.problem_id);        
		// fetching code snippents from the API
        this.fetchSnippets();
    }

    render() {
        if (this.state.problem_statement_data && !this.state.problem_statement_data.detail)
        return (
            <div style={{"position": "relative"}}>
            <Header logged_user={this.props.cookies.get('username')} />
            <Container >
                <Row className="justify-content-center">
                    <Col xs={12} className="problem_statement_wrapper">
                        <h2>Descrierea problemei</h2>
                        <p>{this.state.problem_statement_data.description}</p>
                        <h2>Date de intrare </h2>
                        <p>{this.state.problem_statement_data.std_input}</p>
                        <h2>Date de iesire </h2>
                        <p>{this.state.problem_statement_data.std_output}</p>
                        <h2>Restrictii si precizari</h2>
                        <p>{this.state.problem_statement_data.restrictions}</p>
                    </Col>
                    <Row
                        className="justify-content-center languages_list_wrapper noselect"
                    >
                        {
                            this.state.available_languages.map((lang, index) => {
                                return <span
                                    key={lang.name}
                                    className = {
                                        (this.areStringsEqual(this.state.current_language, lang.name)) ? "active_language" : ""
                                    }
                                    onClick={() => { this.toggleSelectedLanguage(lang) }}
                                >
                                    {lang.name}
                                </span>
                            })
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
						<Button id="send_solution_button" onClick={this.sendSolution}>Trimite solutia</Button>
                        </p>
                    </Col>
                </Row>              
            </Container>
				{
                    (this.state.evaluation_state.evaluation_overlay) ? (<EvaluationModal eval_state={this.state.evaluation_state}  hideOverlay = {this.closeOverlay}/>) : (<> </>)
				}
            </div>
        );
        else 
            return <Page404 />  
    }
}

export default withCookies(ProblemPage);