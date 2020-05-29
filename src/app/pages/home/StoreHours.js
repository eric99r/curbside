import React from "react";
import { Button, Form, Modal } from "react-bootstrap";


export default function StoreHours(props) {

        const [show, setShow] = React.useState(false);
        
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);
        
        return (

                <div>
                <Button variant="primary" onClick={handleShow}>
                        {props.day[0]}
                      </Button>

                      <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                          <Modal.Title>
                            {props.day} 
                            {props.curbside ? " Curbside " : " Store "} 
                            Hours
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                          <Form>
                            <Form.Label>Open</Form.Label>
                              <Form.Control as="select">
                                <option>Choose...</option>
                                <option>4:00pm</option>
                                <option>4:15pm</option>
                                <option>4:30pm</option>
                              </Form.Control>
                            <Form.Label>Close</Form.Label>
                              <Form.Control as="select">
                                <option>Choose...</option>
                                <option>4:00pm</option>
                                <option>4:15pm</option>
                                <option>4:30pm</option>
                              </Form.Control>
                          </Form>

                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                            Close
                          </Button>
                          <Button variant="primary" onClick={handleClose}>
                            Save Changes
                          </Button>
                        </Modal.Footer>
                      </Modal>
                      </div>
            
        );

};

// class StoreHours extends React.Component {

//     constructor(props, context){
//         super(props, context);

//         [this.show, this.setShow] = React.useState(false);

//         this.daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", 
//                             "Friday", "Saturday", "Sunday"]
        
//         this.handleClose = () => this.setShow(false);
//         this.handleShow = () => this.setShow(true);
        
        
//     }


//     render () {
        
//         return (

//                 <div>
//                 <Button variant="primary" onClick={this.handleShow}>
//                         Launch demo modal
//                       </Button>

//                       <Modal show={this.show} onHide={this.handleClose}>
//                         <Modal.Header closeButton>
//                           <Modal.Title>Monday Store Hours</Modal.Title>
//                         </Modal.Header>
//                         <Modal.Body>

//                           <Form>
//                             <Form.Label>Open</Form.Label>
//                               <Form.Control as="select">
//                                 <option>Choose...</option>
//                                 <option>4:00pm</option>
//                                 <option>4:15pm</option>
//                                 <option>4:30pm</option>
//                               </Form.Control>
//                             <Form.Label>Close</Form.Label>
//                               <Form.Control as="select">
//                                 <option>Choose...</option>
//                                 <option>4:00pm</option>
//                                 <option>4:15pm</option>
//                                 <option>4:30pm</option>
//                               </Form.Control>
//                           </Form>

//                         </Modal.Body>
//                         <Modal.Footer>
//                           <Button variant="secondary" onClick={this.handleClose}>
//                             Close
//                           </Button>
//                           <Button variant="primary" onClick={this.handleClose}>
//                             Save Changes
//                           </Button>
//                         </Modal.Footer>
//                       </Modal>
//                       </div>
            
//         );
//     }
// }

// export default StoreHours;