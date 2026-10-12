"""Mirror public notices/status onto GitHub Pages; no credentials or player data."""
import json, urllib.request
from pathlib import Path
url="https://blsggkmvytquqpunxwlm.supabase.co/functions/v1/nomo-content"
with urllib.request.urlopen(url,timeout=20) as response:data=json.load(response)
assert data.get("format")==1 and isinstance(data.get("notices"),list)
root=Path(__file__).resolve().parents[1]/"popora/notices"
with urllib.request.urlopen(url+"?notices=1",timeout=20) as response:archive=json.load(response)
assert isinstance(archive.get("notices"),list)
(root/"feed.json").write_text(json.dumps({"notices":archive["notices"]},ensure_ascii=False,indent=2)+"\n")
(root/"status.json").write_text(json.dumps({key:data[key] for key in ["version","maintenance","notices","client_updates"]},ensure_ascii=False,indent=2)+"\n")
