import os
import glob
from PIL import Image

assets_dir = "TrustLens_AI_Report_Assets"
os.makedirs(assets_dir, exist_ok=True)

# 1. Process media_1793641179913_0d65616d.jpg (Compare Footer with browser/taskbar)
comp_full_path = r"C:/Users/HP/.gemini/antigravity/brain/6828a54e-0f24-4538-8af9-21e3577ae3ad/.user_uploaded/media_1793641179913_0d65616d.jpg"
if os.path.exists(comp_full_path):
    im = Image.open(comp_full_path)
    # Crop out browser tabs/URL bar (top 82px) and Windows taskbar (bottom 45px)
    w, h = im.size
    cropped = im.crop((0, 82, w, h - 45))
    out_path = os.path.join(assets_dir, "user_fig_compare_footer.png")
    cropped.save(out_path, "PNG")
    print(f"Cropped {comp_full_path} -> {out_path} ({cropped.size})")

# 2. Process media_1793641092078_90392c74.png (OTP Modal)
otp_modal_path = r"C:/Users/HP/.gemini/antigravity/brain/6828a54e-0f24-4538-8af9-21e3577ae3ad/.user_uploaded/media_1793641092078_90392c74.png"
if os.path.exists(otp_modal_path):
    im = Image.open(otp_modal_path)
    out_path = os.path.join(assets_dir, "user_fig_otp_modal.png")
    im.save(out_path, "PNG")
    print(f"Copied {otp_modal_path} -> {out_path} ({im.size})")

# 3. Process media_1793641145197_63062126.jpg (Brand Logo)
logo_path = r"C:/Users/HP/.gemini/antigravity/brain/6828a54e-0f24-4538-8af9-21e3577ae3ad/.user_uploaded/media_1793641145197_63062126.jpg"
if os.path.exists(logo_path):
    im = Image.open(logo_path)
    out_path = os.path.join(assets_dir, "user_fig_brand_logo.png")
    im.save(out_path, "PNG")
    print(f"Copied {logo_path} -> {out_path} ({im.size})")

# 4. Map and copy all user screenshots from user_output_screenshots
shot_mapping = {
    "Screenshot 2026-11-01 135720.png": "user_shot_email_inbox.png",
    "Screenshot 2026-11-01 135821.png": "user_shot_login_captcha.png",
    "Screenshot 2026-11-01 135909.png": "user_shot_home_hero.png",
    "Screenshot 2026-11-01 140008.png": "user_shot_upload_studio.png",
    "Screenshot 2026-11-01 140106.png": "user_shot_features_grid.png",
    "Screenshot 2026-11-01 140133.png": "user_shot_compare_engine.png",
    "Screenshot 2026-11-01 140302.png": "user_shot_entity_privacy.png",
    "Screenshot 2026-11-01 140325.png": "user_shot_pipeline_works.png"
}

for src_name, dst_name in shot_mapping.items():
    matches = glob.glob(f"user_output_screenshots/**/{src_name}", recursive=True)
    if matches:
        src = matches[0]
        im = Image.open(src)
        dst = os.path.join(assets_dir, dst_name)
        im.save(dst, "PNG")
        print(f"Saved {src} -> {dst} ({im.size})")

print("User images processing completed successfully!")

