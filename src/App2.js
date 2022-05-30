// // /*
// // Controls the side control panel and the viz Panel
// // */
// import React from "react";

// import "./index.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// import logo from "./assets/ParisarLogo.png";

// import { Nav, Navbar, Container, Alert } from "react-bootstrap";
// import { Faq } from "./routes/Faq";
// import { Contact } from "./routes/Contact";

// import VizPanel from "./visualizationPanel/VizPanel.js";
// import ControlPanel from "./controlPanel/ControlPanel";

// export default class App2 extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     const content = (
//       <>
//         {this.state.alert.alertRaised ? (
//           <Alert
//             variant="danger"
//             onClose={() => this.handleAlerts(false)}
//             dismissible
//           >
//             <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
//             <p>{this.state.alert.alertMessage}</p>
//           </Alert>
//         ) : null}
//         <ControlPanel
//           panCityView={this.state.panCityView}
//           updateDates={this.updateDates}
//           startDate={this.state.startDate}
//           endDate={this.state.endDate}
//           selectedWardOrMonitor={this.state.selectedWardOrMonitor}
//           setSelectedMode={(selectedMode) => {
//             this.setState({
//               selectedMode: selectedMode,
//               selectedWardOrMonitor: "",
//             });
//           }}
//           setSelectedWardOrMonitor={this.setSelectedWardOrMonitor}
//           handlePanCityView={this.handlePanCityView}
//           // getWardOrMonitorHistory={this.getWardOrMonitorHistory.bind(this)}
//           setStartDate={(date) => this.setState({ startDate: date })}
//           setEndDate={(date) => this.setState({ endDate: date })}
//         />
//         {false ? (
//           "Retrieving data . . ."
//         ) : (
//           <VizPanel
//             startDate={this.state.startDate}
//             endDate={this.state.endDate}
//             selectedMode={this.state.selectedMode}
//             panCityView={this.state.panCityView}
//             selectedWardOrMonitor={this.state.selectedWardOrMonitor}
//             rankedWards={this.state.rankedWards}
//             wardOrMonitorHistory={this.state.wardOrMonitorHistory}
//             wardOrMonitorSummary={this.state.wardOrMonitorSummary}
//             wardPolygons={this.state.wardPolygons}
//           />
//         )}
//       </>
//     );
//     return (
//       <BrowserRouter>
//         <div className="parentdiv">
//           <Navbar bg="light">
//             <Container>
//               <Navbar.Brand as={Link} to={"/home"}>
//                 <img alt="" src={logo} className="logo" />
//                 <span className="websiteName">{"Air Quality Dashboard"}</span>
//               </Navbar.Brand>
//               <Nav className="justify-content-end">
//                 <Nav.Link as={Link} to={"/faq"}>
//                   FAQ
//                 </Nav.Link>
//                 <Nav.Link as={Link} to={"/contact"}>
//                   Contact
//                 </Nav.Link>
//               </Nav>
//             </Container>
//           </Navbar>

//           <div>
//             <Routes>
//               <Route path="/faq" element={<Faq />}></Route>
//               <Route path="/contact" element={<Contact />}></Route>
//             </Routes>
//           </div>

//           <div className="content">{content}</div>
//         </div>
//       </BrowserRouter>
//     );
//   }
// }
