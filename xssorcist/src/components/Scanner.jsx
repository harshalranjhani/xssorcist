import React, { useState } from "react";
import axios from "axios";
import "./Scanner.css"; // Import CSS file for styling

const Scanner = () => {
  const [url, setUrl] = useState("");
  const [vulnerabilityReport, setVulnerabilityReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const backendUrl = `https://xssorcist-backend.vercel.app`
  // const backendUrl = `http://localhost:3001`;

  const handleScan = async () => {
    setVulnerabilityReport(null);
    if (!url) {
      setErrorMessage("Please enter a URL");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.get(
        `${backendUrl}/scan?url=${encodeURIComponent(url)}`
      );
      setVulnerabilityReport(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error scanning website:", error);
      setErrorMessage("Error scanning website. Please try again.");
    }

    setIsLoading(false);
  };

  const generatePDF = () => {
    // Send a POST request to the backend with the data
    if (!vulnerabilityReport) {
      return;
    }
    fetch(`${backendUrl}/generate-pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vulnerabilityReport: { ...vulnerabilityReport, url },
      }),
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create a temporary URL for the generated PDF
        const url = window.URL.createObjectURL(new Blob([blob]));

        // Create a temporary link and click it to trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Vulnerability Report - XSSorcist.pdf");
        document.body.appendChild(link);
        link.click();

        // Clean up the temporary URL and link
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <nav className="navbar">
        <h1>XSSorcist</h1>
        <h3>Scan websites anywhere anytime!</h3>
      </nav>
      <div className="scanner-container">
        <div className="input-container">
          <input
            type="text"
            className="url-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL"
          />
          <button
            className="scan-button"
            onClick={handleScan}
            disabled={isLoading}
          >
            Scan
          </button>
        </div>
        {isLoading && (
          <p className="loading-message">Scanning in progress...</p>
        )}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {vulnerabilityReport && (
          <button
            className="scan-button"
            onClick={generatePDF}
            disabled={isLoading}
          >
            Download Report
          </button>
        )}
        {vulnerabilityReport && (
          <div className="report-container">
            <h2>Vulnerability Report</h2>
            <div>
              <h3>Vulnerable Software</h3>
              {vulnerabilityReport.vulnerableSoftware.length === 0 ? (
                <p>No vulnerable software found.</p>
              ) : (
                <ul className="vulnerability-list">
                  {vulnerabilityReport?.vulnerableSoftware?.map(
                    (vulnerableSoftware, index) => (
                      <li className="vulnerability-item" key={index}>
                        <p>
                          Software: {vulnerableSoftware.software} | Version:{" "}
                          {vulnerableSoftware.version} | Severity:{" "}
                          <span
                            className={`severity-${vulnerableSoftware.severity.toLowerCase()}`}
                          >
                            {vulnerableSoftware.severity}
                          </span>
                        </p>
                        <p>Vulnerability: {vulnerableSoftware.vulnerability}</p>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
            <div>
              <h3>
                Vulnerable Directories{" "}
                {vulnerabilityReport?.vulnerableDirectories?.length !== 0 && (
                  <>
                    | Severity:{" "}
                    <span
                      className={`severity-${vulnerabilityReport?.vulnerableDirectories[0]?.severity?.toLowerCase()}`}
                    >
                      {vulnerabilityReport.vulnerableDirectories[0].severity}
                    </span>
                  </>
                )}{" "}
              </h3>
              {vulnerabilityReport?.vulnerableDirectories?.length === 0 ? (
                <p>No vulnerable directories found.</p>
              ) : (
                <ul className="vulnerability-list">
                  {vulnerabilityReport?.vulnerableDirectories?.map(
                    (vulnerableDirectory, index) => (
                      <li className="vulnerability-item" key={index}>
                        <p>Directory: {vulnerableDirectory.directory}</p>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
            <div>
              <h3>
                Vulnerable Files{" "}
                {vulnerabilityReport?.vulnerableFiles?.length !== 0 && (
                  <>
                    | Severity:{" "}
                    <span
                      className={`severity-${vulnerabilityReport?.vulnerableFiles[0]?.severity?.toLowerCase()}`}
                    >
                      {vulnerabilityReport.vulnerableFiles[0].severity}
                    </span>
                  </>
                )}{" "}
              </h3>
              {vulnerabilityReport.vulnerableFiles.length === 0 ? (
                <p>No vulnerable files found.</p>
              ) : (
                <ul className="vulnerability-list">
                  {vulnerabilityReport.vulnerableFiles[0].files.map(
                    (vulnerableFile, index) => (
                      <li className="vulnerability-item" key={index}>
                        <p>File: {vulnerableFile}</p>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
            <div>
              <h3>
                XSS Vulnerability URL{" "}
                {vulnerabilityReport?.hasXSSInURLData?.length !== 0 && (
                  <>
                    | Severity:{" "}
                    <span
                      className={`severity-${vulnerabilityReport?.hasXSSInURLData[0]?.severity?.toLowerCase()}`}
                    >
                      {vulnerabilityReport?.hasXSSInURLData[0]?.severity}
                    </span>
                  </>
                )}{" "}
              </h3>
              {vulnerabilityReport?.hasXSSInURLData?.length === 0 ? (
                <p>No vulnerabilities found.</p>
              ) : (
                <ul className="vulnerability-list">
                  {vulnerabilityReport?.hasXSSInURLData?.map(
                    (vulnerableXSS, index) => (
                      <li className="vulnerability-item" key={index}>
                        <p>Parameter: {vulnerableXSS.parameter}</p>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
            <div>
              <h3>
                XSS Vulnerability in Form Inputs{" "}
                {vulnerabilityReport?.hasXSSInFormsData?.length !== 0 && (
                  <>
                    | Severity:{" "}
                    <span
                      className={`severity-${vulnerabilityReport?.hasXSSInFormsData[0]?.severity?.toLowerCase()}`}
                    >
                      {vulnerabilityReport?.hasXSSInFormsData[0]?.severity}
                    </span>
                  </>
                )}{" "}
              </h3>
              {vulnerabilityReport?.hasXSSInFormsData?.length === 0 ? (
                <p>No vulnerabilities found.</p>
              ) : (
                <ul className="vulnerability-list">
                  {vulnerabilityReport?.hasXSSInFormsData?.map(
                    (vulnerableXSS, index) => (
                      <li className="vulnerability-item" key={index}>
                        <p>Field: {vulnerableXSS.field}</p>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scanner;
