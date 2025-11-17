import React, { useEffect, useState, Fragment } from "react";
import { db } from "../firebaseConfig.js";
import { collection, onSnapshot } from "firebase/firestore";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function Reportes() {
  const [regalos, setRegalos] = useState([]);
  const [comida, setComida] = useState([]);
  const [adornos, setAdornos] = useState([]);

  // -----------------------
  // Cargar colecciones
  // -----------------------
  useEffect(() => {
    onSnapshot(collection(db, "regalos"), (snap) =>
      setRegalos(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => a.prioridad - b.prioridad)
      )
    );

    onSnapshot(collection(db, "comida"), (snap) =>
      setComida(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.congelado === true) - (a.congelado === true))
      )
    );

    onSnapshot(collection(db, "adornos"), (snap) =>
      setAdornos(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => a.cantidad - b.cantidad)
      )
    );
  }, []);

  // --------------------------------------------------
  // EXPORTAR PDF / EXCEL / PNG
  // --------------------------------------------------

  const exportPDF = async (id) => {
    const element = document.getElementById(id);
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save(`${id}.pdf`);
  };

  const exportExcel = (data, name) => {
    const sheet = XLSX.utils.json_to_sheet(data);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Datos");
    XLSX.writeFile(book, `${name}.xlsx`);
  };

  const exportPNG = async (id) => {
    const element = document.getElementById(id);
    const canvas = await html2canvas(element);
    canvas.toBlob((blob) => saveAs(blob, `${id}.png`));
  };

  return (
    <Fragment>
      <div className="container mt-4">
        <h1 className="text-center mb-4">Reportes Firebase</h1>

        {/* -------------------- TABLA REGALOS --------------------- */}
        <h3>🎁 Regalos</h3>
        <div className="mb-2">
          <button onClick={() => exportPDF("tablaRegalos")} className="btn btn-danger me-2">PDF</button>
          <button onClick={() => exportExcel(regalos, "Regalos")} className="btn btn-success me-2">Excel</button>
          <button onClick={() => exportPNG("tablaRegalos")} className="btn btn-primary">PNG</button>
        </div>

        <table id="tablaRegalos" className="table table-bordered">
          <thead>
            <tr>
              <th>Regalo</th>
              <th>Familiar</th>
              <th>Prioridad</th>
            </tr>
          </thead>
          <tbody>
            {regalos.map((r) => (
              <tr key={r.id}>
                <td>{r.nombre}</td>
                <td>{r.familiar}</td>
                <td>{r.prioridad}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr />

        {/* -------------------- TABLA COMIDA --------------------- */}
        <h3>🍗 Comida</h3>
        <div className="mb-2">
          <button onClick={() => exportPDF("tablaComida")} className="btn btn-danger me-2">PDF</button>
          <button onClick={() => exportExcel(comida, "Comida")} className="btn btn-success me-2">Excel</button>
          <button onClick={() => exportPNG("tablaComida")} className="btn btn-primary">PNG</button>
        </div>

        <table id="tablaComida" className="table table-bordered">
          <thead>
            <tr>
              <th>Alimento</th>
              <th>Congelado</th>
            </tr>
          </thead>
          <tbody>
            {comida.map((c) => (
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td>{c.congelado ? "Sí" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr />

        {/* -------------------- TABLA ADORNOS --------------------- */}
        <h3>🎄 Adornos</h3>
        <div className="mb-2">
          <button onClick={() => exportPDF("tablaAdornos")} className="btn btn-danger me-2">PDF</button>
          <button onClick={() => exportExcel(adornos, "Adornos")} className="btn btn-success me-2">Excel</button>
          <button onClick={() => exportPNG("tablaAdornos")} className="btn btn-primary">PNG</button>
        </div>

        <table id="tablaAdornos" className="table table-bordered">
          <thead>
            <tr>
              <th>Adorno</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {adornos.map((a) => (
              <tr key={a.id}>
                <td>{a.nombre}</td>
                <td>{a.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </Fragment>
  );
}
