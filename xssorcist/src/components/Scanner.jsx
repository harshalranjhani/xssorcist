import React, { useState } from 'react';
import axios from 'axios';
import './Scanner.css'; // Import CSS file for styling

const Scanner = () => {
  const [url, setUrl] = useState('');
  const [vulnerabilityReport, setVulnerabilityReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleScan = async () => {
    setVulnerabilityReport(null);
    if (!url) {
      setErrorMessage('Please enter a URL');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.get(`https://xssorcist-backend.vercel.app/scan?url=${encodeURIComponent(url)}`);
      setVulnerabilityReport(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error scanning website:', error);
      setErrorMessage('Error scanning website. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div>
      <nav className="navbar">
        <h1>Website Vulnerability Scanner</h1>
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
          <button className="scan-button" onClick={handleScan} disabled={isLoading}>
            Scan
          </button>
        </div>
        {isLoading && <p className="loading-message">Scanning in progress...</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {vulnerabilityReport && (
          <div className="report-container">
            <h2>Vulnerability Report</h2>
            <div>
              <h3>Vulnerable Software</h3>
              {vulnerabilityReport.vulnerableSoftware.length === 0 ? (
                <p>No vulnerable software found.</p>
              ) : (
                <ul className="vulnerability-list">
                  {vulnerabilityReport?.vulnerableSoftware?.map((vulnerableSoftware, index) => (
                    <li className="vulnerability-item" key={index}>
                      <p>
                        Software: {vulnerableSoftware.software} | Version: {vulnerableSoftware.version} | Severity:{' '}
                        <span className={`severity-${vulnerableSoftware.severity.toLowerCase()}`}>
                          {vulnerableSoftware.severity}
                        </span>
                      </p>
                      <p>Vulnerability: {vulnerableSoftware.vulnerability}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3>Vulnerable Directories | Severity:{' '}
                        <span className={`severity-${vulnerabilityReport?.vulnerableDirectories[0]?.severity?.toLowerCase()}`}>
                          {vulnerabilityReport.vulnerableDirectories[0].severity}
                        </span></h3>
              {vulnerabilityReport?.vulnerableDirectories?.length === 0 ? (
                <p>No vulnerable directories found.</p>
              ) : (
                <ul className="vulnerability-list">
                  {vulnerabilityReport?.vulnerableDirectories?.map((vulnerableDirectory, index) => (
                    <li className="vulnerability-item" key={index}>
                      <p>
                        Directory: {vulnerableDirectory.directory} 
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3>Vulnerable Files | Severity:{' '}
                        <span className={`severity-${vulnerabilityReport.vulnerableFiles[0].severity.toLowerCase()}`}>
                          {vulnerabilityReport.vulnerableFiles[0].severity}
                        </span></h3>
              {vulnerabilityReport.vulnerableFiles.length === 0 ? (
                <p>No vulnerable files found.</p>
              ) : (
                <ul className="vulnerability-list">
                  {vulnerabilityReport.vulnerableFiles[0].files.map((vulnerableFile, index) => (
                    <li className="vulnerability-item" key={index}>
                      <p>
                        File: {vulnerableFile} 
                      </p>
                    </li>
                  ))}
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
