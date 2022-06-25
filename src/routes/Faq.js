import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import * as d3 from "d3";
import data from "./../assets/faqs.csv";

export const Faq = (props) => {
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);
  const [faqs, setFaqs] = useState();

  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }

  const getFaqs = async () => {
    await d3.csv(data).then((data) => {
      setFaqs(data);
    });
  };

  useEffect(() => {
    if (!faqs) {
      console.log("calling faqs");
      getFaqs();
    }
  });

  //Components
  if (faqs) {
    const faqComponents = [];
    faqs.forEach((f, i) => {
      // following a hard coded way for a disciplined framing of Q/A in a csv
      let bullets = Object.keys(f).filter(
        (k) => k.includes("bullet") && f[k] !== ""
      );
      faqComponents.push(
        <div>
          <h4 key={i}>{f.question}</h4>
          <p align="justify">{f.answer}</p>
          <ul>
            {bullets.map((b, ind) => (
              <li key={ind} align="justify">
                {f[b]}
              </li>
            ))}
          </ul>
        </div>
      );
    });
    return (
      <div>
        <Button
          style={{
            color: "#606161",
            backgroundColor: "#F8F9F9",
            borderColor: "#F8F9F9",
          }}
          onClick={() => handleShow(true)}
        >
          FAQs
        </Button>
        <Modal
          show={show}
          fullscreen={fullscreen}
          onHide={() => setShow(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Frequently Asked Questions</Modal.Title>
          </Modal.Header>
          <Modal.Body>{faqComponents}</Modal.Body>
        </Modal>
      </div>
    );
  } else return null;
};
