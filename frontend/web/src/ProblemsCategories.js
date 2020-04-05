import React from 'react';
import './ProblemsCategories.css';
import {Container,Row,Col,Card,Badge} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import PageScroller from './components/PageScroller';
export default class ProblemsCategories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topics_list : []
        }
    }


    fetchTopics = () => {
        fetch(
            `${process.env.REACT_APP_API_URL}/api/problem_topics/`
        )
        .then(resp => resp.json())
        .then(resp =>  {
            this.setState({
                topics_list : resp
            })
        })
        .catch(error => console.log(error))
    }

    componentDidMount () {
        this.fetchTopics();
    }

    render()
    {
        return (
        <Container className="problems_categories_page">
                <Row>
                    <Col xs={12} className="my-4">
                        <h3 className="text-center">Categorii de probleme</h3>
                    </Col>
                    {
                        this.state.topics_list.map((topic, index) => {
                            return (
                                <Col key={index} xs={12} md={6} xl={4} className="my-4">
                                    <Card
                                    onClick = {
                                        () => {
                                            window.location.href = `/probleme/categorii/${topic.name}`;
                                        }
                                    }
                                    >
                                        <Card.Img className="problem_image" variant="top" src={
                                            require(`./assets/img/asset003.jpg`)
                                        } />
                                        <Card.Body>
                                            <Card.Title className="text-center">
                                                {topic.name}
                                                            </Card.Title>
                                        </Card.Body>
                                        <Card.Footer className="text-center">
                                            <small>
                                                {topic.problems_available_count} probleme
                                                            </small>
                                        </Card.Footer>
                                    </Card>
                                </Col>
                            );
                        })
                    }
                </Row>
            <PageScroller />
        </Container>
        );
    }
}