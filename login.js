import React, { useState } from "react";
import { GoogleLogin } from "react-google-login";

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});

  const responseGoogle = (response) => {
    setUserData(response.profileObj);
    setIsLoggedIn(true);
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <p>Welcome {userData.givenName}!</p>
        </div>
      ) : (
        <GoogleLogin
          clientId="your-google-client-id"
          buttonText="Login with Google"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
        />
      )}
    </div>
  );
};

export default Login;
