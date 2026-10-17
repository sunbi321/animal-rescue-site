"""Mirror public notices/status onto GitHub Pages; no credentials or player data."""
import json, urllib.request
from pathlib import Path
url="https://api.braincloudservers.com/webhook/15851/poporaService/public-service-v1"
with urllib.request.urlopen(url,timeout=20) as response:data=json.load(response)
assert data.get("ok") is True and data.get("format")==1 and isinstance(data.get("notices"),list)
root=Path(__file__).resolve().parents[1]/"popora/notices"
archive=data
(root/"feed.json").write_text(json.dumps({"notices":archive["notices"]},ensure_ascii=False,indent=2)+"\n")
(root/"status.json").write_text(json.dumps({key:data[key] for key in ["version","maintenance","notices","client_updates"]},ensure_ascii=False,indent=2)+"\n")
