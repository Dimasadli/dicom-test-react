import JSZip from "jszip";
import React, { Component } from "react";
import { Form } from "react-bootstrap";
import CornerstoneViewport from "react-cornerstone-viewport";
import axios from "axios";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";

class Viewer extends Component {
  stack1 = [];

  stack2 = ["dicomweb://127.0.0.1:8000/media/2023/01/15/1673788303706.dcm"];

  state = {
    activeViewportIndex: 0,
    viewports: [0, 1, 2, 3],
    tools: [
      // Mouse
      {
        name: "Wwwc",
        mode: "active",
        modeOptions: { mouseButtonMask: 1 },
      },
      {
        name: "Zoom",
        mode: "active",
        modeOptions: { mouseButtonMask: 2 },
      },
      {
        name: "Pan",
        mode: "active",
        modeOptions: { mouseButtonMask: 4 },
      },
      "Length",
      "Angle",
      "Bidirectional",
      "FreehandRoi",
      "Eraser",
      // Scroll
      { name: "StackScrollMouseWheel", mode: "active" },
      // Touch
      { name: "PanMultiTouch", mode: "active" },
      { name: "ZoomTouchPinch", mode: "active" },
      { name: "StackScrollMultiTouch", mode: "active" },
    ],
    imageIds: this.stack1,
    // FORM
    activeTool: "Wwwc",
    imageIdIndex: 0,
    isPlaying: false,
    frameRate: 22,
  };

  async componentDidMount() {
    const files = [];
    const url = "http://127.0.0.1:8000/media/2022/05/17/1652787779995.zip";
    const { data } = await axios.get(url, {
      headers: {
        "Content-Type": "application/zip",
      },
      responseType: "arraybuffer",
    });
    const zip = await JSZip.loadAsync(data);
    const filenames = Object.keys(zip.files);
    for (const filename of filenames) {
      const dicom = await zip.files[filename].async("blob");
      const image = await cornerstoneWADOImageLoader.wadouri.fileManager.add(
        dicom
      );
      files.push(image);
    }

    this.stack1 = files;
    this.setState({
      imageIds: files,
    });
  }

  render() {
    return (
      <div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {this.state.viewports.map((vp) => (
            <CornerstoneViewport
              key={vp}
              style={{ minWidth: "50%", height: "256px", flex: "1" }}
              tools={this.state.tools}
              imageIds={this.state.imageIds}
              imageIdIndex={this.state.imageIdIndex}
              isPlaying={this.state.isPlaying}
              frameRate={this.state.frameRate}
              className={this.state.activeViewportIndex === vp ? "active" : ""}
              activeTool={this.state.activeTool}
              setViewportActive={() => {
                this.setState({
                  activeViewportIndex: vp,
                });
              }}
            />
          ))}
        </div>

        {/* FORM */}
        <div style={{ marginTop: "35px" }}>
          <form className="row">
            {/* FIRST COLUMN */}
            <div className="col-md-6">
              <div className="form-group mb-3">
                <label htmlFor="active-tool">Active Tool:</label>
                <select
                  value={this.state.activeTool}
                  onChange={(evt) =>
                    this.setState({ activeTool: evt.target.value })
                  }
                  className="form-control"
                  id="active-tool">
                  <option value="Wwwc">Wwwc</option>
                  <option value="Zoom">Zoom</option>
                  <option value="Pan">Pan</option>
                  <option value="Length">Length</option>
                  <option value="Angle">Angle</option>
                  <option value="Bidirectional">Bidirectional</option>
                  <option value="FreehandRoi">Freehand</option>
                  <option value="Eraser">Eraser</option>
                </select>
              </div>
              <div className="form-group mb-3">
                <label htmlFor="image-id-index">Image ID Index:</label>
                <Form.Range
                  id="image-id-index"
                  min="0"
                  max={this.state.imageIds.length - 1}
                  value={this.state.imageIdIndex}
                  onChange={(evt) =>
                    this.setState({ imageIdIndex: parseInt(evt.target.value) })
                  }
                  className="form-control"
                />
                {/* <input
                  type="range"
                  min="0"
                  max={this.state.imageIds.length - 1}
                  value={this.state.imageIdIndex}
                  onChange={(evt) =>
                    this.setState({ imageIdIndex: parseInt(evt.target.value) })
                  }
                  className="form-control"
                  id="image-id-index"></input> */}
              </div>
              <div className="form-group">
                <label htmlFor="image-id-stack">Image ID Stack:</label>
                <select
                  defaultValue={1}
                  onChange={(evt) => {
                    const selectedStack =
                      parseInt(evt.target.value) === 1
                        ? this.stack1
                        : this.stack2;

                    this.setState({
                      imageIds: selectedStack,
                      imageIdIndex: 0,
                    });
                  }}
                  className="form-control"
                  id="image-id-stack">
                  <option value="1">Stack 1</option>
                  <option value="2">Stack 2</option>
                </select>
              </div>
            </div>
            {/* SECOND COLUMN */}
            <div className="col-md-6">
              <div className="form-group mb-4">
                <label htmlFor="active-viewport-index">
                  Active Viewport Index:
                </label>
                <input
                  type="text"
                  readOnly={true}
                  value={this.state.activeViewportIndex}
                  className="form-control"
                  id="active-viewport-index"></input>
              </div>
              <div className="input-group">
                <span className="input-group-btn">
                  <button
                    className={`btn btn-${
                      this.state.isPlaying
                        ? "outline-danger"
                        : "outline-primary"
                    }`}
                    type="button"
                    onClick={() => {
                      this.setState({
                        isPlaying: !this.state.isPlaying,
                      });
                    }}>
                    {this.state.isPlaying
                      ? "Stop Start Image Slider"
                      : "Start Image Slider"}
                  </button>
                </span>
                <input
                  type="number"
                  className="form-control"
                  value={this.state.frameRate}
                  onChange={(evt) => {
                    const frameRateInput = parseInt(evt.target.value);
                    const frameRate = Math.max(Math.min(frameRateInput, 90), 1);

                    this.setState({ frameRate });
                  }}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Viewer;
