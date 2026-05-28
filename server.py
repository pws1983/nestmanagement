from http.server import HTTPServer, SimpleHTTPRequestHandler
import json, os
from pathlib import Path

DATA_FILE = Path('app_data.json')

class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/sync':
            data = json.loads(DATA_FILE.read_text('utf-8')) if DATA_FILE.exists() else {}
            body = json.dumps(data).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', len(body))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(body)
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == '/api/sync':
            length = int(self.headers.get('Content-Length', 0))
            raw = self.rfile.read(length)
            data = json.loads(raw.decode('utf-8'))
            DATA_FILE.write_text(
                json.dumps(data, ensure_ascii=False, indent=2),
                encoding='utf-8'
            )
            resp = b'{"ok":true}'
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', len(resp))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(resp)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, format, *args):
        pass  # 로그 억제

if __name__ == '__main__':
    os.chdir(Path(__file__).parent)
    port = 8000
    server = HTTPServer(('0.0.0.0', port), Handler)
    print(f'✅ 서버 실행 중: http://localhost:{port}')
    print('종료: Ctrl+C')
    server.serve_forever()
