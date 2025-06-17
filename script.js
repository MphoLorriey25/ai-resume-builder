const resumeForm = document.getElementById("resumeForm");
const resumePreview = document.getElementById("resumePreview");
const downloadBtn = document.getElementById("downloadBtn");

resumeForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const jobTitle = document.getElementById("jobTitle").value.trim();
  const education = document.getElementById("education").value.trim();
  const qualifications = document.getElementById("qualifications").value.trim();
  const experience = document.getElementById("experience").value.trim();
  const template = document.getElementById("template").value;

  resumePreview.innerHTML = "<p><em>Generating your resume with AI...</em></p>";
  downloadBtn.style.display = "none";

  const prompt = `
Create a professional resume:
Name: ${fullName}
Email: ${email}
Phone: ${phone}
Job Title: ${jobTitle}
Education: ${education}
Qualifications: ${qualifications}
Work Experience: ${experience}
  `;

  try {
    const aiText = await generateResumeFromAPI(prompt);

    resumePreview.className = `preview template-${template}`;
    resumePreview.innerHTML = `
      <h1>${fullName}</h1>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <h2>${jobTitle}</h2>
      <hr>
      <div>${aiText.replace(/\n/g, "<br>")}</div>
    `;

    downloadBtn.style.display = "block";
  } catch (err) {
    resumePreview.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  }
});

downloadBtn.addEventListener("click", () => {
  html2pdf().from(resumePreview).save("Resume.pdf");
});
