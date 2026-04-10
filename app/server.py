from __future__ import annotations

import json
import random
from dataclasses import dataclass, asdict
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

ROOT = Path(__file__).resolve().parent.parent
WEB_DIR = ROOT / "web"


@dataclass
class Project:
    key: str
    name: str
    language: str
    coverage: float
    bugs: int
    vulnerabilities: int
    code_smells: int


STATE = {
    "projects": [
        Project("api-core", "API Core", "python", 78.4, 12, 3, 56),
        Project("frontend-ui", "Frontend UI", "typescript", 82.1, 7, 2, 44),
        Project("worker-jobs", "Worker Jobs", "python", 75.0, 10, 1, 38),
    ],
    "issues": [
        {
            "id": "ISSUE-101",
            "project": "api-core",
            "type": "Bug",
            "severity": "HIGH",
            "status": "OPEN",
            "message": "Possible None dereference in authentication flow",
        },
        {
            "id": "ISSUE-205",
            "project": "frontend-ui",
            "type": "Code Smell",
            "severity": "MEDIUM",
            "status": "OPEN",
            "message": "Component complexity exceeds threshold",
        },
        {
            "id": "ISSUE-309",
            "project": "worker-jobs",
            "type": "Vulnerability",
            "severity": "CRITICAL",
            "status": "CONFIRMED",
            "message": "Unvalidated external input reaches shell command",
        },
    ],
    "gate": [
        {"rule": "Coverage >= 80%", "status": "WARN"},
        {"rule": "New Bugs = 0", "status": "FAIL"},
        {"rule": "New Vulnerabilities = 0", "status": "FAIL"},
        {"rule": "Duplications <= 3%", "status": "PASS"},
    ],
}


class AppHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WEB_DIR), **kwargs)

    def _send_json(self, payload: dict | list, status: HTTPStatus = HTTPStatus.OK) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        if parsed.path == "/api/projects":
            self._send_json([asdict(project) for project in STATE["projects"]])
            return

        if parsed.path == "/api/issues":
            query = parse_qs(parsed.query)
            project = query.get("project", [""])[0]
            severity = query.get("severity", [""])[0]

            issues = STATE["issues"]
            if project:
                issues = [issue for issue in issues if issue["project"] == project]
            if severity:
                issues = [issue for issue in issues if issue["severity"] == severity]

            self._send_json(issues)
            return

        if parsed.path == "/api/quality-gate":
            self._send_json(STATE["gate"])
            return

        return super().do_GET()

    def do_POST(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        if parsed.path != "/api/analyze":
            self._send_json({"error": "Not found"}, HTTPStatus.NOT_FOUND)
            return

        for index, project in enumerate(STATE["projects"]):
            delta = random.choice([-2, -1, 0, 1])
            updated = Project(
                key=project.key,
                name=project.name,
                language=project.language,
                coverage=max(0.0, min(100.0, round(project.coverage + random.uniform(-1.1, 1.4), 1))),
                bugs=max(0, project.bugs + delta),
                vulnerabilities=max(0, project.vulnerabilities + random.choice([-1, 0, 1])),
                code_smells=max(0, project.code_smells + random.choice([-4, -2, 0, 2])),
            )
            STATE["projects"][index] = updated

        if all(project.vulnerabilities == 0 for project in STATE["projects"]):
            STATE["gate"][2]["status"] = "PASS"
        else:
            STATE["gate"][2]["status"] = "FAIL"

        avg_coverage = sum(project.coverage for project in STATE["projects"]) / len(STATE["projects"])
        STATE["gate"][0]["status"] = "PASS" if avg_coverage >= 80 else "WARN"

        self._send_json({"message": "Analysis executed", "avgCoverage": round(avg_coverage, 1)})


def run() -> None:
    server = ThreadingHTTPServer(("0.0.0.0", 3000), AppHandler)
    print("SonaReplica running on http://localhost:3000")
    server.serve_forever()


if __name__ == "__main__":
    run()
