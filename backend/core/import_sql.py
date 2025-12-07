import sqlite3

db_path = "db.sqlite3"       
dump_file = "dump_utf8.sql"  

conn = sqlite3.connect(db_path)
with open(dump_file, "r", encoding="utf-8") as f:
    sql_script = f.read()
conn.executescript(sql_script)
conn.close()

print("Database restored successfully!")
