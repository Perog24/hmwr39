import { useLocation } from "react-router-dom";

import styles from './Household.module.scss';

const Household = () => {
   const {todoTypeArr} = useLocation().state;
   const headerText:string = todoTypeArr[0].type
   return (
      <div className={styles.mainWrapper}>
         <h1>{headerText.toUpperCase()}</h1>
         <div className={styles.HouseholdWrapper}>
          {todoTypeArr.map((todo:any, index: number) => (
            <div key={index} className={styles.todo}>
              <h4 >{todo.user}</h4>
              <h5>{todo.type}</h5>
              <p>{todo.title}</p>
              <p className={styles.content} key={index}><span>{todo.content}</span></p>
              {todo.completed ? (<h3>Done</h3>) : (<h3>Processed</h3>)}
            </div>))}
            </div>
      </div>
      )
}
export default Household;