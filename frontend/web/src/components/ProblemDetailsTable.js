import  React  from 'react';
import {Table,Badge} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import './ProblemDetailsTable.css';

class ProblemDetailsTable extends React.Component {
    render() {
    return (
        <Table striped bordered className="problem_info_table">
            <caption className="py-2">Detalii problema {this.props.problem.name}</caption>
            <tbody>
                <tr>
                    <td><FontAwesome name="layer-group" /></td>
                    <td>
                        <Badge variant="secondary" className="p-2">{this.props.problem.difficulty}</Badge>
                    </td>
                </tr>
                <tr>
                    <td><FontAwesome name="crosshairs" /></td>
                    <td>
                        {
                            this.props.problem.tags.split(",").map(
                                (tag, index) => {
                                    return <Badge key={index} variant="primary" className="p-2 m-2">{tag}</Badge>
                                }
                            )
                        }
                    </td>
                </tr>
                <tr>
                    <td><FontAwesome name="calendar" /></td>
                    <td>
                        {`${this.props.problem.date_posted}`}
                    </td>
                </tr>
                <tr>
                    <td><FontAwesome name="user" /></td>
                    <td>{`${this.props.problem.author.first_name} ${this.props.problem.author.last_name}`}</td>
                </tr>
                <tr>
                    <td><FontAwesome name="clock" /></td>
                    <td>{this.props.problem.time_limit} s</td>
                </tr>
                <tr>
                    <td><FontAwesome name="memory" /></td>
                    <td>{this.props.problem.memory_limit} MB</td>
                </tr>
            </tbody>
        </Table>
    );         
     }
}
export default ProblemDetailsTable;
