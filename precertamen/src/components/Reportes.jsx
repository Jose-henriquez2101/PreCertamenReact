import React, { useEffect, useState, Fragment } from "react";
import { db } from "../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function Reportes() {
  const [regalos, setRegalos] = useState([]);
  const [comida, setComida] = useState([]);
  const [adornos, setAdornos] = useState([]);

  // -----------------------------------------------------------
  // Cargar datos desde Firebase
  // -----------------------------------------------------------
  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "regalos"), (snap) =>
      setRegalos(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => a.prioridad - b.prioridad)
      )
    );

    const unsub2 = onSnapshot(collection(db, "comida"), (snap) =>
      setComida(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.congelado === true) - (a.congelado === true))
      )
    );

    const unsub3 = onSnapshot(collection(db, "adornos"), (snap) =>
      setAdornos(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => a.cantidad - b.cantidad)
      )
    );

    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  }, []);

  // -----------------------------------------------------------
  // Funciones de EXPORTACIÓN
  // -----------------------------------------------------------

  const exportToExcel = (jsonArray, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(jsonArray);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
    XLSX.writeFile(workbook, fileName + ".xlsx");
  };

  const exportToPDF = async (id, nombre) => {
    const input = document.getElementById(id);

    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 5, 5, 200, 0);
    pdf.save(`${nombre}.pdf`);
  };

  const exportToPNG = async (id, nombre) => {
    const element = document.getElementById(id);
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.download = nombre + ".png";
    link.href = imgData;
    link.click();
  };

  // -----------------------------------------------------------
  // Animaciones
  // -----------------------------------------------------------
  const tableMotion = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  const rowMotion = {
    hidden: { opacity: 0, x: -25 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 25 },
  };

  const hoverEffect = {
    scale: 1.02,
    transition: { duration: 0.2 },
  };

  // -----------------------------------------------------------

  return (
    <Fragment>
      <div className="container mt-4 mb-5">

        <h1 className="text-center mb-5 fw-bold">
          🎄 Reportes Navideños con Exportación
        </h1>

        {/* ============================================
          REGALOS
        ============================================ */}
        <motion.div
          className="card shadow-lg mb-5"
          initial="hidden"
          animate="visible"
          variants={tableMotion}
          transition={{ duration: 0.6 }}
        >
          <div className="card-header bg-primary text-white text-center">
            <h3>🎁 Regalos</h3>
          </div>

          {/* BOTONES */}
          <div className="p-3 text-center">
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => exportToExcel(regalos, "regalos")}
            >
              Exportar Excel
            </button>

            <button
              className="btn btn-outline-danger me-2"
              onClick={() => exportToPDF("tablaRegalos", "regalos")}
            >
              Exportar PDF
            </button>

            <button
              className="btn btn-outline-dark"
              onClick={() => exportToPNG("tablaRegalos", "regalos")}
            >
              Exportar PNG
            </button>
          </div>

          {/* TABLA */}
          <div id="tablaRegalos" className="card-body p-0">
            <table className="table table-striped table-hover m-0">
              <thead className="table-primary">
                <tr>
                  <th>Regalo</th>
                  <th>Familiar</th>
                  <th>Prioridad</th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence>
                  {regalos.map((r) => (
                    <motion.tr
                      key={r.id}
                      variants={rowMotion}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      whileHover={hoverEffect}
                    >
                      <td>{r.nombre}</td>
                      <td>{r.familiar}</td>
                      <td className="fw-bold">{r.prioridad}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ============================================
          COMIDA
        ============================================ */}
        <motion.div
          className="card shadow-lg mb-5"
          initial="hidden"
          animate="visible"
          variants={tableMotion}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="card-header bg-success text-white text-center">
            <h3>🍗 Comida</h3>
          </div>

          {/* BOTONES */}
          <div className="p-3 text-center">
            <button
              className="btn btn-outline-success me-2"
              onClick={() => exportToExcel(comida, "comida")}
            >
              Exportar Excel
            </button>

            <button
              className="btn btn-outline-danger me-2"
              onClick={() => exportToPDF("tablaComida", "comida")}
            >
              Exportar PDF
            </button>

            <button
              className="btn btn-outline-dark"
              onClick={() => exportToPNG("tablaComida", "comida")}
            >
              Exportar PNG
            </button>
          </div>

          {/* TABLA */}
          <div id="tablaComida" className="card-body p-0">
            <table className="table table-striped table-hover m-0">
              <thead className="table-success">
                <tr>
                  <th>Alimento</th>
                  <th>Congelado</th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence>
                  {comida.map((c) => (
                    <motion.tr
                      key={c.id}
                      variants={rowMotion}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      whileHover={hoverEffect}
                    >
                      <td>{c.nombre}</td>
                      <td>{c.congelado ? "Sí ❄️" : "No 🔥"}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ============================================
          ADORNOS
        ============================================ */}
        <motion.div
          className="card shadow-lg"
          initial="hidden"
          animate="visible"
          variants={tableMotion}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="card-header bg-danger text-white text-center">
            <h3>🎄 Adornos</h3>
          </div>

          {/* BOTONES */}
          <div className="p-3 text-center">
            <button
              className="btn btn-outline-danger me-2"
              onClick={() => exportToExcel(adornos, "adornos")}
            >
              Exportar Excel
            </button>

            <button
              className="btn btn-outline-danger me-2"
              onClick={() => exportToPDF("tablaAdornos", "adornos")}
            >
              Exportar PDF
            </button>

            <button
              className="btn btn-outline-dark"
              onClick={() => exportToPNG("tablaAdornos", "adornos")}
            >
              Exportar PNG
            </button>
          </div>

          {/* TABLA */}
          <div id="tablaAdornos" className="card-body p-0">
            <table className="table table-striped table-hover m-0">
              <thead className="table-danger">
                <tr>
                  <th>Adorno</th>
                  <th>Cantidad</th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence>
                  {adornos.map((a) => (
                    <motion.tr
                      key={a.id}
                      variants={rowMotion}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      whileHover={hoverEffect}
                    >
                      <td>{a.nombre}</td>
                      <td className="fw-bold">{a.cantidad}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </Fragment>
  );
}
