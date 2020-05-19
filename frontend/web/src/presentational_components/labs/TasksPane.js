import React from 'react';
import {Col,Tabs,Tab,Button} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

class TasksPane extends React.Component {
    constructor(props) {
        super(props);
        this.handleTaskManagementWebSocketOpen = this.handleTaskManagementWebSocketOpen.bind(this);
        this.handleTaskManagementWebSocketClose = this.handleTaskManagementWebSocketClose.bind(this);
        this.handleTaskManagementWebSocketError = this.handleTaskManagementWebSocketError.bind(this);
        this.state = {
            active_task: null,
            answers_list: [...Array(this.props.tasks.length).fill([])]
        }
    }


    componentDidMount () {
    // Create the websocket
    this.websocket = this.createTaskManagementWebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}`, "443");
    }

    componentWillUnmount() {
        // Close the websocket
        this.websocket.close();
    }


    createTaskManagementWebSocket(uri, port) {
        var socket = new WebSocket(`ws://${uri}:${port}`, 'TASK_MANAGEMENT_PROTOCOL');
        var component = this;
        socket.onopen = this.handleTaskManagementWebSocketOpen;
        socket.onclose = this.handleTaskManagementWebSocketClose;
        socket.onerror = this.handleTaskManagementWebSocketError;
        return socket;
    }


    // send task management data through the websocket
    sendTaskManagementData(data) {
        //console.log(this);
        //console.log(this.websocket);
        this.websocket.send(data);
    }

    handleTaskManagementWebSocketOpen() {
        console.log("Task Management WebSocket connection opened");
        this.handleCurrentTaskModification(0, true);
    }

    handleTaskManagementWebSocketClose() {
        console.log("Task Management WebSocket connection closed")
    }

    handleTaskManagementWebSocketError() {
        //this.setState({websocket_connection_error:true});
    }



    handleCurrentTaskModification(next, no_management) {
        console.log("Handling modification");

        // if the user selects the same task again, do nothing 
        if (this.state.active_task != null && this.state.active_task == next) { console.log("Selected same task"); return; }
        // if this is not the first selected task(the activity started earlier and this
        // is not the first task selected by the user), then run the post_task_command in the 
        // container for the previous task(if any)
        console.log("Handling task modification");
        if (this.state.active_task != null) {
            var post_task_command = this.props.tasks[this.state.active_task].post_task_command;
            //console.log(`post task for ${this.state.active_task} is --> ${post_task_command} `)
            if (post_task_command && no_management == true) //this.sendTaskManagementData(pre_task_command);
            {
                console.log(`Sending post task for ${next} --> ${post_task_command} `)
                this.websocket.send(post_task_command);
            }
        }
        this.setState({ active_task: next })
        // After moving to the new task , run the pre_task_command in the container 
        // for the task(if any)
        var pre_task_command = this.props.tasks[next].pre_task_command;
        //console.log(`pre task for ${next} is --> ${pre_task_command} `)
        if (pre_task_command && no_management == true) { //this.sendTaskManagementData(post_task_command);
            console.log(`Sending pre task for ${next} --> ${pre_task_command} `)
            this.websocket.send(pre_task_command);
        }
    }


    handleAnswerChoice(answer) {
        // The current answers list for the current active task
        // Avoid mutating the state by concatenating the current task answers list with 
        // an empty array 
        var current_task_answers_list = this.state.answers_list[this.state.active_task].concat([]);

        // If the task has only one correct response then just replace the existing response(if any)
        // with the new response
        if (this.props.tasks[this.state.active_task].single_response == true) {
            // if the answer already exists and it is equal to the current answer 
            // it means that the users wants to toggle the response --> delete 
            // the response
            if (current_task_answers_list[0] == answer) {
                current_task_answers_list.pop();
            }
            // otherwise change the response with the new response
            else {
                current_task_answers_list[0] = answer;
            }
        }
        else {
            // If the task has multiple choices, then add the answer to the current answers list 
            // if the answer is not already in the list
            // If the answer is already in the list it means that the user wants to toogle 
            // the response --> delete the response
            if (current_task_answers_list.indexOf(answer) != -1) {
                current_task_answers_list.splice(current_task_answers_list.indexOf(answer), 1);
            }
            else {
                current_task_answers_list.push(answer);
                // Sort the list such that the answers 
                // are ordered and is easy to compare 
                // it with the correct response
                current_task_answers_list.sort();
            }
        }
        // update the state
        let answers_list = this.state.answers_list;
        answers_list[this.state.active_task] = current_task_answers_list;

        this.setState({
            answers_list: answers_list
        })
    }





    render () {
        return (
            <>
                <Col xs={12} className="lab_statement">
                    <Tabs
                        style={{
                            flexWrap: 'wrap',
                        }}
                        className="align-items-center justify-content-center my-4"
                        activeKey={this.state.active_task}
                        onSelect={key => this.handleCurrentTaskModification(parseInt(key), true)}
                    >
                        {
                            this.props.tasks.map((task, index) => {
                                return (
                                    <Tab
                                        style={{
                                            flexWrap: 'wrap',
                                        }}
                                        className="text-center my-4"
                                        key={index}
                                        eventKey={index}
                                        title={index + 1}
                                    >
                                        <div className="text-left my-4">
                                            {
                                                task.single_response ? (<strong>Un singur raspuns corect !</strong>) : (<strong>Niciun raspuns sau mai multe raspunsuri corecte !</strong>)
                                            }
                                        </div>
                                        <p>{task.description}</p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap' }} className="align-items-center justify-content-center my-4">
                                            {
                                                task.answer_choices.map((choice, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            onClick={() => this.handleAnswerChoice(index)}
                                                            className =
                                                            {
                                                                (this.state.active_task != null && this.state.answers_list[this.state.active_task].indexOf(index) != -1) ?
                                                                    ("lab_answer_choice_button lab_active_answer_choice") :
                                                                    ("lab_answer_choice_button") 
                                                            }
                                                        >
                                                            {choice}
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </Tab>
                                )
                            })
                        }
                    </Tabs>
                </Col>
                <Col xs={12}>
                    {
                        this.state.active_task > 0 ?
                            (
                                <Button
                                    onClick={
                                        () => {
                                            console.log("MODIFYING CURRENT ACTIVE TASK TO ", this.state.active_task - 1)
                                            this.handleCurrentTaskModification(this.state.active_task - 1,true)
                                        }
                                    }
                                >
                                    <FontAwesome name="arrow-left" className="mx-2" />
                                    <span>Anterior</span>
                                </Button>
                            ) :
                            ('')
                    }
                    {
                        this.state.active_task < this.props.tasks.length - 1 ?
                            (
                                <Button
                                    style={{
                                        float: 'right'
                                    }}
                                    onClick={
                                        () => {
                                            console.log("MODIFYING CURRENT ACTIVE TASK TO ", this.state.active_task + 1)
                                            this.handleCurrentTaskModification(this.state.active_task + 1,true)
                                        }
                                    }
                                >
                                    <span>Urmator</span>
                                    <FontAwesome name="arrow-right" className="mx-2" />
                                </Button>
                            ) :
                            (
                                <Button
                                    style={{
                                        float: 'right'
                                    }}
                                    onClick={
                                        () => {
                                            this.props.computeObtainedScore(this.state.answers_list);
                                        }
                                    }
                                >
                                    <span
                                    >Finalizare</span>
                                    <FontAwesome name="check" className="mx-2" />
                                </Button>
                            )
                    }
                </Col>            
            </>
        );
    }
}


export default TasksPane;