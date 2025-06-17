// Get form and output elements
const resumeForm = document.getElementById("resumeForm");
const resumeOutput = document.getElementById("resumeOutput");
const downloadBtn = document.getElementById("downloadPDF");
const previewImage = document.getElementById("previewImage");

// Update preview image when template changes
document.getElementById("template").addEventListener("change", function () {
  const selected = this.value;
  previewImage.src = `templates/${selected}.png`;
});

// Load saved resumes on page load
loadSavedResumes();

resumeForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Gather form data
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const jobTitle = document.getElementById("jobTitle").value.trim();
  const education = document.getElementById("education").value.trim();
  const qualifications = document.getElementById("qualifications").value.trim();
  const experience = document.getElementById("experience").value.trim();
  const template = document.getElementById("template").value;

  // Show loading message
  resumeOutput.innerHTML = "<p>Generating your resume, please wait...</p>";
  downloadBtn.style.display = "none";

  // Prepare prompt for AI generation
  const prompt = `
    Create a professional resume for the following details:
    Name: ${fullName}
    Email: ${email}
    Phone: ${phone}
    Job Title: ${jobTitle}
    Education: ${education}
    Qualifications & Skills: ${qualifications}
    Work Experience: ${experience}

    Format the resume in a clean, readable way suitable for an ATS system.
  `;

  try {
    // Call AI API via config.js function
    const aiResume = await generateResumeFromAPI(prompt);

    // Show resume content with selected template class
    resumeOutput.className = `template-${template}`;
    resumeOutput.innerHTML = `
      <h2>${fullName}</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Career Goal:</strong> ${jobTitle}</p>
      <h3>Education</h3><p>${education.replace(/\n/g, "<br>")}</p>
      <h3>Qualifications & Skills</h3><p>${qualifications.replace(/\n/g, "<br>")}</p>
      <h3>Work Experience</h3><p>${experience.replace(/\n/g, "<br>")}</p>
      <hr>
      <pre>${aiResume}</pre>
    `;

    downloadBtn.style.display = "inline-block";

    // Save resume to localStorage
    saveResume({
      name: fullName,
      email: email,
      content: aiResume,
      date: new Date().toLocaleString()
    });

  } catch (error) {
    resumeOutput.innerHTML = "<p style='color:red;'>Error generating resume. Check your API key or internet connection.</p>";
    downloadBtn.style.display = "none";
  }
});

// Download PDF using html2pdf
downloadBtn.addEventListener("click", function () {
  const opt = {
    margin: 0.5,
    filename: 'My_Resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(resumeOutput).save();
});

// Save resume to localStorage
function saveResume(resume) {
  let saved = JSON.parse(localStorage.getItem("savedResumes") || "[]");
  saved.push(resume);
  localStorage.setItem("savedResumes", JSON.stringify(saved));
  loadSavedResumes();
}

// Load saved resumes to display
function loadSavedResumes() {
  const saved = JSON.parse(localStorage.getItem("savedResumes") || "[]");
  const list = document.getElementById("savedResumesList");
  list.innerHTML = "";

  saved.forEach((resume, index) => {
    const item = document.createElement("div");
    item.innerHTML = `
      <strong>${resume.name}</strong> (${resume.date})<br>
      <em>${resume.email}</em><br>
      <button onclick="viewResume(${index})">View</button>
      <button onclick="deleteResume(${index})" style="color:red;">Delete</button>
      <hr>
    `;
    list.appendChild(item);
  });
}

// View saved resume
function viewResume(index) {
  const saved = JSON.parse(localStorage.getItem("savedResumes") || "[]");
  const resume = saved[index];
  if (!resume) return;

  resumeOutput.className = "template-classic";
  resumeOutput.innerHTML = `
    <h2>${resume.name}</h2>
    <p><strong>Email:</strong> ${resume.email}</p>
    <pre>${resume.content.replace(/\n/g, "<br>")}</pre>
  `;
  downloadBtn.style.display = "inline-block";
}

// Delete saved resume
function deleteResume(index) {
  let saved = JSON.parse(localStorage.getItem("savedResumes") || "[]");
  saved.splice(index, 1);
  localStorage.setItem("savedResumes", JSON.stringify(saved));
  loadSavedResumes();
}

// Dummy API call - replace this with real OpenRouter/ChatGPT call
async function generateResumeFromAPI(prompt) {
  // Replace with real fetch call if needed
  return `AI-generated resume content based on:\n${prompt}`;
}

