import json

# Open the JSON file
with open('./examples/inputs/initbtreeSciMap.json', 'r') as f:
    # Load the JSON data
    data = json.load(f)

# Access the data
print(data)