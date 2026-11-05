import json

with open('test_data/qa_test_results.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

mods = {}
for d in data:
    m = d.get('module', 'Other')
    mods.setdefault(m, []).append(d)

for m, items in mods.items():
    print(f"=== Module: {m} ({len(items)} tests) ===")
    for it in items[:2]:
        tid = it.get('test_id')
        sc = it.get('scenario')
        st = it.get('status')
        act = it.get('actual', '')[:40]
        print(f"  {tid}: {sc} -> {st} ({act})")

