import React from "react";
import { propTypes } from "react-bootstrap/esm/Image";

const Poolinfo = (props) => {
  return (
    <div className=" md:mx-auto rounded-xl border">
      <div className="">
        <div className="space-y-2 py-3 border-b rounded-t-xl flex justify-between">
          <div className="flex justify-center w-11/12">
            <h3 className="text-white text-[20px] font-[500] font-bold">
              POOL INFO
            </h3>
          </div>
        </div>
        <div className="text-white flex my-3">
          <div className="flex-1">
            <div className="flex justify-center">Total Shadow Staked</div>
            <div className="flex justify-center">{props.totalStaked}</div>
          </div>
          <div className="flex-1">
            <div className="flex justify-center">Locked Time</div>
            <div className="flex justify-center">{props.estApr}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Poolinfo;
