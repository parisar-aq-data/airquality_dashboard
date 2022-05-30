import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
export const Contact = () => {
  const [lgShow, setLgShow] = useState(false);

  return (
    <>
      <Button
        style={{
          color: "#606161",
          backgroundColor: "#F8F9F9",
          borderColor: "#F8F9F9",
        }}
        onClick={() => setLgShow(true)}
      >
        Contact Us
      </Button>
      <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Reach out to us
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Please send us your questions{" "}
          <a
            href="https://parisar.org/contact-us"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
          .
        </Modal.Body>
      </Modal>
    </>
  );
};
