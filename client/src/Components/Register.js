import React, { useState, useRef, useEffect } from "react";
import AuthService from "../Services/AuthService";
import Message from "../Components/Message";

const Register = (props) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    mobile: "",
    status: "",
    password: "",
    accountType: "",
  });
  const [message, setMessage] = useState(null);
  let timerID = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(timerID);
    };
  }, []);

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setUser({
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: "",
      mobile: "",
      status: "",
      password: "",
      accountType: "",
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    AuthService.register(user).then((data) => {
      const { message } = data;
      setMessage(message);
      resetForm();
      if (!message.msgError) {
        timerID = setTimeout(() => {
          props.history.push("/login");
        }, 2000);
      }
    });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <h3>Please Register</h3>

        <label htmlFor="firstName" className="sr-only">
          firstName:{" "}
        </label>
        <input
          type="text"
          name="firstName"
          value={user.firstName}
          onChange={onChange}
          className="form-control"
          placeholder="Enter First Name"
        />

        <label htmlFor="lastName" className="sr-only">
          lastName:{" "}
        </label>
        <input
          type="text"
          name="lastName"
          value={user.lastName}
          onChange={onChange}
          className="form-control"
          placeholder="Enter Last Name"
        />

        <label htmlFor="email" className="sr-only">
          email:{" "}
        </label>
        <input
          type="text"
          name="email"
          value={user.email}
          onChange={onChange}
          className="form-control"
          placeholder="Enter email"
        />

        <label htmlFor="dateOfBirth" className="sr-only">
          dateOfBirth:{" "}
        </label>
        <input
          type="date"
          name="dateOfBirth"
          value={user.dateOfBirth}
          onChange={onChange}
          className="form-control"
          placeholder="Enter Birthday"
        />

        <label htmlFor="mobile" className="sr-only">
          mobile:{" "}
        </label>
        <input
          type="Number"
          name="mobile"
          value={user.mobile}
          onChange={onChange}
          className="form-control"
          placeholder="Enter mobile"
        />

        <label htmlFor="status" className="sr-only">
          status:{" "}
        </label>
        <input
          type="Boolean"
          name="status"
          value={user.status}
          onChange={onChange}
          className="form-control"
          placeholder="Enter status (If married type true | If not type false)"
        />

        <label htmlFor="password" className="sr-only">
          Password:{" "}
        </label>
        <input
          type="password"
          name="password"
          value={user.password}
          onChange={onChange}
          className="form-control"
          placeholder="Enter Password"
        />
        <label htmlFor="accountType" className="sr-only">
          accountType:{" "}
        </label>
        <input
          type="text"
          name="accountType"
          value={user.accountType}
          onChange={onChange}
          className="form-control"
          placeholder="Enter accountType (admin/student)"
        />
        <button className="btn btn-lg btn-primary btn-block" type="submit">
          Register
        </button>
      </form>
      {message ? <Message message={message} /> : null}
    </div>
  );
};

export default Register;
