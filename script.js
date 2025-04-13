function parseCSV(text) {
    const lines = text.trim().split("\n");
    const rows = lines.map(line => line.split(","));
    return rows;
  }
  
  function toCSV(rows) {
    return rows.map(row => row.join(",")).join("\n");
  }
  
  function downloadCSV(data, filename = "concatenated.csv") {
    const blob = new Blob([data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
  async function readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = e => reject(e);
      reader.readAsText(file);
    });
  }
  
  async function concatenateFiles() {
    const file1 = document.getElementById("file1").files[0];
    const file2 = document.getElementById("file2").files[0];
    if (!file1 || !file2) {
      alert("Please upload both CSV files.");
      return;
    }
  
    const text1 = await readFile(file1);
    const text2 = await readFile(file2);
  
    const rows1 = parseCSV(text1);
    const rows2 = parseCSV(text2);
  
    const [header1, ...data1] = rows1;
    const [header2, ...data2] = rows2;
  
    if (header1.join() !== header2.join()) {
      alert("The headers do not match!");
      return;
    }
  
    const bigData = data1.length >= data2.length ? data1 : data2;
    const smallData = data1.length < data2.length ? data1 : data2;
  
    const finalData = [header1, ...bigData, ...smallData];
    const csv = toCSV(finalData);
    downloadCSV(csv);
  }
  