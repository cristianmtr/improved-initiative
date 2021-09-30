import json

spells = json.load(open("spell-list.json", 'r', encoding="utf8"))

for s in spells:
    try:
        s["Description"] = s["Description"][0]
        for learner in s["learnedBy"]:
            if "level" in learner.keys():
                s["Level"] = learner["level"]
    except Exception as e:
        print(e)
        print(s)
    if "Level" not in s.keys():
        print(s)
        
json.dump(spells, open("ogl_spells.json", "w"))