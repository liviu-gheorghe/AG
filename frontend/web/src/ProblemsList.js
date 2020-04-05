import React from 'react';
import Header from './components/Header';
import PageScroller from './components/PageScroller';
import { withCookies } from 'react-cookie';
import 
    {
    Container,
    Row,
    Col, 
    Card,
    // eslint-disable-next-line
    CardColumns,
    // eslint-disable-next-line
    CardDeck,
    Button,
    InputGroup,
    FormControl,
    Pagination,
    Spinner,
    Badge,
    } 
    from 'react-bootstrap';
// eslint-disable-next-line
import FontAwesome from 'react-fontawesome';
import './Main.css';
import './ProblemsList.css';

// eslint-disable-next-line
class ProblemCard extends React.Component {
    render () {
        return (
            <div 
            style={
                {

                }
            }>

            </div>
        );
    }
}


class ProblemsList extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            problems_list : [],
            problems_per_page : 30,
            fetch_type : '',
            fetch_pending : false,
            query_parameters: {
                'name': '',
                'id': '',
                'tag': '',
                'difficulty': '',
                'topic': this.props.match.params.topic_name ? this.props.match.params.topic_name : '',
            },
        }
    }

    fetchProblems = () => {


        console.log(process.env.REACT_APP_API_URL);
        // fetch problems according to the options given by the user(if any)

        this.setState({fetch_pending:true});
        let start_index = 0;
        let end_index = this.state.problems_per_page;
        if(this.state.fetch_type=='append')
        {
            start_index += this.state.problems_list.length;
            end_index += this.state.problems_list.length;
        }
        fetch(
        // do not indent the multiline string, this will break the link
        // also the newline needs to be escaped
            `${process.env.REACT_APP_API_URL}\
/api/problems/?\
name=${this.state.query_parameters['name'].trim()}&\
tag=${this.state.query_parameters['tag'].trim()}&\
topic=${this.state.query_parameters['topic'].trim()}&\
difficulty=${this.state.query_parameters['difficulty'].trim()}&\
start=${start_index}&\
end=${end_index}
            `,
            {
                method: 'get',
            }
        )
            .then(resp => {
              //  console.log(resp.status)
                return resp.json()
            })
            .then(
                (resp) => {
                    //console.log(resp)
                    if(this.state.fetch_type == 'filter')
                    this.setState({
                        problems_list: resp,
                    });
                    else if (this.state.fetch_type == 'append')
                    {
                        let current_problems_list = this.state.problems_list;
                        this.setState({
                            problems_list : current_problems_list.concat(resp)
                        })
                    }
                    this.setState({fetch_pending:false});
                }
            )
            .catch(
                (err) => {
                    console.log(err.message);
                    this.setState({ fetch_pending: false });
                }
            )
    }

    //Total time spent questioning myself why the fuck the code isn't working properly : 70 minutes
    //https://stackoverflow.com/questions/36085726/why-is-setstate-in-reactjs-async-instead-of-sync


    // As setState is async, use fetchProblems 
    // as a callback
    loadNextProblems = () => {
        this.setState({
            fetch_type : 'append'
        },() => {
            this.fetchProblems()
        })
    }


    searchByQueryParams = () => {
        if(this.state.query_parameters['id'])
        {
            window.location.href = `/probleme/${this.state.query_parameters['id']}`;
        }
        else 
        {
        this.setState({
            fetch_type: 'filter'
        },() => {
            this.fetchProblems()
        })
        }
    }

    updateSearchQuery = (event) =>  {
        let query_string = event.target.value;
        // if the string is a number, it means that the user's 
        // intention is probably to search a problem by id, so we should update
        //the id in the query parameters

        let query_parameters = this.state.query_parameters
        if (parseInt(query_string))
        // no need to actually convert the id to integer,
        // we will redirect the user to the problem with 
        //the required id and we can construct the url
        //if the id is a string
        {
        query_parameters['name'] = '';
        query_parameters['id'] = parseInt(query_string);
        }
        else
        {
            query_parameters['name'] = query_string;
            query_parameters['id'] = '';
        }
        this.setState({
            query_parameters : query_parameters
        })
    }

    componentDidMount() {
        this.setState({
            fetch_type: 'append'
        }, () => {
            this.fetchProblems()
        })


    }
    DIFFICULTY_COLOR = {
        'elementar': '#007bff',
        'usor': '#28a745',
        'intermediar': '#6f42c1',
        'dificil': '#dc3545',
    }

   render () {
       console.log(this.state.problems_list);
       return (
           <>
            <Header logged_user={this.props.cookies.get('username')} />
            <Container fluid className="problems_list_page">
                <Row>
                <Col xs={12} xl={2} style={{display:'flex'}}>
                </Col>
                <Col xs={12} xl={8}>
                <Row className="align-items-center">
                       <Col xs={12} className="filter_section my-2">
                           <InputGroup className="mb-3">
                               <FormControl
                                   placeholder="Cauta problema(id,nume)"
                                   aria-label="Cautare problema"
                                   aria-describedby=""
                                   onChange = { this.updateSearchQuery }
                               />
                               <InputGroup.Append>
                                           <Button variant="outline-secondary" onClick={ this.searchByQueryParams }>Cautare</Button>
                               </InputGroup.Append>
                           </InputGroup>
                            <div
                            style={{
                                display:'flex',
                                alignItems:'center',
                                cursor:'pointer'

                            }}
                                onClick = {
                                    () => {
                                        window.location.href = "/probleme/categorii/";
                                    }
                                }
                            >
                                <span>Categorii</span>
                                    <FontAwesome name="list-alt" style={{ fontSize: '35px', margin: '0px 5px' }} />
                            </div>
                       </Col>
                    {
                        this.state.problems_list.map(
                            (problem,index) => {
                                var img_src = (index%3) ? "asset003.jpg" : "graph.png";
                                return (
                                    <Col key={index}
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    lg={4}
                                    className="my-4"
                                    onClick = {
                                        () => {
                                            window.location.href = `/probleme/${problem.id}`
                                        }
                                    }
                                    >
                                    <Card>
                                        <Card.Img className="problem_image" variant="top" src={
                                            require(`./assets/img/${img_src}`)
                                            } />
                                        <Card.Body>
                                                <Card.Title>
                                                    {problem.name}
                                                    <Badge key={index} 
                                                    className="p-2 m-2" 
                                                    style = {{
                                                        backgroundColor: this.DIFFICULTY_COLOR[problem.difficulty],
                                                        color : '#fff',
                                                        fontSize : '14px'
                                                    }}
                                                    >
                                                        {problem.difficulty}
                                                    </Badge>     
                                                </Card.Title>
                                            <Card.Text>
                                                {problem.description.slice(0, 100).split(" ").slice(0,-1).join(' ')} <a href={`/probleme/${problem.id}`}>Mai mult</a>
                                            </Card.Text>
                                                <Card.Text>
                                                    Taguri
                                                    {
                                                        problem.tags.split(',').map(
                                                            (tag,index) => 
                                                            {
                                                                return (
                                                                        <Badge key={index} className="px-2 py-1 m-2" variant="primary">{tag}</Badge>                                                                );
                                                            }
                                                        )
                                                    }
                                                </Card.Text>                                            
                                        </Card.Body>
                                        <Card.Footer>
                                        <small>
                                                <FontAwesome name="calendar"></FontAwesome>
                                                {
                                                    problem.is_recent ? (<span className="mx-2">Acum {problem.is_recent_date_posted}</span>) : (
                                                    <span className = "mx-2">
                                                        {problem.date_posted} {problem.time_posted}
                                                    </span>
                                                    )
                                                }
                                        </small>
                                        </Card.Footer>
                                    </Card>
                                    </Col>
                                );
                            }
                        )
                    }
                    {
                        this.state.fetch_pending ? (
                            <Col xs={12} className="text-center">
                                <Spinner animation="grow" />
                                <Spinner animation="grow" />
                                <Spinner animation="grow" />
                                
                            </Col>
                            ) : 
                            (
                            <Col xs={12} className="text-center my-4">
                                <Button
                                    variant="success"
                                    onClick={this.loadNextProblems}
                                >
                                    Incarca mai multe <FontAwesome name="hourglass" />
                                </Button>
                            </Col>                                
                            )
                    }
                </Row>
                </Col>
                <Col xs={12} xl={2}>

                </Col>
            </Row>
            <PageScroller />
            </Container>
           </>
       );
   }
}

export default withCookies(ProblemsList);