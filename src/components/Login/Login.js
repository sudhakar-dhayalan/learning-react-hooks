import React, { useState, useEffect, useReducer, useContext, useRef } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";
import Input from "../UI/Input/Input";


const emailReducer = (state, action) => {
  if (action.type === "EMAIL_INPUT") {
    return { val: action.val, valid: action.val.includes("@") };
  }
  if (action.type === "EMAIL_VALIDITY") {
    return { val: state.val, valid: state.val.includes("@") };
  }
  return { val: "", valid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === "PASSWORD_INPUT") {
    return { val: action.val, valid: action.val.trim().length > 6 };
  }
  if (action.type === "PASSWORD_VALIDITY") {
    return { val: state.val, valid: state.val.trim().length > 6 };
  }
  return { val: "", valid: false };
};

const Login = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  
  const loginCtx = useContext(AuthContext);
  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    val: "",
    valid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    val: "",
    valid: null,
  });

  useEffect(() => {
    console.log("EFFECT RUNNING");

    return () => {
      console.log("EFFECT CLEANUP");
    };
  }, []);

  const { valid: emailIsValid } = emailState;
  const { valid: passwordIsValid } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("Checking form validity!");
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);

    return () => {
      console.log("CLEANUP");
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    // setEnteredEmail(event.target.value);
    dispatchEmail({ type: "EMAIL_INPUT", val: event.target.value });

    // setFormIsValid(
    //   emailState.val.includes("@") && passwordState.valid
    // );
  };

  const passwordChangeHandler = (event) => {
    // setEnteredPassword(event.target.value);
    dispatchPassword({ type: "PASSWORD_INPUT", val: event.target.value });

    // setFormIsValid(
    //   emailState.val.includes("@") && event.target.value.trim().length > 6
    // );
  };

  const validateEmailHandler = () => {
    // setEmailIsValid(emailState.val.includes("@"));
    dispatchEmail({ type: "EMAIL_VALIDITY" });
  };

  const validatePasswordHandler = () => {
    // setPasswordIsValid(passwordState.val.trim().length > 6);
    dispatchPassword({ type: "PASSWORD_VALIDITY" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      loginCtx.onLogin(emailState.val, passwordState.val);
    } else if(!emailIsValid) {
      emailInputRef.current.focus();
    } else {
      passwordInputRef.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailInputRef}
          type="email"
          id="email"
          label="E-Mail"
          value={emailState.val}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          ref={passwordInputRef}
          type="password"
          id="password"
          label="Password"
          value={passwordState.val}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
