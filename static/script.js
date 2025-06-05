document.getElementById('resume-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const job_title = e.target.job_title.value;
    const experience = e.target.experience.value;
    const skills = e.target.skills.value;

    try {
        const response = await fetch("/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ job_title, experience, skills })
        });

        const data = await response.json();
        if (data.resume) {
            document.getElementById("output").innerHTML = `<pre>${data.resume}</pre>`;
        } else {
            document.getElementById("output").textContent = "Failed to generate resume.";
        }
    } catch (error) {
        console.error(error);
        document.getElementById("output").textContent = "An error occurred.";
    }
});
