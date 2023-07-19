import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import {getUsers} from '../functions/placeholder.api'
import styles from './ToDoForm.module.scss';

interface TodoFormValues {
  id: number ;
  user: string;
  type: string;
  title: string;
  content: string;
  completed: boolean;
}
export interface IUsers{
  id: number;
  name: string;
  [key:string]:any
}
enum TodoType {
  HOME = "household chores",
  OFFICE = "office",
  DISTANT = "distant work",
  FREELANCE = "freelance"
}

const validationSchema = Yup.object().shape({
  id: Yup.number(),
  user: Yup.string().required("Executor name is required"),  
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required").max(60,"To long"),
});

const TodoForm = (): JSX.Element => {
  const [formData, setFormData] = useState<TodoFormValues[] >([]);
  const [isRedact, setIsRedact] = useState<boolean[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [users, setUsers] = useState<IUsers[]>([]);
  const[toDoCounter, setToDOCounter] = useState<number>(0);
  const navigation = useNavigate();

  useEffect(()=>{
    let savedTodo:string | null = localStorage.getItem('ToDoList');
    if(savedTodo){
      setFormData(JSON.parse(savedTodo));
      setIsRedact(new Array(JSON.parse(savedTodo).length).fill(true));
    }  
    const fetchUsers = async () => {    
        const response = await getUsers();
      setUsers(response);
    }
    fetchUsers();         
  }
  ,[]);
      
  const handleSubmit = (values: TodoFormValues, actions: any): void => {
    const userOne= users.find((user)=>user.name === values.user);        
    if(userOne){
      values.id = userOne.id;
    }
    setFormData([...formData, values]);
    setIsRedact([...isRedact, true]);   
    actions.resetForm();    
  };
  
  useEffect(() => {
    localStorage.setItem('ToDoList', JSON.stringify(formData));
    setToDOCounter(formData.length)
  }, [formData]);

  const delItem = (index:number) =>{
    setFormData((prevState)=>prevState.filter((_,i)=>i!==index));
    setIsRedact((prevState)=>prevState.filter((_,i)=>i!==index));
  };

  const redContent = (index:number, newContent:string) => {
    setFormData((prevState)=>prevState.map((_,i)=>i===index?{...prevState[i],content: newContent}:{...prevState[i]}))
  };

  const toggleRedact = (index: number) => {
    setIsRedact((prevIsRedact) =>
      prevIsRedact.map((value, i) => (i === index ? !value : value))
    );
  };

  const handleChangeComplete = (index:number)=>{
    setFormData((prevState) =>
    prevState.map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  const filteredData =
    filter === "completed"
      ? formData.filter((todo) => todo.completed)
      : filter === "active"
      ? formData.filter((todo) => !todo.completed)
      : formData;

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };

  const userData = (content:string)=>{
    const user = users.find((user) => user.name === content);    
    if (user) {
      const userToDo = formData.filter((todo,)=>todo.id === user.id);
      navigation(`/userInfo/${user.id}`, {state:{user, userToDo }});
    } else {
      return;
    }
  }
  const typeSelect = (type:string) =>{
    const todoTypeArr = formData.filter((todo,)=> todo.type === type);
    navigation(`/${(type).replace(/\s/g, '_')}`, {state:{todoTypeArr }});

  }

  return (
    <div className={styles.TodoFormWrapper}>
      <div>
      <Formik 
        initialValues={{
          id: 0,
          user: "",
          type: TodoType.HOME,
          title: "",
          content: "",
          completed: false,          
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form  className={styles.form}>          
          <label htmlFor="user">Executor name:</label>
          <Field
             component="select"
             name="user"
             className={styles.field}             
           >
             {users.map((user, index)=>(<option key={index} value={user.name}>{user.name}</option>))}
           </Field>
           <label htmlFor="type">To do type:</label>
           <Field
            component="select"
             name="type"
             className={styles.field}
           >
            <option value={TodoType.HOME}>{TodoType.HOME}</option>
            <option value={TodoType.OFFICE}>{TodoType.OFFICE}</option>
            <option value={TodoType.DISTANT}>{TodoType.DISTANT}</option>
            <option value={TodoType.FREELANCE}>{TodoType.FREELANCE}</option>
           </Field>

          <label htmlFor="title">Title:</label>
          <Field className={styles.field}  name="title" placeholder="Title" />
          <ErrorMessage className={styles.error} name="title" component="div" />

          <label htmlFor="content">Content:</label>
          <Field className={styles.field}  name="content" placeholder="Content" type="text" />
          <ErrorMessage className={styles.error} name="content" component="div" />

          <button type="submit">Submit</button>
          <div className={styles.filter}>
        <label htmlFor="filter">Filter:</label>
        <select id="filter" value={filter} onChange={(e)=>handleFilterChange(e)}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="active">Active</option>
        </select>
      </div>
        </Form>
      </Formik>
        <h4>Number of tasks: {toDoCounter}</h4>
        </div>
      {filteredData.length > 0 && (
        <div className={styles.todoWrapper}>
          {filteredData.map((todo: TodoFormValues, index: number) => (
            <div key={index} className={styles.todo}>
              <h4 onClick={(e)=>userData(todo.user)}>{todo.user}</h4>
              <h5 onClick={()=>typeSelect(todo.type)}>{todo.type}</h5>
              <p>{todo.title}</p>
              {isRedact[index] ? (
                <p key={index} onClick={() => toggleRedact(index)}>
                <span>{todo.content}</span>  
                </p>
              ) : 
            (<span><input type = 'text' defaultValue={todo.content} 
              onBlur ={()=>toggleRedact(index)} 
              onKeyDown={(e)=>{if(e.key === 'Enter'){toggleRedact(index);}}} 
              onChange={(e)=> redContent(index, e.target.value)} autoFocus/></span>)}
            <label htmlFor={`dided${index}`}>Done:</label>
            <input name={`dided${index}`} type="checkbox" onChange={()=>handleChangeComplete(index)} checked = {todo.completed}/>
            <button type="button" onClick={()=>delItem(index)}>Delete</button>
        </div>))}        
      </div>
      )}
    </div>)
 
};

export default TodoForm;
