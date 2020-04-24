import React from 'react';
import './css/TutorialsList.css';
import { withCookies } from 'react-cookie';
import { Container, Row, Col,Button,Badge } from 'react-bootstrap';
import PageScroller from '../../components/PageScroller';
import { TutorialCard } from "../../components/Cards";
import Header from '../../components/Header';

class TutorialList extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            tutorials : [],
            fetch_pending:true,
        }
    }

    componentDidMount() {
        this.fetchTutorials();
    }


    fetchTutorials() {
        fetch(
            `${process.env.REACT_APP_API_URL}/api/tutorials/`
        )
        .then(resp=>resp.json())
        .then(
            resp => {
                this.setState({tutorials:resp,fetch_pending:false})
            }
        )
    }

    render () {
    return (
      <>
        <Header logged_user={this.props.cookies.get("username")} />
        <Container>
          <Row>
            <Col xs={12} className="my-4">
              <h2 className="text-center">Tutoriale</h2>
            </Col>
            {
                this.state.tutorials.map(
                    (tutorial,index) => {
                        return (
                          <React.Fragment key={index}>
                          {
                              (index == 0 || tutorial.category != this.state.tutorials[index - 1].category) ? (
                              <Col xs={12} key={index+(1<<20)}>
                                {
                                tutorial.category.split(',').map(
                                  (category,index) => {
                                    return (
                                      <Badge key={index} variant="primary" className="px-4 py-2 m-2">{category}</Badge>
                                    );
                                  }
                                )                                  
                                }

                              </Col>
                            ) : ('')
                          }
                            <TutorialCard tutorial={tutorial} key={index}/>
                          </React.Fragment>
                        );
                        
                    }
                )
            }
          </Row>
        </Container>
      </>
    );        
    }
}

export default withCookies(TutorialList);