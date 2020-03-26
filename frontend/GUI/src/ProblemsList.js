import React from 'react';
import Header from './components/Header';
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
        }
    }
    componentWillMount() {

    }

    componentDidMount() {
        fetch(
            `${process.env.REACT_APP_API_URL}/api/problems/?s_id=2`,
            {
                method: 'get',
            }
        )
            .then(resp => resp.json())
            .then(
                (resp) => {
                    console.log(resp);
                    this.setState({
                        problems_list: resp,
                    });
                }
            )
            .catch(
                (err) => {
                    console.log(err);
                }
            )
    }

   render () {
       return (
           <>
            <Header logged_user={this.props.cookies.get('username')} />
            <Container fluid className="problems_list_page">
                <Row>
                <Col xs={12} xl={2}>
                </Col>
                <Col xs={12} xl={8}>
                <Row className="align-items-center">
                       <Col xs={12} className="filter_section my-2">
                           <InputGroup className="mb-3">
                               <FormControl
                                   placeholder="Cauta problema"
                                   aria-label="Cautare problema"
                                   aria-describedby=""
                               />
                               <InputGroup.Append>
                                   <Button variant="outline-secondary">Cautare</Button>
                               </InputGroup.Append>
                           </InputGroup>
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
                                            //window.location.href = `/probleme/${problem.id}`
                                        }
                                    }
                                    > 
                                    <Card>
                                        <Card.Img className="problem_image" variant="top" src={
                                            require(`./assets/img/${img_src}`)
                                            } />
                                        <Card.Body>
                                        <Card.Title>{problem.name}</Card.Title>
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
                                        <Card.Footer className="bg-danger">
                                        <small className="text-white">
                                                    Autor: {problem.author ? problem.author.username : "Nedefinit"}
                                        </small>
                                        </Card.Footer>
                                    </Card>
                                    </Col>
                                );
                            }
                        )
                    }
                </Row>
                <Row>
                    <Pagination className="mx-auto my-4">
                        {
                               [...Array(1+Math.floor(this.state.problems_list.length/30))].map((page, index) => {
                                return <Pagination.Item key={index}>{index + 1}</Pagination.Item>
                            })
                        }
                    </Pagination>
                </Row>
                </Col>
                <Col xs={12} xl={2}>

                </Col>
            </Row>              
            </Container>
           </>
       );
   }
}

export default withCookies(ProblemsList);