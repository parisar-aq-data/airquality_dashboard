import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

export const Faq = (props) => {
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);

  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }

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
      <Modal show={show} fullscreen={fullscreen} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Frequently Asked Questions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>What is Air Quality Index (AQI)? </h4>
          <p>
            The Air Quality Index is a way of measuring air pollution, by taking
            into account the presence of different pollutants in air like
            particulate matter (PM 2.5, PM 10), Ozone, CO, SOx and NOx. In
            India, we follow a 500 point scale to show the degree of air
            pollution and take into account 5 major pollutants namely PM2.5,
            PM10, CO, Ozone and NO2.
          </p>
          <h4>Is Pune's air polluted?</h4>{" "}
          <p>
            Pune is one of the 132 nonattainment cities declared under the
            National Clean Air Programme. This means that the air quality in
            Pune does not conform to the National Ambient Air Quality Standards
            prescribed by the Central Board of Pollution Control. The National
            Clean Air Programme was launched in 2019 by the Ministry of
            Environment, Forest and Climate Change, which made it mandatory for
            the nonattainment cities to prepare air action plans. The objective
            of these plans was to reduce the PM 2.5 pollution by 30-40% till
            2024 (with 2017 as the base). Accordingly, Pune has prepared an air
            action plan, and is currently being implemented.{" "}
          </p>
          <h4>Where is all this data coming from? </h4>
          <p>
            The dashboard displays air quality data from four sources, as
            follows
            <ul>
              <li>
                Satellite based data - This data is being plugged in from the
                Blue Sky Analytics, capturing PM 2.5 data based on a grid of 1km
                x 1km. This data is being used to create the base map of Pune
                constituting the 41 administrative wards.
              </li>
              <li>
                Pune Smart City Monitors - The data from 50 low cost monitors,
                spread all over Pune, is being displayed. While the dashboard
                only shows PM 2.5 readings, these monitors capture a range of
                other pollutants like PM 10, sulphur dioxide , nitrogen dioxide,
                carbon monoxide and ozone.{" "}
              </li>
              <li>
                SAFAR - Short for System of Air Quality and Weather Forecasting
                And Research, this application provides data from seven monitors
                installed by the Institute of Tropical Meteorology in Pune. This
                data is used by the Pune Municipal Corporation to prepare its
                Environmental Status Report every year. Apart from PM 2.5, which
                is being displayed on this dashboard, these monitors capture
                pollutants like PM 10 and Ozone.
              </li>{" "}
              <li>
                MPCB - Short for Maharashtra Pollution Control Board, this data
                is captured by the five monitors set up by the board in Pune.
                Apart from PM2.5, these monitors capture data on other
                pollutants, namely SOx, NOx and PM 10.
              </li>
            </ul>
          </p>
          <h4>Why focus on PM 2.5?</h4>{" "}
          <p>
            While air pollution affects our health, particulate matter pollution
            is most hazardous. These minute particles not only enter and damage
            our lungs, but can also enter the bloodstream, thereby affecting
            other vital organs like the heart, kidney and even the brain.
            Increased exposure to high PM 2.5 levels can cause asthma, chronic
            obstructive pulmonary disorder, bronchitis, heart disease,
            alzheimers, kidney disorders and so on. Where does PM 2.5 come from?
            Main sources of PM 2.5 in urban areas are vehicular emissions, coal/
            natural gas fired power plants, and burning.{" "}
          </p>
          <h4>What is being done to improve Pune's air quality? </h4>
          <p>
            Pune has prepared the Air Action Plan as mandated by the NCAP. The
            plan has different actions related to transport, waste management,
            greening etc to improve air quality.
          </p>
          <h4>What can you do with this dashboard?</h4>
          <p>
            This dashboard is a tool to understand air pollution in Pune in a
            simple manner. The variety of data sources allows you to find out
            ward specific pollution, something which can be taken up with your
            local corporator or PMC in order to improve air quality. The
            dashboard can also be used as a learning tool by different schools
            to introduce and understand the issue of air pollution.
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
};
