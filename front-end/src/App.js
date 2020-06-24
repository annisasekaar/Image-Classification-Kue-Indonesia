import React, { Component } from 'react';
import * as tf from '@tensorflow/tfjs';
import 'bootstrap/dist/css/bootstrap.css';
// Put any other imports below so that CSS from your
// components takes precedence over default styles.

import './App.css';

class App extends React.Component {
      constructor(props){
        super(props);
        this.state = {
          // Initially, no file is selected
          selectedFile: null,
          imagePreviewUrl: null,
          pred: "",
          model : null,
        }
        //this.prediction = null;
        this.handleChange = this.handleChange.bind(this);
        this.modelPredict = this.modelPredict.bind(this);
        this.modelReady = this.modelReady.bind(this);
        //this.loadsBISIMILLAH = this.loadsBISIMILLAH.bind(this);
      };

      componentDidMount() {
        let modelSementara = this.loadss();
        modelSementara.then((res)=>{
          this.setState({
            model : res,
          })
        });
      };

      loadss() {
        console.log('Loading data');
        return tf.loadLayersModel('./tfjs_model/model.json');
      };

      modelReady = () => {
        if (this.state.model) {
          return (
            <div>
              <h3>MODEL READY</h3>
            </div>
          )} else {
            return (
            <div>
              <h2>LOADING MODEL............</h2>
            </div>
          )}
      };


      // Load model tf.js
      modelPredict = async () => {

        const label = ['kue dadar gulung', 'kue kastengel', 'kue klepon', 'kue lapis', 'kue lumpur', 'kue putri salju', 'kue risoles', 'kue serabi'];
        // let model_path = './tfjs_model/model.json';
        // console.log('loading model .................');
        //
        // const model_tfjs = await tf.loadLayersModel(model_path);
        // //load model
        // console.log(model_tfjs.summary());

        const IMAGE_SIZE = 150;

        const logits = tf.tidy(() => {
          const normalizationConstant = 1.0 / 255.0;
          let img = tf.browser.fromPixels(this.photoRef)
                      .resizeBilinear([IMAGE_SIZE, IMAGE_SIZE], false)
                      .expandDims(0)
                      .toFloat()
                      .mul(normalizationConstant)

          console.log(this.state.model.predict(img).print());

          return this.state.model.predict(img);
        });

        const classes = await logits.data();
        const prediction = await label[classes.indexOf(Math.max(...classes))];
        this.setState({
          pred: prediction
        });
        //console.log(classes.indexOf(Math.max(...classes)));
        //console.log(label[classes.indexOf(Math.max(...classes))]);
        console.log(this.state.pred);

      };

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
      };

      dataPredict = () => {
        if (this.state.pred) {
          return (
            <div>
              <h2>{this.state.pred}</h2>
            </div>
          );}
      };

      // File content to be displayed after
      // file upload is complete
      fileData = () => {
        if (this.state.selectedFile) {
          return (
            <div>
              <h4>Image:</h4>
              <img src={this.state.imagePreviewUrl} alt="preview_gambar" ref={(ref)=>{this.photoRef = ref}} width="300" height="300" />
            </div>
          );} else {
          return (
            <div>
              <h5>Choose file before Pressing the Upload button</h5>
            </div>
          );}
      };

  render () {
    return (
      <div className="App">
        <header className="App-header">
          <h1> Guessing Indonesian Traditional Snack </h1>
          <div>
            Insert a photo of one of these snacks, and I'll guess the name of the snack!
            <h6>kue dadar gulung - kue kastengel - kue klepon - kue lapis - kue lumpur - kue putri salju - kue risoles - kue serabi</h6>
          </div>
          <img src={'./dessert_icon.png'} alt="logo" height="200" />
          <div>
            <input type="file" onChange={this.handleChange}  />
          </div>
          {this.fileData()}
          <div>
            {this.modelReady()}
            <button onClick={this.modelPredict}> CHECK MY ANSWER </button> <br/>
            {this.dataPredict()}
          </div>
        </header>
          <div><br/>
            Final Project Bangk!t Academy <br/>
            Using EfficientNet Model for CNN Image Classification <br/>
            By : Annisa Sekar A & Ilham Firdausi Putra <br/><br/>
          </div>
          Icons made by <a href="https://www.flaticon.com/authors/iconixar" title="iconixar">iconixar</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
      </div>


    );
  }
}
export default App;
