"""Mirror public notices/status onto GitHub Pages; no credentials or player data."""
import json, urllib.request
from pathlib import Path
url="https://blsggkmvytquqpunxwlm.supabase.co/functions/v1/nomo-content"
with urllib.request.urlopen(url,timeout=20) as response:data=json.load(response)
assert data.get("format")==1 and isinstance(data.get("notices"),list)
root=Path(__file__).resolve().parents[1]/"popora/notices"
(root/"feed.json").write_text(json.dumps({"notices":data["notices"]},ensure_ascii=False,indent=2)+"\n")
(root/"status.json").write_text(json.dumps({key:data[key] for key in ["maintenance","notices"]},ensure_ascii=False,indent=2)+"\n")
