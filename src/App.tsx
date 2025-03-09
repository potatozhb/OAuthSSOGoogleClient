import "./App.css";
import styled from "styled-components";
import { Link, Route, Switch, useHistory } from "react-router-dom";
import GoogleButton from "react-google-button";
import { LoginSuccess } from "./app/containers/LoginSuccess";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, setIsAuthenticated } from "./app/appSlice";
import diagram from './googlesso.png';

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 31px;
`;

function App() {
  const user = useSelector((state: any) => state.app.authUser as any) as any;
  const dispatch = useDispatch();
  const history = useHistory();

  const fetchAuthUser = async () => {
    const response = await axios
      .get(process.env.REACT_APP_CLIENT_API_ADDRESS + "/api/auth/user", { withCredentials: true })
      .catch((err) => {
        console.log("Not properly authenticated" + err);
        
        dispatch(setIsAuthenticated(false));
        dispatch(setAuthUser(null));
        history.push("/login/error");
      });

    if (response && response.data) {
      console.log("User: ", response.data);
      dispatch(setIsAuthenticated(true));
      dispatch(setAuthUser(response.data));
      history.push("/welcome");
    }
  };

  const redirectToGoogleSSO = async () => {
    let timer: NodeJS.Timeout | null = null;
    const googleLoginURL = process.env.REACT_APP_CLIENT_API_ADDRESS + "/api/login/google";
    const newWindow = window.open(
      googleLoginURL,
      "_blank",
      "width=500,height=600"
    );

    if (newWindow) {
      timer = setInterval(() => {
        if (!newWindow.closed) {
          console.log("Yay we're authenticated");
          fetchAuthUser();
          if (timer) clearInterval(timer);
        }
      }, 500);
    }
  };

  return (
    <AppContainer>
      <Switch>
        <Route exact path="/">
          Welcome SSO OAuth2.0 Demo by google IDP Client!
          <Link to="/login">Login</Link>
        </Route>
        <Route exact path="/login">
          <GoogleButton onClick={redirectToGoogleSSO} />
          <img src = {diagram} alt="Diagram"
                style={{ 
                  height: '800px',      // Limiting height
                  width: 'auto',      // Maintain aspect ratio
                  maxWidth: '100%'     // Ensuring it doesn't overflow container
                }}/>
        </Route>
        <Route path="/welcome">Welcome Back {user && user.fullname}</Route>
        <Route exact path="/login/success" component={LoginSuccess} />
        <Route path="/login/error">
          Error loging in. Please try again later!
        </Route>
      </Switch>
    </AppContainer>
  );
  
}

export default App;
