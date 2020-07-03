import React, { Component } from 'react';
import * as tf from '@tensorflow/tfjs';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class App extends Component {
      constructor(props){
        super(props);
        this.state = {
          // Initially, no file is selected
          selectedFile: null,
          imagePreviewUrl: null,
          pred: "",
          model : null,
          speed: 1,
        }
        //this.prediction = null;
        this.handleChange = this.handleChange.bind(this);
        this.modelPredict = this.modelPredict.bind(this);
        this.modelReady = this.modelReady.bind(this);
      };

      componentDidMount() {
        let modelSementara = this.modelLoad();
        modelSementara.then((res)=>{
          this.setState({
            model : res,
          })
        });
      };

      modelLoad() {
        console.log('Loading data');
        return tf.loadLayersModel('./tfjs_model/model.json');
      };

      modelReady = () => {
        if (this.state.model) {
          return (
            <div className="model-section">
              <p>Model Ready</p>
              <div>
                <input className="button" type="file" onChange={this.handleChange} />
              </div>
              <div>{this.fileData()}</div>
              <button className="button" onClick={this.modelPredict}> check my answer </button>
              <div>{this.dataPredict()}</div>
            </div>
          )} else {
            return (
            <div className="model-section">
              <p>Loading Model...</p>
              <img style={{animation: `spin ${this.state.speed}s linear infinite`}} src={'./restart_white.png'} alt="wait" height="20"/>
            </div>
          )};
      };

      // Load model tf.js
      modelPredict = async () => {
        if (this.state.selectedFile) {
          const label = ['kue dadar gulung', 'kue kastengel', 'kue klepon', 'kue lapis', 'kue lumpur', 'kue putri salju', 'kue risoles', 'kue serabi'];

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
            pred: prediction,
          });
          //console.log(classes.indexOf(Math.max(...classes)));
          //console.log(label[classes.indexOf(Math.max(...classes))]);
          console.log(this.state.pred);
        } else {
          // to handle error in predict null image
          alert("The file cannot be empty!");
        }
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
            <div className="predict">
              <h2>{this.state.pred}</h2>
            </div>
          )};
      };

      fileData = () => {
        if (this.state.selectedFile) {
          return (
            <div className="show-file">
              <p>Image:</p>
              <img className="preview_gambar" src={this.state.imagePreviewUrl} alt="preview_gambar" ref={(ref)=>{this.photoRef = ref}} />
            </div>
          );} else {
          return (
            <div className="show-file">
              <p>Choose file before click the button below</p>
            </div>
          );}
      };

  render () {
    return (
      <div className="App">
        <div className="App-header">
          <div className="Title">
            <h1> Guessing Indonesian Traditional Snack </h1>
            <div>
              Insert a photo of one of these snacks, and I'll guess the name of the snack!
              <p className="nama-kue">kue dadar gulung - kue kastengel - kue klepon - kue lapis - kue lumpur - kue putri salju - kue risoles - kue serabi</p>
            </div>
            <div>
              <img className="Image" src={'./dessert_icon.png'} height="auto" alt="logo"/>
            </div>
          </div>
          <div className="Machine-Learning-Section"> {this.modelReady()} </div>
        </div>
        <div className="Footer">
          Final Project Bangk!t Academy <br/>
          Using EfficientNet Model for CNN Image Classification <br/>
          By : Annisa Sekar Ayuningtyas & Ilham Firdausi Putra <br/><br/>
          Icons made by <a href="https://www.flaticon.com/" title="flaticon"> www.flaticon.com</a>
        </div>
      </div>


    );
  }
}
export default App;
