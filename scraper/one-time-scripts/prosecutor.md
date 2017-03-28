```
grep -rnw '/Users/max/Downloads/data/' -e "прокурор" > test.txt
grep --include=\*.{json} -rnw '/path/to/somewhere/' -e "прокурор" | python -c "import json,sys;obj=json.load(sys.stdin);print obj['data', 'step_1', 'lastname'];" > test.txt
cat a0/Афанасьєва_Інна_Іванівна_a0d2e73b-2cf8-472e-837e-c66671c90461.json
cat a0/Афанасьєва_Інна_Іванівна_a0d2e73b-2cf8-472e-837e-c66671c90461.json | python -c "import json,sys;obj=json.load(sys.stdin);print obj['data', 'step_1', 'lastname'];" > test.txt
cat a0/Афанасьєва_Інна_Іванівна_a0d2e73b-2cf8-472e-837e-c66671c90461.json | python -c "import json,sys;obj=json.load(sys.stdin);print obj['data'];" > test.txt
grep -Ril "прокурор" /Users/max/Downloads/data/
grep -Ril "прокурор" --include="*.[json]" /Users/max/Downloads/data/ > prosectors.txt
grep -Ril "прокурор" --include="*.[json]" /Users/max/Downloads/data/
grep -Ril --include="*.[json]" "прокурор" /Users/max/Downloads/data/
grep -Ril --include="*.json" "прокурор" /Users/max/Downloads/data/
grep -Ril --include="*.json" "прокурор" /Users/max/Downloads/data/ > prosectors.txt
```
