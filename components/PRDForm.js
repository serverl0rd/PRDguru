import { useState } from 'react';
import jsPDF from 'jspdf';

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
    try {
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
        // Optionally change input fields to text after saving
      } else {
        console.error('Error saving PRD:', await response.text());
      }
    } catch (error) {
      console.error('Error in savePRD:', error);
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
    <form className="space-y-4">
      <input name="id" value={prd.id} onChange={handleChange} placeholder="PRD ID" className="input" />
      <input name="title" value={prd.title} onChange={handleChange} placeholder="PRD Title" className="input" />
      <textarea name="objective" value={prd.objective} onChange={handleChange} placeholder="Objective" className="textarea" />
      <textarea name="description" value={prd.description} onChange={handleChange} placeholder="Description" className="textarea" />
      <textarea name="functionalRequirements" value={prd.functionalRequirements} onChange={handleChange} placeholder="Functional Requirements" className="textarea" />
      <textarea name="nonFunctionalRequirements" value={prd.nonFunctionalRequirements} onChange={handleChange} placeholder="Non-Functional Requirements" className="textarea" />
      <textarea name="dependencies" value={prd.dependencies} onChange={handleChange} placeholder="Dependencies" className="textarea" />
      <textarea name="acceptanceCriteria" value={prd.acceptanceCriteria} onChange={handleChange} placeholder="Acceptance Criteria" className="textarea" />
      <button type="button" onClick={savePRD} className="btn btn-primary w-full">Save</button>
      <button type="button" onClick={exportPDF} className="btn btn-secondary w-full">Export as PDF</button>
    </form>
  );
}