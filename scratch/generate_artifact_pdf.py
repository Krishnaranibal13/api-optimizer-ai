import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

ARTIFACT_PDF_PATH = r"C:\Users\arrah\.gemini\antigravity-ide\brain\4e96a8e7-bace-4ddf-bb28-0a449dcc4f1b\API_Optimizer_AI_Full_Technical_Report.pdf"


class NumberedCanvas(canvas.Canvas):
    """
    Canvas for drawing running page numbers and headers/footers.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#7c3aed"))
        
        # Header (Pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "API OPTIMIZER AI — COMPREHENSIVE PROJECT TECHNICAL REPORT")
            self.setStrokeColor(colors.HexColor("#e2e8f0"))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)
            
        # Footer
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        self.drawString(54, 36, "CONFIDENTIAL & PROPRIETARY — API OPTIMIZER AI")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 36, page_str)
        self.setStrokeColor(colors.HexColor("#e2e8f0"))
        self.setLineWidth(0.5)
        self.line(54, 48, 558, 48)
        
        self.restoreState()


def build_pdf():
    os.makedirs(os.path.dirname(ARTIFACT_PDF_PATH), exist_ok=True)
    
    doc = SimpleDocTemplate(
        ARTIFACT_PDF_PATH,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Palette
    c_primary = colors.HexColor("#4c1d95")   # Deep Violet
    c_secondary = colors.HexColor("#7c3aed") # Violet
    c_accent = colors.HexColor("#06b6d4")    # Cyan
    c_dark = colors.HexColor("#0f172a")      # Dark Text
    c_muted = colors.HexColor("#475569")     # Muted Text
    
    # Custom Styles
    style_cover_title = ParagraphStyle(
        "CoverTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=26,
        leading=32,
        textColor=c_primary,
        spaceAfter=10
    )
    
    style_cover_subtitle = ParagraphStyle(
        "CoverSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=13,
        leading=18,
        textColor=c_secondary,
        spaceAfter=25
    )
    
    style_h1 = ParagraphStyle(
        "Heading1_Custom",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=15,
        leading=19,
        textColor=c_primary,
        spaceBefore=16,
        spaceAfter=8,
        keepWithNext=True
    )
    
    style_h2 = ParagraphStyle(
        "Heading2_Custom",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=15,
        textColor=c_secondary,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )
    
    style_body = ParagraphStyle(
        "Body_Custom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=14,
        textColor=c_dark,
        spaceAfter=8
    )
    
    style_bullet = ParagraphStyle(
        "Bullet_Custom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=13,
        textColor=c_dark,
        leftIndent=15,
        spaceAfter=4
    )

    style_table_cell = ParagraphStyle(
        "TableCell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11,
        textColor=c_dark
    )

    style_table_header = ParagraphStyle(
        "TableHeader",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    story = []

    # ==========================================================
    # COVER / HEADER BANNER
    # ==========================================================
    story.append(Spacer(1, 10))
    story.append(Paragraph("API OPTIMIZER AI", style_cover_title))
    story.append(Paragraph("Full System Architecture, Technical Implementation & Operations Report", style_cover_subtitle))
    story.append(HRFlowable(width="100%", thickness=2, color=c_secondary, spaceAfter=18))

    # Meta Table
    meta_data = [
        [Paragraph("<b>Platform Version:</b> 2.0.0", style_body), Paragraph("<b>Tech Stack:</b> React 19, FastAPI, MySQL 8.0", style_body)],
        [Paragraph("<b>Infrastructure:</b> Docker & Nginx", style_body), Paragraph("<b>Security:</b> JWT, Rate Limiting, Security Headers", style_body)],
        [Paragraph("<b>Date:</b> July 2026", style_body), Paragraph("<b>Status:</b> Production Ready (100% Sprints Completed)", style_body)],
    ]
    meta_table = Table(meta_data, colWidths=[250, 254])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#e2e8f0")),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 15))

    # ==========================================================
    # SECTION 1: EXECUTIVE OVERVIEW
    # ==========================================================
    story.append(Paragraph("1. Executive Overview", style_h1))
    story.append(Paragraph(
        "<b>API Optimizer AI</b> is an enterprise-grade platform designed to collect, monitor, analyze, forecast, and optimize REST API performance telemetry in real time. Modern distributed applications rely heavily on microservices and third-party APIs; however, identifying latency bottlenecks, predicting server traffic spikes, and maintaining SLA compliance often requires complex manual monitoring. This platform unifies real-time HTTP log stream processing, machine learning predictive analytics, automated SLA executive reporting, and security hardening into a single Cyber Neon Glassmorphic control center.",
        style_body
    ))
    
    story.append(Paragraph("Key System Objectives:", style_h2))
    story.append(Paragraph("• <b>Real-Time HTTP Telemetry Stream:</b> Ingest and process HTTP request metadata (status codes, latency, payload sizes) with sub-second feedback.", style_bullet))
    story.append(Paragraph("• <b>Predictive ML Traffic Forecasting:</b> Utilize time-series models to predict traffic surges 30–60 minutes before peak loads occur.", style_bullet))
    story.append(Paragraph("• <b>Automated Executive Board & Reports:</b> Generate business-friendly SLA summaries, cost optimization drivers, and downloadable PDF reports.", style_bullet))
    story.append(Paragraph("• <b>High-Performance Caching & Security:</b> Enforce rate limiting, HTTP security headers, and in-memory TTL response caching (&lt; 2ms response times).", style_bullet))
    story.append(Spacer(1, 12))

    # ==========================================================
    # SECTION 2: SYSTEM ARCHITECTURE & TECH STACK
    # ==========================================================
    story.append(Paragraph("2. System Architecture & Component Breakdown", style_h1))
    story.append(Paragraph(
        "The application follows a decoupled, multi-container microservice architecture engineered for high availability, zero latency lag, and modular maintenance:",
        style_body
    ))

    arch_data = [
        [Paragraph("Layer", style_table_header), Paragraph("Technology", style_table_header), Paragraph("Core Responsibilities", style_table_header)],
        [Paragraph("Frontend UI", style_table_cell), Paragraph("React 19, Recharts, Vanilla CSS", style_table_cell), Paragraph("Cyber Neon Glassmorphic control center, live charts, search & export toolbar.", style_table_cell)],
        [Paragraph("Reverse Proxy", style_table_cell), Paragraph("Nginx 1.25", style_table_cell), Paragraph("Serves React SPA static build, proxies /api/, /ai/, /reports/ to backend, Gzip compression.", style_table_cell)],
        [Paragraph("Backend Engine", style_table_cell), Paragraph("FastAPI (Python 3.13), Uvicorn", style_table_cell), Paragraph("REST API endpoints, JWT auth, rate limiting, security headers, executive PDF generator.", style_table_cell)],
        [Paragraph("Caching Engine", style_table_cell), Paragraph("In-Memory LRU TTL Cache", style_table_cell), Paragraph("Caches high-frequency dashboard telemetry queries for &lt; 2ms response times.", style_table_cell)],
        [Paragraph("Database", style_table_cell), Paragraph("MySQL 8.0 / SQLAlchemy ORM", style_table_cell), Paragraph("Persistent database with compound indexes on timestamps, endpoints, and statuses.", style_table_cell)],
        [Paragraph("Containerization", style_table_cell), Paragraph("Docker Compose", style_table_cell), Paragraph("One-command multi-stage container build and persistent named volume orchestration.", style_table_cell)],
    ]
    arch_table = Table(arch_data, colWidths=[90, 140, 274])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(arch_table)
    story.append(Spacer(1, 12))

    # ==========================================================
    # SECTION 3: MASTER ROADMAP IMPLEMENTATION (SPRINTS 1-9)
    # ==========================================================
    story.append(Paragraph("3. Master Roadmap Implementation Summary (Sprints 1–9)", style_h1))
    story.append(Paragraph(
        "The project was executed across 9 structured sprints, successfully completing 100% of planned roadmap deliverables:",
        style_body
    ))

    sprint_data = [
        [Paragraph("Sprint", style_table_header), Paragraph("Feature Focus", style_table_header), Paragraph("Key Deliverables & Verification", style_table_header), Paragraph("Status", style_table_header)],
        [Paragraph("Sprint 1", style_table_cell), Paragraph("Foundation & Telemetry", style_table_cell), Paragraph("FastAPI engine, SQLite/MySQL DB setup, basic metrics endpoints.", style_table_cell), Paragraph("Complete", style_table_cell)],
        [Paragraph("Sprint 2", style_table_cell), Paragraph("Real-Time Feed", style_table_cell), Paragraph("Live Request Feed component, auto-refresh 5s loop, status distribution.", style_table_cell), Paragraph("Complete", style_table_cell)],
        [Paragraph("Sprint 3", style_table_cell), Paragraph("Connected API Manager", style_table_cell), Paragraph("Connected API connector, SSL/DNS tester, status toggle, historical metrics.", style_table_cell), Paragraph("Complete", style_table_cell)],
        [Paragraph("Sprint 4", style_table_cell), Paragraph("AI Engine & ML Predictor", style_table_cell), Paragraph("ML time-series traffic predictor, AI Risk Analyzer, recommendation engine.", style_table_cell), Paragraph("Complete", style_table_cell)],
        [Paragraph("Sprint 5", style_table_cell), Paragraph("Executive Board & PDF", style_table_cell), Paragraph("Executive Summary, Industry Benchmark Leaderboard, PDF report generator.", style_table_cell), Paragraph("Complete", style_table_cell)],
        [Paragraph("Sprint 6", style_table_cell), Paragraph("Navigation & Glass UI", style_table_cell), Paragraph("Dedicated React pages, Canva Glassmorphism styling, dark/light theme tokens.", style_table_cell), Paragraph("Complete", style_table_cell)],
        [Paragraph("Sprint 7", style_table_cell), Paragraph("Docker & Cloud Deploy", style_table_cell), Paragraph("Multi-stage Dockerfiles, Nginx reverse proxy, docker-compose.yml, deployment scripts.", style_table_cell), Paragraph("Complete", style_table_cell)],
        [Paragraph("Sprint 8", style_table_cell), Paragraph("Security & Caching", style_table_cell), Paragraph("Sliding-window IP rate limiter, HTTP security headers, in-memory TTL response cache.", style_table_cell), Paragraph("Complete", style_table_cell)],
        [Paragraph("Sprint 9", style_table_cell), Paragraph("Backups & CI/CD", style_table_cell), Paragraph("Automated compressed backup engine (backup_db.py), GitHub Actions workflow.", style_table_cell), Paragraph("Complete", style_table_cell)],
    ]
    sprint_table = Table(sprint_data, colWidths=[55, 110, 274, 65])
    sprint_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_secondary),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(sprint_table)
    story.append(Spacer(1, 12))

    # ==========================================================
    # SECTION 4: SECURITY, CACHING & PERFORMANCE
    # ==========================================================
    story.append(Paragraph("4. Security Hardening & Performance Benchmarks", style_h1))
    story.append(Paragraph("<b>Sliding-Window IP Rate Limiting:</b> Auth endpoints (/auth/login) are strictly rate-limited to 5 requests per minute per IP address to prevent brute-force attacks. Excess calls receive HTTP 429 Too Many Requests with a Retry-After header.", style_body))
    story.append(Paragraph("<b>HTTP Security Headers:</b> Every response injects X-Frame-Options: DENY, X-Content-Type-Options: nosniff, X-XSS-Protection, and Content-Security-Policy.", style_body))
    story.append(Paragraph("<b>In-Memory TTL Caching:</b> Telemetry endpoints (/ai/dashboard, /reports/executive-kpis) use an in-memory LRU cache with TTL auto-invalidation, returning results in &lt; 2ms.", style_body))
    story.append(Paragraph("<b>Automated Database Backups:</b> Backup engine (scripts/backup_db.py) creates compressed .sql.gz archives with 7-day retention rotation.", style_body))
    story.append(Spacer(1, 12))

    # ==========================================================
    # SECTION 5: OPERATIONAL RUNBOOK
    # ==========================================================
    story.append(Paragraph("5. Operational Runbook & One-Command Setup", style_h1))
    story.append(Paragraph("To deploy the entire system using Docker Compose:", style_body))
    story.append(Paragraph("<code>git clone https://github.com/abdulrahmanrifayath/api-optimizer-ai.git</code>", style_bullet))
    story.append(Paragraph("<code>docker compose up --build -d</code>", style_bullet))
    story.append(Paragraph("• <b>Web Control Center:</b> http://localhost", style_bullet))
    story.append(Paragraph("• <b>FastAPI Swagger Docs:</b> http://localhost:8000/docs", style_bullet))
    
    story.append(Spacer(1, 15))
    story.append(HRFlowable(width="100%", thickness=1, color=c_secondary, spaceAfter=12))
    story.append(Paragraph("Report Generated Successfully — API Optimizer AI Engine v2.0.0", ParagraphStyle("FooterText", parent=styles["Normal"], fontName="Helvetica-Oblique", fontSize=9, textColor=c_muted, alignment=1)))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] Downloadable Artifact PDF generated at: {ARTIFACT_PDF_PATH}")


if __name__ == "__main__":
    build_pdf()
