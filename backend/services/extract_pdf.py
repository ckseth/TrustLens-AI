import sys
import os

def extract(pdf_path):
    if not os.path.exists(pdf_path):
        return ""

    # 1. Try PyMuPDF (fitz)
    try:
        import pymupdf as fitz
    except ImportError:
        try:
            import fitz
        except ImportError:
            fitz = None

    if fitz:
        try:
            doc = fitz.open(pdf_path)
            pages = []
            for page in doc:
                t = page.get_text()
                if t:
                    pages.append(t)
            full_text = "\n".join(pages).strip()
            if len(full_text) > 0:
                return full_text
        except Exception:
            pass

    # 2. Try pypdf
    try:
        import pypdf
        reader = pypdf.PdfReader(pdf_path)
        pages = []
        for p in reader.pages:
            t = p.extract_text()
            if t:
                pages.append(t)
        full_text = "\n".join(pages).strip()
        if len(full_text) > 0:
            return full_text
    except Exception:
        pass

    return ""

if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(0)
    pdf_file = sys.argv[1]
    result = extract(pdf_file)
    sys.stdout.buffer.write(result.encode('utf-8', errors='ignore'))

