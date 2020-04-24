import React from 'react';
import ReactDom from 'react-dom';
import {Container,Row,Col,Button,ButtonGroup} from 'react-bootstrap';
import './css/WebPlayground.css';
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-jsx";
import "ace-builds/src-noconflict/mode-javascript";
//Ace editor imports
import AceEditor from "react-ace";
import FontAwesome from 'react-fontawesome';

const ACE_MODES = {
  'html':'html',
  'css':'css',
  'js': 'javascript'
}

class WebPlayground extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active_tab_source_text: "",
      sources:{
        'html' : '',
        'css' : '',
        'js' : ''
      },
      blob_url: "",
      current_selected_language : 'html',
    };
  }

  updateSourceText = (new_source_text) => {
    this.setState({
      active_tab_source_text: new_source_text,
    });

    let sources = Object.assign({}, this.state.sources);
    sources[this.state.current_selected_language] = new_source_text; 

    this.setState({
      sources:sources,
    });
  };

  toggleCurrentLanguage = event => {
    this.setState({
        current_selected_language:event.target.name,
        active_tab_source_text : this.state.sources[event.target.name]
      });
  }

  componentDidMount() {
  }

  updateIframeSource() {
    let blob = new Blob([this.state.sources['html']], { type: "text/html" });
    let url = URL.createObjectURL(blob);
    this.setState(
      {
        blob_url: url,
      }
    );
    setTimeout(this.injectStylesAndScripts.bind(this), 100);
  }

  injectStylesAndScripts() {
    let style = document.getElementById('playground_root').contentWindow.document.createElement("style");
    style.innerHTML = this.state.sources['css'];
    // create new html element for script 
    let script = document.getElementById('playground_root').contentWindow.document.createElement("script");
    script.innerHTML = this.state.sources['js']; 
    document.getElementById('playground_root').contentWindow.document.body.appendChild(style);
    document.getElementById('playground_root').contentWindow.document.body.appendChild(script);
  }
  render() {
    return (
      <Container
      style = {{
          height: this.props.height,
      }} 
      fluid 
      className="web_playground_container">
        <Row>
          <Col 
          xs={12}
          lg={6}
          className="mx-0 web_playground_editor_wrapper"
          style={{
            height: this.props.height,
          }} 
          >
            <Col xs={12} className="web_playground_options_bar d-flex justify-content-center align-items-center">
              <ButtonGroup>
                  <Button 
                  style={{width:'70px'}} 
                  onClick = { this.toggleCurrentLanguage }
                  variant={this.state.current_selected_language == 'html' ? 'primary':'secondary'}
                  name="html">
                    HTML
                  </Button>
                  <Button 
                  style={{ width: '70px' }} 
                  onClick={this.toggleCurrentLanguage }
                  variant={this.state.current_selected_language == 'css' ? 'primary' : 'secondary'}
                  name="css">
                    CSS
                  </Button>
                  <Button 
                  style={{ width: '70px' }}
                  onClick={ this.toggleCurrentLanguage }
                  variant={this.state.current_selected_language == 'js' ? 'primary' : 'secondary'}
                  name="js"
                  >
                    JS
                  </Button>
              </ButtonGroup >
              <FontAwesome
                name="play"
                className="px-4 py-1"
                style={{
                  color: "#fff",
                  fontSize: "25px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  this.updateIframeSource();
                }}
              />
            </Col>
            <AceEditor
              placeholder=""
              mode={ACE_MODES[this.state.current_selected_language]}
              theme="monokai"
              name="ace_editor"
              width={"100%"}
              style = {{
                height: (this.props.height ? `calc(${this.props.height} - 40px)` : 'calc(100vh - 40px)'),
              }}
              onChange={this.updateSourceText}
              fontSize={15}
              showPrintMargin={false}
              showGutter={true}
              highlightActiveLine={false}
              value={this.state.active_tab_source_text}
              setOptions={{
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: false,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 2,
              }}
            />
          </Col>
          <Col 
          xs={12}
          lg={6}
          id="web_playground_document"
          style = {{
            height: this.props.height,
            border: (this.props.bordered === true ? '.25px dashed #28a745' : 'none')
          }}
          >
            <iframe
              frameBorder="0"
              id="playground_root"           
              src={this.state.blob_url}
              style={{
                height: this.props.height,
              }} 
            ></iframe>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default WebPlayground