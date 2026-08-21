import sys
from PIL import Image, ImageChops

def process_image(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    
    # Find bounding box of non-white pixels
    bg = Image.new("RGBA", img.size, (255,255,255,255))
    diff = ImageChops.difference(img, bg)
    # A bit of thresholding
    diff = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()
    
    if bbox:
        # Pad the bbox a little bit
        padding = 10
        bbox = (max(0, bbox[0]-padding), max(0, bbox[1]-padding), min(img.width, bbox[2]+padding), min(img.height, bbox[3]+padding))
        img = img.crop(bbox)
        
    # Make white pixels transparent
    datas = img.getdata()
    newData = []
    for item in datas:
        # White or near white -> transparent
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    
    # Save as true .ico file for the web
    img.save(output_path, format="ICO", sizes=[(64, 64), (128, 128), (256, 256)])
    print(f"Successfully processed and saved to {output_path}")

if __name__ == "__main__":
    process_image(sys.argv[1], sys.argv[2])
