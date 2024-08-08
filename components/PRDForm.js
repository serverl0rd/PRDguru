import { useState } from "react";
import jsPDF from "jspdf";

export default function PRDForm() {
  const [prd, setPrd] = useState({
    id: '',
    title: '',
    objective: '',
    description: '',
    functionalRequirements: '',
    nonFunctionalRequirements: '',
    dependencies: '',
    acceptanceCriteria: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrd((prev) => ({ ...prev, [name]: value }));
  };

  const savePRD = async () => {
    const response = await fetch('/api/savePrd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prd),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('PRD saved with ID:', data.id);
    } else {
      console.error('Error saving PRD');
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`PRD ID: ${prd.id}`, 10, 10);
    doc.text(`Title: ${prd.title}`, 10, 20);
    doc.text(`Objective: ${prd.objective}`, 10, 30);
    doc.text(`Description: ${prd.description}`, 10, 40);
    doc.text(`Functional Requirements: ${prd.functionalRequirements}`, 10, 50);
    doc.text(`Non-Functional Requirements: ${prd.nonFunctionalRequirements}`, 10, 60);
    doc.text(`Dependencies: ${prd.dependencies}`, 10, 70);
    doc.text(`Acceptance Criteria: ${prd.acceptanceCriteria}`, 10, 80);
    doc.save("prd.pdf");
  };

  return (
    <form>
      <input name="id" value={prd.id} onChange={handleChange} placeholder="PRD ID" />
      <input name="title" value={prd.title} onChange={handleChange} placeholder="PRD Title" />
      <textarea name="objective" value={prd.objective} onChange={handleChange} placeholder="Objective" />
      <textarea name="description" value={prd.description} onChange={handleChange} placeholder="Description" />
      <textarea name="functionalRequirements" value={prd.functionalRequirements} onChange={handleChange} placeholder="Functional Requirements" />
      <textarea name="nonFunctionalRequirements" value={prd.nonFunctionalRequirements} onChange={handleChange} placeholder="Non-Functional Requirements" />
      <textarea name="dependencies" value={prd.dependencies} onChange={handleChange} placeholder="Dependencies" />
      <textarea name="acceptanceCriteria" value={prd.acceptanceCriteria} onChange={handleChange} placeholder="Acceptance Criteria" />
      <button type="button" onClick={savePRD}>Save</button>
      <button type="button" onClick={exportPDF}>Export as PDF</button>
    </form>
  );
}