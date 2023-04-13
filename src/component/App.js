import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import "./App.css";
import bannerImage from "./banner.jpeg";

function App() {
  const [fileData, setFileData] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [isFound, setIsFound] = useState(false);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/data.xlsx`)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        const data = new Uint8Array(arrayBuffer);
        setFileData(data);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleSearch = () => {
    setIsFound(false);
    const workbook = XLSX.read(fileData, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(sheet["!ref"]);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = { r: R, c: C };
        const cellReference = XLSX.utils.encode_cell(cellAddress);
        if (!sheet[cellReference]) continue;
        const cellValue = sheet[cellReference].v;
        if (cellValue === searchValue) {
          setIsFound(true);
          break;
        }
      }
      if (isFound) break;
    }
  };

  return (
    <div className="container">
      <div className="banner" style={{ backgroundImage: `url(${bannerImage})` }}>
        <h1>CodeBeta</h1>
      </div>
      <div className="content-container">
        <h2>Excel Search</h2>
        <div className="search-container">
          <input
            className="search-input"
            type="text"
            placeholder="Enter a value to search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>
        {isFound ? (
          <div className="message success">Congratulations!! You have been shortlisted please be seated while we get back to you</div>
        ) : (
          <div className="message error">Sorry You are not shortlisted for round 2</div>
        )}
      </div>
    </div>
  );
}

export default App;
