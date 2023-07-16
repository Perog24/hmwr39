import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

interface TodoFormValues {
  id: string;
  doName: string;
  title: string;
  content: string;
  dided: boolean;
}

const validationSchema = Yup.object().shape({
  doName: Yup.string().required("Executor name is required"),
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
});

const TodoForm = (): JSX.Element => {
  const [formData, setFormData] = useState<TodoFormValues[] >([]);

  const handleSubmit = (values: TodoFormValues, actions: any): void => {
    console.log(values, actions);
    setFormData((prevState)=>[...prevState, values]);
  };

  return (
    <>
      <Formik
        initialValues={{
          id: "",
          doName: "",
          title: "",
          content: "",
          dided: true,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <label htmlFor="doName">Executor name:</label>
          <Field id="doName" name="doName" placeholder="John" />
          <ErrorMessage name="doName" component="div" />

          <label htmlFor="title">Title:</label>
          <Field id="title" name="title" placeholder="Title" />
          <ErrorMessage name="title" component="div" />

          <label htmlFor="content">Content:</label>
          <Field id="content" name="content" placeholder="Content" type="text" />
          <ErrorMessage name="content" component="div" />

          <label htmlFor="dided">Done:</label>
          <Field id="dided" name="dided" type="checkbox" />

          <button type="submit">Submit</button>
        </Form>
      </Formik>
      {formData.length > 0 && (
        <div>
         <p>{formData[0].doName}</p>
         <p>{formData[0].title}</p>
         <p>{formData[0].content}</p>
         <p>{formData[0].dided}</p>
        </div>
        )}
    </>
  );
};

export default TodoForm;
