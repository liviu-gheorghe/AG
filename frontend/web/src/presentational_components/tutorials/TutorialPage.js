import React from 'react';
import {Container,Row,Col,Nav,Tab} from 'react-bootstrap';
import {withCookies} from 'react-cookie';
import Header from "../../components/Header";
import PageScroller from "../../components/PageScroller";
import ReactMarkdown from 'react-markdown';
import WebPlayground from '../labs/WebPlayground';
import {LanguageContext} from '../..';

class TutorialPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        articles : []
    }
  }

  fetchTutorialArticles() {
      fetch(
        `${process.env.REACT_APP_API_URL}/api/tutorial_articles/?tutorial=${this.props.match.params.tutorial_id}`
      )
      .then(resp=>resp.json())
      .then(
          resp => {
              this.setState({
                articles: resp,
              });
          }
      )
  }

  componentDidMount() {
    console.log(this.context);
      this.fetchTutorialArticles();
  }

  componentDidUpdate() {
      this.addResponsiveImageBehaviour();
  }

  addResponsiveImageBehaviour() {
    // Add responsive behaviour for any images referenced in the markdown
    var images = document.querySelectorAll(
    ".tutorial_page_wrapper img"
    );
    if (images) {
    images.forEach((image) => {
        image.classList.add("img-fluid");
    });
    }
}

  render() {
    this.contextType = LanguageContext;
    return (
      <>
        <Header logged_user={this.props.cookies.get("username")} />
        <Container fluid className="tutorial_page_wrapper">
          <Tab.Container defaultActiveKey="0">
            <Row>
              <Col
                xs={12}
                lg={2}
                className="sidebar justify-content-center align-items-center"
                style={{
                  overflowY: "auto",
                  height: "100vh",
                  position: "sticky",
                  display: "flex",
                  top: "0px",
                }}
              >
                <Nav
                  variant="pills"
                  style={{
                    heigth: "95vh",
                  }}
                  className="justify-content-center flex-lg-column my-4"
                >
                  {this.state.articles.map(
                    (article, index) => {
                      return (
                        <Nav.Link
                          key={index}
                          eventKey={index}
                          className="text-center !important"
                        >
                          {article.title}
                        </Nav.Link>
                      );
                    }
                  )}
                </Nav>
              </Col>
              <Col xs={12} lg={10} className="my-4">
                <Tab.Content>
                  {this.state.articles.map((article, index) => {
                    return (
                      <Tab.Pane
                        key={index}
                        eventKey={index}
                        className="px-4 py-2"
                      >
                        <ReactMarkdown source={article.content} />
                        
                      </Tab.Pane>
                    );
                  })}
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Container>
        <PageScroller />
      </>
    );
  }
}
//TutorialPage.contextType = LanguageContext;
//<WebPlayground height="50vh" bordered={true} />
export default withCookies(TutorialPage);