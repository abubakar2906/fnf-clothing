import instaloader
from datetime import datetime
import os
import sys

def download_posts(username, start_date_str, end_date_str):
    # Initialize Instaloader
    L = instaloader.Instaloader(
        download_pictures=True,
        download_videos=False,
        download_video_thumbnails=False,
        download_geotags=False,
        download_comments=False,
        save_metadata=False,
        compress_json=False,
        post_metadata_txt_pattern=""
    )

    # Parse dates
    start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
    end_date = datetime.strptime(end_date_str, "%Y-%m-%d")

    print(f"Fetching posts for @{username} between {start_date_str} and {end_date_str}...")

    # Get profile
    try:
        profile = instaloader.Profile.from_username(L.context, username)
    except instaloader.exceptions.ProfileNotExistsException:
        print(f"Error: Profile '{username}' does not exist.")
        sys.exit(1)
    except instaloader.exceptions.ConnectionException as e:
        print(f"Connection Error: {e}")
        # Instagram might be blocking access
        sys.exit(1)

    # Create directory
    out_dir = os.path.join('public', 'instagram_imports')
    os.makedirs(out_dir, exist_ok=True)
    
    L.dirname_pattern = out_dir

    count = 0
    # Iterate over posts
    for post in profile.get_posts():
        # Check if the post date is within our range
        if start_date <= post.date_utc <= end_date:
            print(f"Downloading post from {post.date_utc}...")
            L.download_post(post, target=out_dir)
            count += 1
        # Since get_posts() returns posts from newest to oldest,
        # we can break early if we go past the start_date in descending order.
        elif post.date_utc < start_date:
            break
            
    print(f"Finished! Downloaded {count} posts to {out_dir}/")

if __name__ == "__main__":
    download_posts("fnf_kiddies_and_accessories", "2026-03-05", "2026-03-07") # Include March 6 fully by using March 7 00:00 boundary
