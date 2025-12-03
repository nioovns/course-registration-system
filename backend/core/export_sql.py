import sqlite3

db_path = "db.sqlite3"
dump_file = "dump_utf8.sql"

conn = sqlite3.connect(db_path)
with open(dump_file, "w", encoding="utf-8") as f:
    for line in conn.iterdump():
        f.write(f"{line}\n")

conn.close()
print(f"Dump created in {dump_file}")