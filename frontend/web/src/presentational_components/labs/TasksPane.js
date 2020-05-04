import React from 'react';
import {Col,Tabs,Tab,Button} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

class TasksPane extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active_task: null,
            answers_list: [],
        }
    }

    handleCurrentTaskModification(next, no_management) {
        console.log("Handling nodification");

        // if the user selects the same task again, do nothing 
        if (this.state.active_task == next) { console.log("Selected same task"); return; }
        // if this is not the first selected task(the activity started earlier and this
        // is not the first task selected by the user), then run the post_task_command in the 
        // container for the previous task(if any)
        if (this.state.active_task != null) {
            var post_task_command = this.state.tasks[this.state.active_task].post_task_command;
            //console.log(`post task for ${this.state.active_task} is --> ${post_task_command} `)
            if (post_task_command && no_management == undefined) //this.sendTaskManagementData(pre_task_command);
            {
                console.log(`Sending post task for ${next} --> ${post_task_command} `)
                this.websocket.send(post_task_command);
            }
        }
        this.setState({ active_task: next })
        // After moving to the new task , run the pre_task_command in the container 
        // for the task(if any)
        var pre_task_command = this.state.tasks[next].pre_task_command;
        //console.log(`pre task for ${next} is --> ${pre_task_command} `)
        if (pre_task_command && no_management == undefined) { //this.sendTaskManagementData(post_task_command);
            console.log(`Sending pre task for ${next} --> ${pre_task_command} `)
            this.websocket.send(pre_task_command);
        }
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
                                                            className={
                                                                (this.state.answers_list[this.state.active_task].indexOf(index) == -1) ?
                                                                    ("lab_answer_choice_button") :
                                                                    ("lab_answer_choice_button lab_active_answer_choice")
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
                                            this.handleCurrentTaskModification(this.state.active_task - 1)
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
                        this.state.active_task < this.state.tasks.length - 1 ?
                            (
                                <Button
                                    style={{
                                        float: 'right'
                                    }}
                                    onClick={
                                        () => {
                                            console.log("MODIFYING CURRENT ACTIVE TASK TO ", this.state.active_task + 1)
                                            this.handleCurrentTaskModification(this.state.active_task + 1)
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