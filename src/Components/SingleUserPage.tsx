import { useLocation } from "react-router-dom";

import style from './SingleUserPage.module.scss';
import { NavLink } from 'react-router-dom';
 
const SingleUserPage = ():JSX.Element=> {
   const {user, userToDo} = useLocation().state;
   const {city, street, suite} = user.address;
   console.log(user);
   console.log(userToDo);
   return <div className={style.singleUserPageWrapper} >  
      
      <div className={style.userInfoWrapper}> 
         <NavLink to='/'className={style.homeNav}>Home</NavLink>
         <p><strong> ID: </strong> <span className={style.datatext}>{user.id}</span></p>  
         <p><strong>Name:</strong> <span className={style.datatext}> {user.name}</span> </p>
         <p><strong>Login:</strong>  <span className={style.datatext}>{user.username}</span> </p>
         <p><strong>Phone:</strong> <span className={style.datatext}> {user.phone}</span></p>
         <p><strong>Email:</strong> <span className={style.datatext}> {user.email}</span></p>
         <p><strong>Web:</strong> <span className={style.datatext}> {user.website}</span></p>
         <p><strong>Address:</strong> <span className={style.datatext}> {city}, {street}, {suite}</span></p>
      </div> 
      <div className={style.todoWrapper}>
          {userToDo.map((todo:any, index: number) => (
            <div key={index} className={style.todo}>
              <h4 >{todo.user}</h4>
              <p>{todo.title}</p>
              <p key={index}><span>{todo.content}</span></p>
              {todo.completed ? (<h3>Done</h3>) : (<h3>Processed</h3>)}
            </div>))}
      </div>
      </div>;
}
   
export default SingleUserPage;