import React from 'react';
import { withCookies } from 'react-cookie';
import {
    Container, Row, Col, Button, Spinner, DropdownButton , Dropdown
} from 'react-bootstrap';
import Header from './components/Header';
import './ProblemPage.css';
//Ace editor imports
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/webpack-resolver";
import 'brace/ext/language_tools';


class LoadingOverlay extends React.Component
{
    render()
    {
        return (
            <Container fluid id="loading_overlay">
                <Row className="justify-content-center align-items-center">
                    <Col xs={6} id="loaders">
                        <>
                        {
                        this.props.eval_state.source_pending ? (
                                [...Array(5)].map((val,i) => {
                                return (
                                <Spinner key={i} animation="grow"/>)
                            })
                        ) : ('')
                        }
                        </>
                        <div id="evaluation_message">
                        <p>{this.props.eval_state.source_pending ? ("Evaluating,this may take a while") : ("Job done")}</p>
                        </div>
                        <div className="task_info">
                            {this.props.eval_state.runtime_err ? (
                                <p>{this.props.eval_state.runtime_err}</p>
                            ) : (
                            <>
                                {
                                    this.props.eval_state.evaluation_info.map((task, index) => {
                                    return (<div key={index}>Test {index + 1} {task['status']}---> {task['time']}</div>)
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
                                    <Button variant="outline-primary" onClick={() => {this.props.hideOverlay()}}>OK</Button>
                                </p>
                            )
                        }
                    </Col>
                </Row>
            </Container>
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
            //console.log(resp);
            this.setState({
                available_languages : resp,
            });
        })
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
                    "type": language_extension,
                    "content": this.state.source_text.replace(/'/g, `"`),
                    "stdin" : "",
                    "filename" : `File.${language_extension}`,
                    "time_limit": ""
                }),
            }
        )
           .then(resp => resp.text())
           .then(resp => {
               console.log(resp);
                var resp_json = JSON.parse(resp.replace(/'/g, '"'));
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
		// fetching code snippents from the API
        this.fetchSnippets();
    }

    render() {
        return (
            <>
            <Header logged_user={this.props.cookies.get('username')} />
            <Container fluid>
                <Row className="justify-content-center align-items-center">
                    <Col xs={6}>
                        <p>Se dau 2 numere naturale. Calculaţi suma celor 2 numere date.</p>
                        <p>Programul citește de la tastatură 2 numere naturale</p>
                        <p>Programul va afișa pe ecran suma celor două numere</p>
                        <p>cele două numere vor fi mai mici decât 1.000.000.000</p>
                    </Col>
                    <Col xs={6}>
                        <div>
                            <DropdownButton
                            title="Selecteaza limbajul"
                            variant="success"
                            >
                            {
                                this.state.available_languages.map( (lang) => {
                                    return <Dropdown.Item key={lang.name} onClick={() => { this.toggleSelectedLanguage(lang) }}>{lang.name}</Dropdown.Item >
                                })
                            }
                                </DropdownButton>
                        </div>                      
                    </Col>                    
                    <Col xs={12}>
						<AceEditor
							placeholder=""
							mode={this.state.editor_mode}
							theme="monokai"
							name="ace_editor"
							width={"100%"}
							onChange={this.updateSourceText}
							fontSize={17}
							showPrintMargin={true}
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
						<Button id="send_solution_button" onClick={this.sendSolution}>Trimite sursa</Button>
                    </Col>
                    <Col xs={12}>
                        <input type="text" name="input" placeholder="Input" onChange={this.updateInput}/>
                        <div id="output">Output :<br/>{this.state.output}</div>
                        <div className="text-danger" id="output">{this.state.errors}</div>
                    </Col>
                </Row>
            </Container>
				{
                    (this.state.evaluation_state.evaluation_overlay) ? (<LoadingOverlay eval_state={this.state.evaluation_state}  hideOverlay = {this.closeOverlay}/>) : (<> </>)
				}
            </>
        );
    }
}

export default withCookies(ProblemPage);