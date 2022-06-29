import React from "react";

const Poolinfo = () => {
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
            <div className="flex justify-center">445282</div>
          </div>
          <div className="flex-1">
            <div className="flex justify-center">Est APR</div>
            <div className="flex justify-center">17%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Poolinfo;
