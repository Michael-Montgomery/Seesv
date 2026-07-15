// import logo from './logo.svg';
import { useMemo, useState } from 'react';
import './App.css';
import Header from './components/header/header';
import Papa from "papaparse";
import Footer from './components/footer/footer';
import html2pdf from "html2pdf.js";
import Modal from 'react-modal';
import AdSlot from './components/adslot/adslot';

// Set app element for accessibility
Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

function App() {

  const [showIntro, setShowIntro] = useState(true);
  const [csvData, setCsvData] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });
  const [docTitle, setDocTitle] = useState('');
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const exportPDF = () => {
    const element = document.getElementById("pdf-content");

    html2pdf()
      .from(element)
      .set({
        margin: 10,
        filename: `${docTitle || "document"}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { format: "letter", orientation: "portrait" },
      })
      .save();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    Papa.parse(file, {
      header: true, // converts rows into objects using header row
      skipEmptyLines: true,
      complete: (results) => {
        setShowIntro(false);
        setCsvData(results.data);
        console.log(results.data);
        if (results.data.length > 0) {
          setVisibleColumns(Object.keys(results.data[0]));
        }
      },
    });
  };

  const exportSingleRecordPDF = () => {
    const element = document.getElementById("single-record-pdf-content");

    html2pdf()
      .from(element)
      .set({
        margin: 10,
        filename: `${docTitle || "document"}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { format: "letter", orientation: "portrait" },
      })
      .save();
  };

  const handleSort = (column) => {
    setSortConfig(prev => {
      if (prev.key === column) {
        return {
          key: column,
          direction: prev.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key: column, direction: 'asc' };
    });
  };

  const sortedData = useMemo(() => {
    if (!csvData) return [];

    const sorted = [...csvData];

    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        // handle numbers vs strings
        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortConfig.direction === 'asc'
            ? aNum - bNum
            : bNum - aNum;
        }

        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });
    }

    return sorted;
  }, [csvData, sortConfig]);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleRowClick = (row) => {
    console.log("Row clicked:", row);
    setSelectedRow(row);
    openModal();
  };

  return (
    <>
      <Header />

      <main className='app-shell'>
        <aside className='ad-rail ad-rail-left'>
          <AdSlot slot={process.env.REACT_APP_ADSENSE_LEFT_RAIL_SLOT} className='ad-card' />
        </aside>

        <section className='app-main-content'>
          <div className='ad-banner ad-banner-top'>
            <AdSlot
              slot={process.env.REACT_APP_ADSENSE_TOP_BANNER_SLOT}
              className='ad-card'
              format='horizontal'
            />
          </div>

      {
        showIntro && <div className='intro'>
          <h2>Welcome to SeeSV!</h2>
          <p>SeeSV is a 100% free, easy-to-use CSV viewer and exporter. SeeSV does not and will never send your data anywhere. To get started, click the button below to upload a CSV file. </p>

        </div>

      }
      <input type="file" id="csvFileInput" accept=".csv" onChange={handleFileUpload} style={{display: showIntro ? 'block' : ''}}/>
      {
        !showIntro && <button className='export-btn' onClick={exportPDF}>Export to PDF</button>
      }
      {
        !showIntro && <div>
          {/* <p>{`Rows: ${csvData && csvData.length}`}</p> */}
        </div>
      }

      {
        !showIntro && <>
          <details>
            <summary>columns</summary>
            <ul className='columns'>
              {csvData && csvData.length > 0 && Object.keys(csvData[0]).map((header) => (
                <li key={header}>
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(header)}
                    onChange={() => {
                      setVisibleColumns(prev =>
                        prev.includes(header)
                          ? prev.filter(col => col !== header)
                          : [...prev, header]
                      );
                    }}
                  />
                  <label>{header}</label>
                </li>
              ))}
            </ul>

          </details>

          <details>
            <summary>Properties</summary>
            <label>Document/Report Title</label>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder='e.g. "2024 Sales Report"'
            />
          </details></>
      }

      <div id="pdf-content">
        <h3 style={{ visibility: docTitle.length > 1 ? 'visible' : 'hidden' }}>{docTitle}</h3>

        <table className='csv-table'>
          <thead>
            <tr>
              {csvData && csvData.length > 0 &&
                Object.keys(csvData[0])
                  .filter(header => visibleColumns.includes(header))
                  .map(header => <th
                    key={header}
                    onClick={() => handleSort(header)}
                    style={{ cursor: 'pointer' }}
                  >
                    {header}
                    {sortConfig.key === header && (
                      sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽'
                    )}
                  </th>)}
            </tr>
          </thead>
          <tbody>
            {csvData && sortedData.map((row, index) => (
              <tr key={index} onClick={() => handleRowClick(row)} style={{ cursor: 'pointer' }}>
                {Object.keys(row)
                  .filter(header => visibleColumns.includes(header))
                  .map(header => (
                    <td key={header}>{row[header]}</td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

          <div className='ad-banner ad-banner-bottom'>
            <AdSlot
              slot={process.env.REACT_APP_ADSENSE_BOTTOM_BANNER_SLOT}
              className='ad-card'
              format='horizontal'
            />
          </div>
        </section>

        <aside className='ad-rail ad-rail-right'>
          <AdSlot slot={process.env.REACT_APP_ADSENSE_RIGHT_RAIL_SLOT} className='ad-card' />
        </aside>
      </main>

      {/* <Footer /> */}

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className='single-record-modal-wrapper'>
          <table id="single-record-pdf-content">
            <tbody>
              {selectedRow && Object.entries(selectedRow).map(([key, value]) => (
                <tr key={key}>
                  <td><strong>{key}</strong></td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={closeModal}>Close</button>
          <button onClick={exportSingleRecordPDF}>Export to PDF</button>
        </div>
      </Modal>

    </>
  );
}

export default App;