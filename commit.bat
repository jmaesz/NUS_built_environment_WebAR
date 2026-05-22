@echo off
cd /d "C:\Users\James\OneDrive\Desktop\NUS_Built_Environment_WebAR"
git add -A
git commit -m "fix: ArUco detection for marker ID 0 with robust error handling

- Add marker ID validation to ensure only marker 0 is processed
- Implement proper null checks for corner data extraction
- Add dynamic label display showing detected marker ID
- Improve error handling with detailed console logging
- Pass marker ID to pose application function
- Store label text element for dynamic updates

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
