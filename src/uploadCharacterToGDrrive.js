import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { saveAs } from 'file-saver';
import { googleDriveClientId, googleDriveApiKey, googleDriveScope } from './config';

const SaveCharacterSheet = ({ characterSheetData }) => {

  const handleGoogleLoginSuccess = (response) => {
    const token = response.accessToken;
    const { gapi } = window;

    gapi.load('client', () => {
      gapi.client.init({
        apiKey: googleDriveApiKey,
        clientId: googleDriveClientId,
        scope: googleDriveScope
      }).then(() => {
        gapi.auth.setToken({
          access_token: token
        });

        const fileContent = JSON.stringify(characterSheetData);
        const file = new Blob([fileContent], { type: 'application/json' });

        const metadata = {
          name: 'character_sheet.json',
          mimeType: 'application/json'
        };

        const uploader = new MediaUploader({
          file,
          metadata,
          token,
          onComplete: (file) => {
            console.log('File uploaded successfully!', file);
          },
          onError: (error) => {
            console.error('Error uploading file:', error);
          }
        });
        uploader.upload();
      });
    });
  };

  const handleGoogleLoginFailure = (response) => {
    console.error('Google login failed:', response);
  };

  return (
    <div>
      <GoogleLogin
        clientId={googleDriveClientId}
        onSuccess={handleGoogleLoginSuccess}
        onFailure={handleGoogleLoginFailure}
        buttonText="Save to Google Drive"
      />
    </div>
  );
};

export default SaveCharacterSheet;

import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import { GoogleDriveAPI } from './google-drive-api';

class GoogleDriveUploader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      accessToken: null,
      error: null,
      success: null
    };
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleGoogleResponse = this.handleGoogleResponse.bind(this);
  }

  onSuccess() {
    this.setState({ success: 'File uploaded successfully.' });
  }

  onError(error) {
    this.setState({ error: `File upload failed: ${error}` });
  }

  async handleUpload() {
    try {
      const api = new GoogleDriveAPI(this.state.accessToken);
      await api.uploadFile(this.props.data, this.props.filename);
      this.onSuccess();
    } catch (e) {
      this.onError(e);
    }
  }

  handleGoogleResponse(response) {
    if (response.accessToken) {
      this.setState({ accessToken: response.accessToken }, this.handleUpload);
    } else {
      this.setState({ error: 'Google authentication failed.' });
    }
  }

  render() {
    return (
      <div>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          onSuccess={this.handleGoogleResponse}
          onFailure={this.handleGoogleResponse}
        />
        {this.state.success && <div>{this.state.success}</div>}
        {this.state.error && <div>{this.state.error}</div>}
      </div>
    );
  }
}

export default GoogleDriveUploader;
