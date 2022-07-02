import React from "react";

const Myrewards = (props) => {
  return (
    <div className=" md:mx-auto rounded-xl border my-3">
      <div className="">
        <div className="space-y-2 py-3 border-b rounded-t-xl flex justify-between">
          <div className="flex justify-center w-11/12">
            <h3 className="text-white text-[20px] font-[500] font-bold">
              MY REWARDS
            </h3>
          </div>
        </div>
        <div className="text-white flex my-3">
          <div className="flex-1">
            <div className="flex justify-center">Current Shadow Amount</div>
            <div className="flex justify-center">{props.curShadow}</div>
          </div>
          <div className="flex-1">
            <div className="flex justify-center">Time Remaining</div>
            <div className="flex justify-center">{props.estPerDay} MIN</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myrewards;
