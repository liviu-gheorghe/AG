import React from 'react';
import './ProblemsCategories.css';
import {Container,Row,Col,Card,Badge} from 'react-bootstrap';
import {withCookies} from 'react-cookie';
import FontAwesome from 'react-fontawesome';
import PageScroller from '../components/PageScroller';
import {ProblemCategoryCard} from '../components/Cards';
import Header from '../components/Header';
class ProblemsCategories extends React.Component {
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
        <>
        <Header logged_user={this.props.cookies.get('username')} />
        <Container className="problems_categories_page">
                <Row>
                    <Col xs={12} className="my-4">
                        <h3 className="text-center">Categorii de probleme</h3>
                    </Col>
                    {
                        this.state.topics_list.map((topic, index) => {
                            return (
                                <ProblemCategoryCard topic={topic} img_src={'asset003.jpg'}/> 
                            );
                        })
                    }
                </Row>
            <PageScroller />
        </Container>
        </>
        );
    }
}
export default  withCookies(ProblemsCategories);