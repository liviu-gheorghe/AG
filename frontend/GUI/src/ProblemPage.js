import React  from 'react';
import { withCookies } from 'react-cookie';
import {
    Container, 
    Row, 
    Col, 
    Button, 
    Spinner, 
    Modal ,
    Table,
    Card,
} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Header from './components/Header';
//import Page404 from './components/Page404';
import './ProblemPage.css';
//Ace editor imports
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/webpack-resolver";
import 'brace/ext/language_tools';


class EvaluationModal extends React.Component {
 
	//Utility that checks if two strings are equal
	areStringsEqual = (str1, str2) => {
    if(str1 === undefined) return false;
	return !str1.localeCompare(str2);
	}
 
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
                                                                            (this.areStringsEqual(task['status'],"OK")) ? "bg-success" : "bg-danger"
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
         
class ProblemPage extends React.Component {
          
    // Ace modes used for text editor highlighting
    ACE_MODES = {
    "C++"        : "c_cpp",
    "C"          : "c_cpp",
    "Java"       : "java",
    "Python"     : "python",
    "JavaScript" : "javascript",
    'Ruby'       : "ruby",
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
            `${process.env.REACT_APP_API_URL}/api/problem_solutions/?problem=${problem_id}`,
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
                    console.log("Setting up problems");
                    this.setState({
                        problem_solutions : resp
                    })
                    }
                    else 
                    {
                        console.log("It seems that you're not authorized");
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
            resp => resp.json()
        )
        .then(
            resp_json => {
                //console.log(resp_json);
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
                        evaluation_info: ["DE ACORD"],
                    },
                });
            }
        )
    }
              
    componentWillMount() {

    }
    componentDidMount () {
        // fetch problem data from the API 
        this.fetchProblemData(this.props.match.params.problem_id);
        // fetch code snippents from the API
        this.fetchSnippets();
        //fetch current problem solutions from the API



        if (!this.props.cookies.get('auth_token')) {
            console.log("AICI");
            this.setState({
                unauthorized: true,
            })
        }
        else console.log(this.props.cookies.get('auth_token'));


        if (!this.state.unauthorized) {
            console.log("Fetching problem solutions");
            this.fetchProblemSolutions();
        }
    }
    render() {
        if (this.state.problem && !this.state.problem.detail)
            return (
                <div style={{"position": "relative"}}>
                    <Header bgVariant="dark" logged_user={this.props.cookies.get('username')} />
                    <Container>
                        <Row className="justify-content-center">
                            <Col xs={12} className="problem_statement_wrapper">
                                <h2>Descrierea problemei</h2>
                                <p>{this.state.problem.description}</p>
                                <h2>Date de intrare </h2>
                                <p>{this.state.problem.std_input}</p>
                                <h2>Date de iesire </h2>
                                <p>{this.state.problem.std_output}</p>
                                <h2>Restrictii si precizari</h2>
                                <p>{this.state.problem.restrictions}</p>
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
                                                {lang.name}
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
                                    <Button id="send_solution_button" onClick={this.sendSolution}>Trimite solutia</Button>
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
                                                <Col key={index} xs={12} md={6} lg={4} xl={4} className="my-4">
                                                <Card
                                                    onClick={
                                                        () => {
                                                            window.location.href = "/probleme/";
                                                        }
                                                    }
                                                    bg={solution.score == "100" ? "success" : "danger"}
                                                    style={
                                                        {
                                                            width: '18rem',
                                                            color: '#fff',
                                                            margin: 'auto',
                                                        }
                                                    }
                                                >
                                                    <Card.Header>Solutia #{solution.id}</Card.Header>
                                                    <Card.Body className="text-center">
                                                        <div>
                                                            <p>
                                                                Tip : {solution.source_type}
                                                            </p>
                                                            <p>
                                                                Punctaj : {solution.score}
                                                            </p>
                                                            <p>
                                                                Data : {solution.date_posted}
                                                            </p>                      
                                                            <FontAwesome
                                                                name={solution.score == "100" ? "check":"times"}
                                                                className="card_icon">
                                                            </FontAwesome>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                                </Col>
                                            );
                                        }
                                    )
                                }
                        </Row>                                
                            )
                        }

                    </Container>
                    {
                        (this.state.evaluation.evaluation_overlay) ? (
                            <EvaluationModal 
                                eval_state={this.state.evaluation}
                                hideOverlay = {this.closeOverlay}
                            />
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