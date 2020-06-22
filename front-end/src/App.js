import React, { Component } from 'react';
import * as tf from '@tensorflow/tfjs';
import axios from 'axios';
import logo from './logo.svg';
import img from './dadargulung.jpg';

import './App.css';

class App extends Component {
      constructor(props){
        super(props);
        this.state = {
          // Initially, no file is selected
          selectedFile: null,
          imagePreviewUrl: null,
        }
        this.handleChange = this.handleChange.bind(this)
      };


      // Load model tf.js

      load_Model = async () => {
        // '/tfjs_model/model.json'
        let model_path = './tfjs_model/model.json'
        console.log('loading model .................');

        const model_tfjs = await tf.loadLayersModel(model_path);
        //load model
        this.setState({
          model : model_tfjs,
        })
        console.log(model_tfjs.summary());

        const IMAGE_SIZE = 150;

        const logits = tf.tidy(() => {
          const normalizationConstant = 1.0 / 255.0;
          let img = tf.browser.fromPixels(this.photoRef)
                      .resizeBilinear([IMAGE_SIZE, IMAGE_SIZE], false)
                      .expandDims(0)
                      .toFloat()
                      .mul(normalizationConstant)

          console.log(model_tfjs.predict(img).print());

          return model_tfjs.predict(img);
        });

        const classes = await logits.data();
        console.log(classes);
      };

      predict_model = async () => {
        const IMAGE_SIZE = 150;

        const logits = tf.tidy(() => {
          const normalizationConstant = 1.0 / 255.0;
          let img = tf.browser.fromPixels(this.photoRef, 1)
                      .resizeNearestNeighbor([IMAGE_SIZE, IMAGE_SIZE], false)
                      .expandDims(0)
                      .toFloat()
                      .mul(normalizationConstant)

          return this.state.model.predict(img);
        });
      };



      // modelLoad = () => {
      //   if (this.state.selectedFile) {
      //
      //     let offset = tf.scalar(255);
      //     let example = tf.browser.fromPixels(this.photoRef)
      //                                              .resizeNearestNeighbor([150,150])
      //                                              .toFloat()
      //     //                                         //.sub(offset)
      //     //                                         //.div(offset)
      //                                              .expandDims();  // for example
      //
      //     let model = tf.loadLayersModel('model.json', {});
      //     return model.classify(example);
      //     //model.summary();
      //     // model.then(function (res) {
      //     //       const example = tf.browser.fromPixels(this.photoRef)
      //     //                                               .resizeNearestNeighbor([150,150])
      //     //                                               .toFloat()
      //     //                                               //.sub(offset)
      //     //                                               //.div(offset)
      //     //                                               .expandDims();  // for example
      //     //       const prediction = res.predict(example);
      //     //       console.log(prediction);
      //     //   }, function (err) {
      //     //       console.log(err);
      //     //   });
      //     // let prediction = model.predict(example).data();
      //     // return prediction;
      //   }
      // };

      // On file select (from the pop up)
      handleChange = event => {
        // Update the state
        let reader = new FileReader();
        let file = event.target.files[0];

        reader.onloadend = () => {
          this.setState({
            selectedFile: file,
            imagePreviewUrl: reader.result
          });
        }

        reader.readAsDataURL(file)

        // Update the state
        // this.setState({
        //   selectedFile: event.target.files[0]
        // });
      };

      // On file upload (click the upload button)
      onFileUpload = () => {
        // Create an object of formData
        const formData = new FormData();
        // Update the formData object
        formData.append(
          "myFile",
          this.state.selectedFile,
          this.state.selectedFile.name
        );

        // Details of the uploaded file
        console.log(this.state.selectedFile);

        // Request made to the backend api
        // Send formData object
        axios.post("api/uploadfile", formData);
      };

      // File content to be displayed after
      // file upload is complete
      fileData = () => {
        if (this.state.selectedFile) {
          return (
            <div>
              <h2>File Details:</h2>
              <img src={this.state.imagePreviewUrl} alt="preview_gambar" width="300" height="300" />
              <p>File Name: {this.state.selectedFile.name}</p>
              <p>File Type: {this.state.selectedFile.type}</p>
              <p>
                Last Modified:{" "}
                {this.state.selectedFile.lastModifiedDate.toDateString()}
              </p>
            </div>
          );
        } else {
          return (
            <div><br />
              <h4>Choose before Pressing the Upload button</h4>
            </div>
          );
        }
      };

  render () {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <h1>HALOOOOOOOOOOOO</h1>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>

        <div>

            <img src={this.state.imagePreviewUrl} alt="gambar" ref={(ref)=>{this.photoRef = ref}} width="300" height="300" />
            <h1>
              GeeksforGeeks
            </h1>
            <div>
                <button onClick={this.load_Model}> LOAD MODEL </button>
                <input type="file" onChange={this.handleChange}  />
                <button onClick={this.predict_model}>
                  Upload!
                </button>
            </div>
          {this.fileData()}
        </div>

      </div>
    );
  }
}
export default App;
