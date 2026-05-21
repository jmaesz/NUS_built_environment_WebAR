import os
from PIL import Image, ImageOps

image_path = "ARmarkers.png"
img = Image.open(image_path).convert("RGB")
img_w, img_h = img.size

# Scan from the bottom to find where content ends (last row with dark pixels)
import numpy as np
pixels = np.array(ImageOps.grayscale(img))
# Find the last row that has a pixel darker than 200
dark_rows = np.where(pixels.min(axis=1) < 200)[0]
content_bottom = int(dark_rows[-1]) + 1 if len(dark_rows) else img_h

print(f"Image size: {img_w}x{img_h}")
print(f"Content ends at row: {content_bottom}")

# Crop to just the grid area
grid = img.crop((0, 0, img_w, content_bottom))
grid_w, grid_h = grid.size

rows, cols = 4, 5
cell_w = grid_w / cols
cell_h = grid_h / rows

labels = [
    ["CELC", "E1", "E1A", "E2", "E2A"],
    ["E3", "E3A", "E4", "E4A", "E5"],
    ["E6", "E8", "EA", "EW1", "EW1A"],
    ["SDE4", "SDE2", "SDE1", "SDE3", "T-Lab"]
]

output_dir = "cropped_qr_codes"
os.makedirs(output_dir, exist_ok=True)

for r in range(rows):
    for c in range(cols):
        left   = c * cell_w
        top    = r * cell_h
        right  = (c + 1) * cell_w
        bottom = (r + 1) * cell_h
        cropped = grid.crop((left, top, right, bottom))
        # Trim white padding — keep from the outermost dark pixel inward
        gray_cell = ImageOps.grayscale(cropped)
        tight_bbox = gray_cell.point(lambda p: 255 if p < 200 else 0).getbbox()
        if tight_bbox:
            cropped = cropped.crop(tight_bbox)
        file_name = f"{labels[r][c]}.png"
        cropped.save(os.path.join(output_dir, file_name))
        print(f"Saved: {file_name}")

print(f"\nDone! {rows * cols} markers saved to '{output_dir}'")
