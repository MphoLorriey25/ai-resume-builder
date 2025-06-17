const resumeForm = document.getElementById("resumeForm");
const resumePreview = document.getElementById("resumePreview");
const downloadBtn = document.getElementById("downloadBtn");

resumeForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form data
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const jobTitle = document.getElementById("jobTitle").value.trim();
  const education = document.getElementById("education").value.trim();
  const qualifications = document.getElementById("qualifications").value.trim();
  const experience = document.getElementById("experience").value.trim();

  // Generate resume HTML
  const resumeHTML = `
    <h1 style="color:#0077b6; margin-bottom:0;">${fullName}</h1>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <h2 style="color:#023e8a; margin-top:30px;">${jobTitle}</h2>

    <h3 style="color:#0077b6; margin-top:30px;">Education</h3>
    <p>${education.replace(/\n/g, "<br>")}</p>

    <h3 style="color:#0077b6; margin-top:30px;">Qualifications & Skills</h3>
    <p>${qualifications.replace(/\n/g, "<br>")}</p>

    <h3 style="color:#0077b6; margin-top:30px;">Work Experience</h3>
    <p>${experience.replace(/\n/g, "<br>")}</p>
  `;

  // Show in preview container
  resumePreview.innerHTML = resumeHTML;

  // Show download button
  downloadBtn.style.display = "block";
});

// Download PDF button handler
downloadBtn.addEventListener("click", () => {
  const opt = {
    margin:       0.4,
    filename:     'Resume.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, scrollY: 0 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(resumePreview).save();
});
