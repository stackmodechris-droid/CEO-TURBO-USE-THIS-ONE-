#!/usr/bin/env bash
# Stage one ad as its own HyperFrames project: ./stage.sh <ad-file-without-.html> <audio-name>
# Usage: ./stage.sh ad1-review-card ad1   -> .build/ad1-review-card/ (index.html + assets + hyperframes.json)
set -euo pipefail
cd "$(dirname "$0")"
n="$1"; a="$2"; d=".build/$n"
rm -rf "$d"; mkdir -p "$d/assets/audio"
cp -r assets/fonts assets/img assets/gsap.min.js "$d/assets/"
cp "assets/audio/$a.wav" "$d/assets/audio/"
cp hyperframes.json meta.json "$d/"
cp "$n.html" "$d/index.html"
echo "$d"
