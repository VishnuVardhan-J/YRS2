/**
 * Yuvaneshwaran Roofing Solutions - Industrial Estimator Tool
 * Instant client-side estimates based on real operational throughput
 */

document.addEventListener('DOMContentLoaded', () => {
  initEstimator();
});

function initEstimator() {
  const serviceSelect = document.getElementById('estService');
  const sizeInput = document.getElementById('estSize');
  const unitSelect = document.getElementById('estUnit');
  const insulationSelect = document.getElementById('estInsulation');
  const cityInput = document.getElementById('estCity');
  
  const outTimeframe = document.getElementById('estOutTimeframe');
  const outEquipment = document.getElementById('estOutEquipment');
  const outManpower = document.getElementById('estOutManpower');
  const outClips = document.getElementById('estOutClips');
  const waBtn = document.getElementById('estWaBtn');

  if (!serviceSelect || !sizeInput || !waBtn) return;

  function calculate() {
    const service = serviceSelect.value;
    const size = parseFloat(sizeInput.value) || 0;
    const unit = unitSelect ? unitSelect.value : 'sqm';
    const insulation = insulationSelect ? insulationSelect.value : 'none';
    const city = cityInput ? cityInput.value.trim() : '';

    let areaSqm = unit === 'sqft' ? (size * 0.0929) : size;
    if (unit === 'mt') {
      areaSqm = size * 30;
    }

    let days = 0;
    let equipmentRecommendation = '';
    let manpowerRecommendation = '';
    let clipsCount = 0;

    if (service === 'ssr') {
      const dailyFixingRate = 1200; 
      days = Math.max(5, Math.ceil(areaSqm / dailyFixingRate));
      equipmentRecommendation = areaSqm > 10000 
        ? '2 Roll-Forming Machines + 27m / 8-ton Crawler Lifter' 
        : '1 Standard Seam Roll Former + 19m Lifter';
      manpowerRecommendation = '1 Engineer, 1 Safety Officer, 2 Supervisors, 25-30 Riggers & Helpers';
      clipsCount = Math.round(areaSqm * 2.8);
    } else if (service === 'peb') {
      const dailyTonnage = 30;
      const metricTons = unit === 'mt' ? size : Math.max(15, Math.round(areaSqm / 30));
      days = Math.max(7, Math.ceil(metricTons / dailyTonnage) + 6);
      equipmentRecommendation = '27m Crawler Lifter + Mobile Telescopic Crane + Torque Tools';
      manpowerRecommendation = '2 Engineers, 1 Safety Officer, 2 Supervisors, 40 Erection Crew';
      clipsCount = 0;
    } else if (service === 'cladding') {
      days = Math.max(4, Math.ceil(areaSqm / 600));
      equipmentRecommendation = '19m Hydraulic Lifter + Scaffolding / Cradle Platform';
      manpowerRecommendation = '1 Supervisor, 1 Safety Officer, 15 Cladding Fitters';
      clipsCount = 0;
    } else {
      days = Math.max(3, Math.ceil(areaSqm / 800));
      equipmentRecommendation = 'In-House CNC Press Brake & Shearing Machines for Custom Flashings';
      manpowerRecommendation = '1 Supervisor, 10 Dedicated Sheeting Crew';
      clipsCount = 0;
    }

    if (outTimeframe) outTimeframe.textContent = 'Approx. ' + days + ' Working Days';
    if (outEquipment) outEquipment.textContent = equipmentRecommendation;
    if (outManpower) outManpower.textContent = manpowerRecommendation;
    if (outClips) {
      outClips.textContent = clipsCount > 0 
        ? clipsCount.toLocaleString('en-IN') + ' Units (In-House Chennai Supply)' 
        : 'Custom Fasteners / Cladding Screws';
    }

    const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;
    const insulName = insulationSelect ? insulationSelect.options[insulationSelect.selectedIndex].text : 'None';
    
    let textMsg = 'Hello Hariprabu M (Yuvaneshwaran Roofing Solutions),%0A%0A*Requirement:* ' + encodeURIComponent(serviceName) + '%0A*Project Size:* ' + size + ' ' + unit.toUpperCase() + '%0A*Insulation:* ' + encodeURIComponent(insulName);
    if (city) textMsg += '%0A*Site Location:* ' + encodeURIComponent(city);
    textMsg += '%0A*Estimated Timeline:* ' + days + ' Working Days%0A%0APlease provide a formal commercial proposal.';

    waBtn.href = 'https://wa.me/918754446172?text=' + textMsg;
  }

  [serviceSelect, sizeInput, unitSelect, insulationSelect, cityInput].forEach(el => {
    if (el) {
      el.addEventListener('input', calculate);
      el.addEventListener('change', calculate);
    }
  });

  calculate();
}

// Modal CSS helper
const modalStyle = document.createElement('style');
modalStyle.textContent = `
.project-modal {
  position: fixed;
  inset: 0;
  background: rgba(3, 11, 23, 0.85);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}
.project-modal.open {
  opacity: 1;
  pointer-events: auto;
}
.modal-container {
  background: #FFFFFF;
  border-radius: 16px;
  max-width: 640px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 2.25rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  transform: scale(0.95);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.project-modal.open .modal-container {
  transform: scale(1);
}
.modal-close-btn {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: #F1F5F9;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.25rem;
  color: #334155;
  transition: background 0.2s, color 0.2s;
}
.modal-close-btn:hover {
  background: #E2E8F0;
  color: #0A1F3D;
}
`;
document.head.appendChild(modalStyle);