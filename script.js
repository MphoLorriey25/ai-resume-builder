const resumeForm = document.getElementById("resumeForm");
const resumeOutput = document.getElementById("resumeOutput");
const downloadBtn = document.getElementById("downloadPDF");

resumeForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const jobTitle = document.getElementById("jobTitle").value.trim();
  const education = document.getElementById("education").value.trim();
  const qualifications = document.getElementById("qualifications").value.trim();
  const experience = document.getElementById("experience").value.trim();

  // Build the resume HTML
  resumeOutput.innerHTML = `
    <h2>${fullName}</h2>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Career Goal:</strong> ${jobTitle}</p>

    <h3>Education</h3>
    <p>${education.replace(/\n/g, "<br>")}</p>

    <h3>Qualifications & Skills</h3>
    <p>${qualifications.replace(/\n/g, "<br>")}</p>

    <h3>Work Experience</h3>
    <p>${experience.replace(/\n/g, "<br>")}</p>
  `;

  downloadBtn.style.display = "inline-block";
});

downloadBtn.addEventListener("click", function () {
  // Clone to avoid any style issues
  const element = resumeOutput.cloneNode(true);
  element.style.display = "block";

  const opt = {
    margin: 0.5,
    filename: "My_Resume.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, logging: false, dpi: 192, letterRendering: true },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  html2pdf().set(opt).from(element).save();
});
