import pandas as pd
import sys

try:
    file_path = '临时表格.xlsx'
    # Read all sheets
    xls = pd.ExcelFile(file_path)
    for sheet_name in xls.sheet_names:
        print(f"--- Sheet: {sheet_name} ---")
        df = pd.read_excel(xls, sheet_name=sheet_name)
        print(df.to_string())
        print("\n")
except Exception as e:
    print(f"Error reading excel file: {e}")
