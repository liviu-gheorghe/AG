import React from 'react';
import Header from '../components/Header';
import PageScroller from '../components/PageScroller';
import { withCookies } from 'react-cookie';
import {ProblemCard} from '../components/Cards';
import LoadingModal from '../components/LoadingModal';
import 
    {
    Container,
    Row,
    Col, 
    Button,
    InputGroup,
    FormControl,
    } 
    from 'react-bootstrap';
// eslint-disable-next-line
import FontAwesome from 'react-fontawesome';
import '../Main.css';
import './ProblemsList.css';



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

    componentWillMount() {
        this.setState({
            page_data: require('../assets/strings/problems_list_page.json')
        });
    }

    componentDidMount() {
        this.setState({
            fetch_type: 'append'
        }, () => {
            this.fetchProblems()
        })


    }

   render () {
       var page_language = this.props.cookies.get('language') || 'ro';
       //console.log(this.state.page_data);
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
                                           placeholder={this.state.page_data.search_placehoder_text[page_language]}
                                aria-label="Cautare problema"
                                aria-describedby=""
                                onChange = { this.updateSearchQuery }
                                />
                            <InputGroup.Append>
                                           <Button variant="outline-secondary" onClick={this.searchByQueryParams}>{this.state.page_data.search_button_text[page_language]}</Button>
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
                            <span>{this.state.page_data.categories_button_text[page_language]}</span>
                            <FontAwesome name="list-alt" style={{ fontSize: '35px', margin: '0px 5px' }} />
                        </div>
                    </Col>
                    {
                        this.state.problems_list.map(
                            (problem,index) => {
                                var img_src = (index%3) ? "asset003.jpg" : "graph.png";
                                return (
                                    <ProblemCard key={index} problem={problem} img_src={img_src}/>
                                );
                            }
                        )
                    }
                    {
                        this.state.fetch_pending ? (
                            <LoadingModal />
                            ) : 
                            (
                            <Col xs={12} className="text-center my-4">
                                <Button
                                    variant="success"
                                    onClick={this.loadNextProblems}
                                >
                                    {this.state.page_data.load_items_button_text[page_language]}
                                    <FontAwesome name="hourglass" />
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