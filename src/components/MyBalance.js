import React from "react";
import { Col, Row, Tab, Nav } from "react-bootstrap";
const Mybalance = (props) => {
  return (
    <div className=" md:mx-auto rounded-xl border my-3">
      <div className="space-y-2 py-3 border-b rounded-t-xl flex justify-between bg-[#000]">
        <div className="flex justify-center w-11/12">
          <h3 className="text-white text-[20px] font-[500] font-bold">
            MY BALANCE
          </h3>
        </div>
      </div>
      <div>
        <div className="text-white flex my-3">
          <div className="flex-1">
            <div className="flex justify-center">SHADOW</div>
            <div className="flex justify-center">{props.myShadow}</div>
          </div>
          <div className="flex-1">
            <div className="flex justify-center">SHADOW in Staking</div>
            <div className="flex justify-center">{props.myXShadow}</div>
          </div>
        </div>
        
        <Tab.Container id="left-tabs-example" defaultActiveKey="first" >
          <Row className="border rounded-x1 mx-5 rounded-t-lg text-white">
            <Col sm={12}>
              <Nav variant="pills" className="flex">
                <Nav.Item className="flex-1">
                  <Nav.Link eventKey="first" className="flex justify-center">Stake</Nav.Link>
                </Nav.Item>
                <Nav.Item className="flex-1">
                  <Nav.Link eventKey="second" className="flex justify-center">Unstake</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
          </Row>
          <Row className="border rounded-b-lg mx-5 mb-3 text-white">
            <Tab.Content>
              <Tab.Pane eventKey="first">
              <div className="py-3 px-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex flex-grow relative items-center">
                    <input ref={props.tokenAmount} placeholder="0.00" min='0' step='0.1' type='number' data-testid='input' className="
                    border rounded-2xl bg-transparent content-right w-full my-input h-10"></input>
                    <div className="shadow-lbl">Shadow</div>
                  </div>
                  <button className="rounded-xl bg-[#323232] text-[15px] p-1" onClick={props.setMaxStake}>Max</button>
                </div>
                <div className="flex justify-center">
                  <div className="button-container py-1 px-3 border">
                    <button onClick={props.stake}>Stake Shadow</button>
                  </div>
                </div>
              </div>
              </Tab.Pane>
              <Tab.Pane eventKey="second">
              <div className="py-3 px-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex flex-grow relative items-center">
                    <input ref={props.xtokenAmount} placeholder="0.00" min='0' step='0.1' type='number' data-testid='input' className="
                    border rounded-2xl bg-transparent content-right w-full my-input h-10"></input>
                    <div className="shadow-lbl">Shadow</div>
                  </div>
                  <button className="rounded-xl bg-[#323232] text-[15px] p-1" onClick={props.setMaxUnstake}>Max</button>
                </div>
                <div className="flex justify-center">
                  <div className="button-container py-1 px-3 border">
                    <button onClick={props.unstake}>Unstake Shadow</button>
                  </div>
                </div>
              </div>
              </Tab.Pane>
            </Tab.Content>
          </Row>
        </Tab.Container>
      </div>
    </div>
  );
};

export default Mybalance;
