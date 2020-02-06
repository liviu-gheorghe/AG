import React from 'react';
import { withCookies } from 'react-cookie';
import { Container, Row, Col, Button ,Spinner} from 'react-bootstrap';
import Header from './components/Header';
import './ProblemPage.css';
//Ace editor imports
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/webpack-resolver";


function LoadingOverlay(props)
{
	return (
		<Container fluid id="loading_overlay">
			<Row className="justify-content-center align-items-center">
				<Col xs={6} id="loaders">
					<>
					{
						[...Array(5)].map((val,i) => {
							return (
							<Spinner key={i} animation="grow"/>)
						})
					}
					</>
					<div id="evaluation_message">
						Evaluating
					</div>
				</Col>
			</Row>
		</Container>
	);
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
            source_text:  `#include <iostream>\nusing namespace std;\nint main()\n{\n\tcout<<24<<' '; \n\treturn 0;\n}`,
            std_input: null,// 
            output : null,//
            errors : null,//
            available_languages:[],//
            current_language:"Cpp",// current selected language 
			editor_mode:'c_cpp',
			source_pending:false,// check whether a source is sending or not
        };
    }

    fetchSnippets = () => {
        fetch(
            'http://127.0.0.1:8000/api/languages/',
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
			source_pending:true,// start sending the solution
		});
        var language_extension = this.state.current_language.toLowerCase();
        fetch(
            'http://127.0.0.1:8000/evaluate/',
            {
                method: 'POST',
                body: JSON.stringify({
                    "content": this.state.source_text.replace(/'/g, `"`),
                    "std_input" : this.state.std_input,
                    "name" : `File.${language_extension}`,
                    "type" : language_extension,
                }),
            }
        )
           .then(resp => resp.json())
           .then(resp => {
               console.log(resp);
                this.setState({
                    output : resp.stdout,
					errors : resp.stderr,
					source_pending:false,
                });
            })
            .catch(err => {
				console.log(err);
				this.setState({
					source_pending: false,
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
                            <span>Selecteaza limbajul</span>
                            <select id="language_selection">
                            {
                                this.state.available_languages.map( (lang) => {
                                    return <option key={lang.name}  onClick={ () => {this.toggleSelectedLanguage(lang)}}>{lang.name}</option>
                                })
                            }
                            </select>
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
					(this.state.source_pending) ? (<LoadingOverlay />) : (<> </>)
				}
            </>
        );
    }
}

export default withCookies(ProblemPage);