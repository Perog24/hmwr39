import { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import {getUsers} from '../functions/placeholder.api'
import styles from './ToDoForm.module.scss';

interface TodoFormValues {
  id: number | null;
  user: string;
  title: string;
  content: string;
  completed: boolean;
}
interface IUsers{
  id: number;
  name: string;
  [key:string]:any
}

const validationSchema = Yup.object().shape({
  user: Yup.string().required("Executor name is required"),
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
});

const TodoForm = (): JSX.Element => {
  const [formData, setFormData] = useState<TodoFormValues[] >([]);
  const [isRedact, setIsRedact] = useState<boolean[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [users, setUsers] = useState<IUsers[]>([])
  
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
    setFormData([...formData, values]);
    setIsRedact([...isRedact, true]);
    actions.resetForm(); 
  };
  
  useEffect(() => {
    localStorage.setItem('ToDoList', JSON.stringify(formData));
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

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };

  const filteredData =
    filter === "completed"
      ? formData.filter((todo) => todo.completed)
      : filter === "active"
      ? formData.filter((todo) => !todo.completed)
      : formData;
 
  return (
    <div className={styles.TodoFormWrapper}>
      <Formik 
        initialValues={{
          id: null,
          user: "",
          title: "",
          content: "",
          completed: false,
          // users: []
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form  className={styles.form}>
          <label htmlFor="user">Executor name:</label>
          {/* <Field className={styles.field}  name="doName" placeholder="John" /> */}
          {/* <ErrorMessage className={styles.error} name="doName" component="div" /> */}
          <Field
             component="select"
             name="user"
             className={styles.field}             
           >
             {users.map((user, index)=>(<option key={index} value={user.name}>{user.name}</option>))}
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
      {filteredData.length > 0 && (
        <div className={styles.todoWrapper}>
          {filteredData.map((todo: TodoFormValues, index: number) => (
            <div key={index} className={styles.todo}>
              <h4>{todo.user}</h4>
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
