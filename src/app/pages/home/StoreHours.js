import React from "react";
import { Button, Form, Modal } from "react-bootstrap";


export default function StoreHours(props) {

        const [show, setShow] = React.useState(false);
        
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);
        
        return (

                <div>
                <Button variant="primary" onClick={handleShow} className={"w-100 p-3"}>
                        {props.day}
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
