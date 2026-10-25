"""Bounded, checksummed CI evidence transport. Public build files and synthetic QA only."""
import argparse
import base64
import hashlib
import io
import json
import pathlib
import re
import subprocess
import zipfile

PREFIX = "PMERSION_EVIDENCE_V1_"
MAX_BYTES = 8 * 1024 * 1024
VIEWS = {
    "next-portail-viewport.png", "next-learn-viewport.png",
    "next-simulate-viewport.png", "next-projects-kanban-viewport.png",
    "next-decision-lab-intro-viewport.png",
    "projects-restore-preview.png",
}


def emit(args):
    if not re.fullmatch(r"[a-f0-9]{40}", args.source):
        raise ValueError("Full immutable source SHA required")
    root = pathlib.Path(args.root).resolve()
    checkout = pathlib.Path(args.checkout).resolve()
    git = lambda *v: subprocess.check_output(
        ["git", "-C", str(checkout), *v], text=True).strip()
    commit, tree = git("rev-parse", "HEAD"), git("rev-parse", "HEAD^{tree}")
    names = []
    if args.kind == "release":
        if commit != args.source:
            raise ValueError("Release checkout differs from compiled source")
        manifest = json.loads((root / "public-release.json").read_text())
        names = sorted(set([*manifest["files"], "public-release.json"]))
    elif args.kind == "workshop":
        names = sorted(str(p.relative_to(root)) for p in root.rglob("*.png")
                       if p.name in VIEWS and any(
                           part.endswith(("phone-390", "desktop-1280")) for part in p.parts))
        if args.outcome == "success" and len(names) != len(VIEWS) * 2:
            raise ValueError("Successful workshop must provide all twelve exact viewport images")
    elif args.kind == "unit":
        names = ["report.json", "report.md"]
    if len(names) > 100:
        raise ValueError("Evidence file count exceeds bound")
    data, total = {}, 0
    for name in names:
        p = pathlib.PurePosixPath(name)
        if p.is_absolute() or "\\" in name or any(v in ("", ".", "..") for v in name.split("/")):
            raise ValueError("Unsafe evidence path")
        target = root / p
        if target.is_symlink() or not target.resolve().is_relative_to(root):
            raise ValueError("Linked evidence is forbidden")
        content = target.read_bytes()
        total += len(content)
        if total > 24 * 1024 * 1024:
            raise ValueError("Uncompressed evidence exceeds bound")
        data[name] = content
    metadata = {
        "format": "pmersion.ci-evidence.1", "kind": args.kind,
        "candidateSource": args.source, "checkoutCommit": commit, "checkoutTree": tree,
        "testOutcome": args.outcome,
        "files": {n: {"bytes": len(b), "sha256": hashlib.sha256(b).hexdigest()}
                  for n, b in data.items()},
    }
    if "ci-evidence.json" in data:
        raise ValueError("Reserved evidence name")
    # A publication ZIP must contain exactly the manifest's files. Provenance
    # remains in the surrounding CI envelope, never as an unlisted public asset.
    if args.kind != "release":
        data["ci-evidence.json"] = (json.dumps(metadata, sort_keys=True) + "\n").encode()
    output = io.BytesIO()
    with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as bundle:
        for name, content in sorted(data.items()):
            info = zipfile.ZipInfo(name, (1980, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            bundle.writestr(info, content)
    raw = output.getvalue()
    if len(raw) > MAX_BYTES:
        raise ValueError("Compressed evidence exceeds bound")
    encoded = base64.b64encode(raw).decode("ascii")
    parts = [encoded[i:i + 4096] for i in range(0, len(encoded), 4096)]
    digest = hashlib.sha256(raw).hexdigest()
    provenance = {k: v for k, v in metadata.items() if k != "files"}
    print(PREFIX + "BEGIN " + json.dumps({"bytes": len(raw), "sha256": digest,
                                          "parts": len(parts), "kind": args.kind,
                                          "provenance": provenance}))
    for index, part in enumerate(parts):
        print(PREFIX + f"PART {index:06d} {part}")
    print(PREFIX + "END " + digest)


def decode(args):
    text = pathlib.Path(args.log).read_text()
    begins = re.findall(PREFIX + r"BEGIN (\{[^\n]+\})", text)
    ends = re.findall(PREFIX + r"END ([a-f0-9]{64})", text)
    if len(begins) != 1 or len(ends) != 1:
        raise ValueError("Exactly one complete evidence envelope required")
    meta = json.loads(begins[0])
    if not isinstance(meta["bytes"], int) or not 0 < meta["bytes"] <= MAX_BYTES:
        raise ValueError("Invalid evidence size")
    parts = re.findall(PREFIX + r"PART ([0-9]{6}) ([A-Za-z0-9+/=]+)", text)
    if len(parts) != meta["parts"] or [int(i) for i, _ in parts] != list(range(len(parts))):
        raise ValueError("Missing, duplicate or reordered evidence part")
    raw = base64.b64decode("".join(v for _, v in parts), validate=True)
    if len(raw) != meta["bytes"] or hashlib.sha256(raw).hexdigest() != meta["sha256"] or ends[0] != meta["sha256"]:
        raise ValueError("Evidence digest mismatch")
    out = pathlib.Path(args.output)
    with out.open("xb") as target:
        target.write(raw)
    print(json.dumps(meta))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    commands = parser.add_subparsers(dest="command", required=True)
    writer = commands.add_parser("emit")
    writer.add_argument("--kind", required=True, choices=["release", "workshop", "unit", "browser"])
    writer.add_argument("--root", required=True)
    writer.add_argument("--checkout", default=".")
    writer.add_argument("--source", required=True)
    writer.add_argument("--outcome", default="success")
    reader = commands.add_parser("decode")
    reader.add_argument("log")
    reader.add_argument("output")
    args = parser.parse_args()
    try:
        emit(args) if args.command == "emit" else decode(args)
    except (ValueError, OSError, KeyError, subprocess.CalledProcessError) as error:
        raise SystemExit(str(error)) from error
