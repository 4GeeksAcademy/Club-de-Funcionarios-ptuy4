import React, { useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; 
import "react-date-range/dist/theme/default.css"; 
import "../../styles/index.css"; 

const Library = () => {
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const handleSelect = (ranges) => {
    setSelectionRange(ranges.selection);
  };

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{
        color: "white",
        height: "100vh",
        margin: 0,
        padding: 0,
      }}
    >
      <div className="row w-100 h-100 m-0">
        <div
          className="col-5 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="text-center px-4">
            <h1 className="mb-4">BIBLIOTECA</h1>
            <DateRange
              ranges={[selectionRange]}
              onChange={handleSelect}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              editableDateInputs={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
