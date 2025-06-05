from flask import Flask, render_template, request, jsonify, make_response
import requests
from docx import Document
from fpdf import FPDF

app = Flask(__name__)

# Replace with your actual OpenRouter API key
OPENROUTER_API_KEY = "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"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate_resume():
    data = request.json

    prompt = f"""
    Create a professional resume for this person:
    Name: {data['name']}
    Personal Summary: {data['summary']}
    Address: {data['address']}
    Phone: {data['phone']}
    Email: {data['email']}
    Education: {data['education']}
    Work Experience: {data['experience']}
    Skills: {data['skills']}
    References: {data['references']}
    """

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "openai/gpt-3.5-turbo",
            "messages": [{"role": "user", "content": prompt}]
        }
    )

    result = response.json()["choices"][0]["message"]["content"]
    return jsonify({"output": result})

# ✅ Route to download resume as PDF
@app.route('/download-pdf', methods=['POST'])
def download_pdf():
    data = request.json
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    pdf.cell(200, 10, txt="Resume", ln=True, align='C')
    pdf.ln(10)

    for key, value in data.items():
        pdf.multi_cell(0, 10, f"{key.capitalize()}: {value}")
        pdf.ln(1)

    response = make_response(pdf.output(dest='S').encode('latin1'))
    response.headers.set('Content-Disposition', 'attachment', filename='resume.pdf')
    response.headers.set('Content-Type', 'application/pdf')
    return response

# ✅ Route to download resume as Word (DOCX)
@app.route('/download-docx', methods=['POST'])
def download_docx():
    data = request.json
    doc = Document()
    doc.add_heading('Resume', 0)

    for key, value in data.items():
        doc.add_heading(key.capitalize(), level=1)
        doc.add_paragraph(value)

    doc.save("resume.docx")
    with open("resume.docx", "rb") as f:
        docx_content = f.read()

    response = make_response(docx_content)
    response.headers.set('Content-Disposition', 'attachment', filename='resume.docx')
    response.headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    return response

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=81)
