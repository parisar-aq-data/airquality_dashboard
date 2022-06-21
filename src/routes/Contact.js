import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

// Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebook,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

export const Contact = () => {
  const [lgShow, setLgShow] = useState(false);
  library.add(faInstagram, faFacebook, faTwitter);

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
        <Modal.Header closeButton style={{ display: "flex" }}>
          <Modal.Title id="example-modal-sizes-title-lg" style={{ flex: 1 }}>
            Reach out to us
          </Modal.Title>
          <span>
            <a
              href="https://www.instagram.com/parisar_org/"
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon
                size={"xl"}
                icon="fa-brands fa-instagram"
                fixedWidth
              />
            </a>
            <a
              href="https://twitter.com/parisarpune"
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon
                size={"xl"}
                icon="fa-brands fa-twitter"
                fixedWidth
              />
            </a>
            <a
              href="https://www.facebook.com/ParisarUrbanTransport/"
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon
                size={"xl"}
                icon="fa-brands fa-facebook"
                fixedWidth
                className="facebook"
              />
            </a>
          </span>
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
