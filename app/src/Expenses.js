import React, { Component } from 'react';
import AppNav from './AppNav';
import DatePicker from 'react-datepicker';
import './App.css';
import "react-datepicker/dist/react-datepicker.css";
import { Container, Form, FormGroup, Button, Table } from 'reactstrap';
import {Link} from 'react-router-dom';

class Expenses extends Component {
    emptyItem = {
        id: '100',
        expenseDate: new Date(),
        description: '',
        location: '',
        categories: [1, 'travel']
    }
    constructor(props){
        super(props)
        this.state = {  
            date: new Date(),
            isLoading: true,
            Expenses: [],
            Categories: [],
            item: this.emptyItem
        } 
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }
    //for delete a record
    async remove(id){
        await fetch('/api/expenses/'+id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedExpenses = [...this.state.Expenses].filter(i => i.id !== id);
            this.setState({Expenses: updatedExpenses});
        });
    }
    //for submit new records
    async handleSubmit(event){
        event.preventDefault();
        const {item} = this.state;
        await fetch('api/expenses', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });
        console.log(this.state);
        this.props.history.push('/expenses');
    }
    handleChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item}; 
        item[name] = value;
        this.setState({item});
        console.log(this.state);
    }
    handleDateChange(date){
        let item = {...this.state.item};
        console.log(this.state);
        item.expensedate = date;
        this.setState({item});
    }
    async componentDidMount(){
        //Categories
        const responseCategories = await fetch('/api/categories');
        const bodyCategories = await responseCategories.json();
        this.setState({Categories: bodyCategories, isLoading: false});   
        //Expenses 
        const responseExpenses = await fetch('/api/expenses');
        const bodyExpenses = await responseExpenses.json();
        this.setState({Expenses: bodyExpenses, isLoading: false});    
    }
    render() { 
        const title = <h2>Add Expense</h2>;
        const {Categories, isLoading} = this.state;
        const {Expenses} = this.state;
        if(isLoading)
            return( <div>Loading...</div>)
        let optionList = Categories.map( category => 
                                            <option value={category.id} key={category.id}>
                                                {category.name}
                                            </option>
            )
        let rows = Expenses.map( expense => 
            <tr key={expense.id}>
                <td>{expense.description}</td>
                <td>{expense.location}</td>
                <td>{expense.expensedate}</td>
                <td>{expense.category.name}</td>
                <td><Button size="sm" color="danger" onClick={ () => this.remove(expense.id)}>Delete</Button></td>
            </tr>
            )
        return ( 
        <div>
            <AppNav/>
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <label htmlFor="description">Title</label>
                        <input type="description" name="description" id="description" onChange={this.handleChange} autoComplete='name' />
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="category">Category</label>
                        <select onChange={this.handleChange}>
                            {optionList}
                        </select>      
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="expenseDate">Date</label>
                        <DatePicker selected={this.state.date} onChange={this.handleDateChange} />
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="location">Location</label>
                        <input type="text" name="location" id="location" onChange={this.handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/categories">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
            {''}
            <Container>
                <h2>Expenses list</h2>
                <Table className='mt-4'>
                    <thead>
                        <tr>
                            <th width="30%">Description</th>
                            <th width="10%">Location</th>
                            <th width="20%">Date</th>
                            <th>Category</th>
                            <th width="10%">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </Table>
            </Container>
        </div> 
        );
    }
}
 
export default Expenses;