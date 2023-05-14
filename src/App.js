import React, { useState } from "react";

function App() {
  const [fileContent, setFileContent] = useState(null);
  const [histogramData, setHistogramData] = useState(null);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("https://www.terriblytinytales.com/test.txt");
    const content = await response.text();
    setFileContent(content);
    const words = content.toLowerCase().match(/\w+/g);
    const frequencyMap = {};
    words.forEach((word) => {
      frequencyMap[word] = (frequencyMap[word] || 0) + 1;
    });

    const sortedData = Object.entries(frequencyMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map((item) => ({ word: item[0], frequency: item[1] }));
    setHistogramData(sortedData);

  };

  const handleExportButtonClick = () => {
    const csvContent = `data:text/csv;charset=utf-8,${histogramData
      .map((item) => `${item.word},${item.frequency}`)
      .join("\n")}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "histogram-data.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      <h1>Word Frequency Checker</h1>
      <form onSubmit={handleFormSubmit}>
        <button type="submit" className="btn">Submit</button>
      </form>
      {histogramData && (
        <div>
          <h2>Top 20 words by frequency</h2>
          <ul>
            {histogramData.map((item) => (
              <li key={item.word}>{`${item.word}: ${item.frequency}`}</li>
            ))}
          </ul>
          <button type="button" onClick={handleExportButtonClick} className="btn">
            Export
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
