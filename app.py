```python
from flask import Flask, request, render_template, jsonify, send_file
from docx import Document
from fpdf import FPDF
import os
from io import BytesIO

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()

    name = data.get("name")
    summary = data.get("summary")
    address = data.get("address")
    phone = data.get("phone")
    email = data.get("email")
    education = data.get("education")
    experience = data.get("experience")
    skills = data.get("skills")
    references = data.get("references")
    template = data.get("template", "1")

    content = f"""
{name}
{summary}

Contact: {email} | {phone} | {address}

Education:
{education}

Experience:
{experience}

Skills:
{skills}

References:
{references}
"""

    return jsonify({"output": content})

@app.route("/download", methods=["POST"])
def download():
    data = request.get_json()
    content = data.get("content")
    file_type = data.get("fileType")

    if file_type == "pdf":
        pdf = FPDF()
        pdf.add_page()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.set_font("Arial", size=12)
        for line in content.splitlines():
            pdf.multi_cell(0, 10, line)
        buffer = BytesIO()
        pdf.output(buffer)
        buffer.seek(0)
        return send_file(buffer, download_name="resume.pdf", as_attachment=True)

    elif file_type == "word":
        doc = Document()
        for line in content.splitlines():
            doc.add_paragraph(line)
        buffer = BytesIO()
        doc.save(buffer)
        buffer.seek(0)
        return send_file(buffer, download_name="resume.docx", as_attachment=True)

    return jsonify({"error": "Invalid file type"}), 400

if __name__ == "__main__":
    app.run(debug=True)
```

---
