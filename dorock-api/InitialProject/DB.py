import json
import requests
import psycopg2
from datetime import datetime

#############################################################
####                                                     ####
####      DB 테이블 생성을 위해 한번만 실행할 코드       ####
####                                                     ####
#############################################################


def get_area_code():
    url = f"http://apis.data.go.kr/B551011/KorService2/areaCode2?serviceKey=McSZCW7LYX8dGwLtln2CN8hlWwnQkFQbibX470nlV797KxeZzTTWZdZ5%2Bsrqy%2FIDP8MDn%2BJHLxLcbsNQSKr6SQ%3D%3D&areaCode=32&numOfRows=20&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json"

    try:
        response = requests.get(url)
        response.raise_for_status()  # 상태 코드 확인

        # JSON 데이터 파싱
        area_code_json = response.json()
        return area_code_json
    except Exception as err:
        print(f"Error fetching area code data: {err}")
        return None


def get_spot_data():
    url = f"http://apis.data.go.kr/B551011/KorService2/areaBasedList2?serviceKey=McSZCW7LYX8dGwLtln2CN8hlWwnQkFQbibX470nlV797KxeZzTTWZdZ5%2Bsrqy%2FIDP8MDn%2BJHLxLcbsNQSKr6SQ%3D%3D&pageNo=1&_type=json&numOfRows=6000&MobileApp=AppTest&MobileOS=ETC&arrange=A&areaCode=32"

    try:
        response = requests.get(url)
        response.raise_for_status()  # 상태 코드 확인

        # JSON 데이터 파싱
        spot_data_json = response.json()
        return spot_data_json
    except Exception as err:
        print(f"Error fetching spot data: {err}")
        return None


def create_areacode_table(cur, conn):
    print("Creating areacode table...")
    try:
        cur.execute(
            "CREATE TABLE areacode (rnum INT PRIMARY KEY, code CHAR(2) NOT NULL, name VARCHAR(10) NOT NULL);"
        )
        conn.commit()
        print("areacode table created successfully.")
    except psycopg2.errors.DuplicateTable:
        print("areacode table already exists.")
        conn.rollback()

    area_code_json = get_area_code()
    if not area_code_json or "item" not in area_code_json["response"]["body"]["items"]:
        print("No area code data to insert.")
        return

    items = area_code_json["response"]["body"]["items"]["item"]
    for areacode in items:
        try:
            sql = """INSERT INTO areacode (rnum, code, name) VALUES (%s, %s, %s);"""
            values = (
                areacode["rnum"],
                areacode["code"],
                areacode["name"]
            )
            cur.execute(sql, values)
            conn.commit()
        except psycopg2.errors.UniqueViolation:
            print(
                f"Data for areacode {areacode['code']} already exists. Skipping.")
            conn.rollback()
        except Exception as err:
            print(f"Database error inserting areacode data: {err}")
            conn.rollback()


def create_tourist_spot_table(cur, conn):
    print("Creating tourist_spot table...")
    try:
        cur.execute("""
            CREATE TABLE tourist_spot ( 
                id SERIAL PRIMARY KEY,
                addr1 VARCHAR(255) NOT NULL,
                addr2 VARCHAR(255),
                areacode VARCHAR(10),
                booktour VARCHAR(10),
                cat1 VARCHAR(10),
                cat2 VARCHAR(10),
                cat3 VARCHAR(10),
                contentid CHAR(20) UNIQUE,
                contenttypeid VARCHAR(10),
                createdtime TIMESTAMP,
                firstimage VARCHAR(255),
                firstimage2 VARCHAR(255),
                cpyrhtDivCd VARCHAR(10),
                mapx DECIMAL(15, 10),
                mapy DECIMAL(15, 10),
                mlevel VARCHAR(2),
                modifiedtime TIMESTAMP,
                sigungucode VARCHAR(10),
                tel VARCHAR(255),
                title VARCHAR(100),
                zipcode VARCHAR(10)
            );
        """)
        conn.commit()
        print("tourist_spot table created successfully.")
    except psycopg2.errors.DuplicateTable:
        print("tourist_spot table already exists.")
        conn.rollback()

    tourist_spot_json = get_spot_data()
    if not tourist_spot_json or "item" not in tourist_spot_json["response"]["body"]["items"]:
        print("No spot data to insert.")
        return

    items = tourist_spot_json["response"]["body"]["items"]["item"]
    for tourist in items:
        try:
            created_time_str = tourist.get("createdtime", None)
            modified_time_str = tourist.get("modifiedtime", None)
            
            created_time = None
            if created_time_str:
                created_time = datetime.strptime(created_time_str, '%Y%m%d%H%M%S')

            modified_time = None
            if modified_time_str:
                modified_time = datetime.strptime(modified_time_str, '%Y%m%d%H%M%S')
            
            sql = """
                INSERT INTO tourist_spot (
                    addr1, addr2, areacode, booktour, cat1, cat2, cat3, contentid,
                    contenttypeid, createdtime, firstimage, firstimage2, cpyrhtDivCd, mapx,
                    mapy, mlevel, modifiedtime, sigungucode, tel, title, zipcode
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """
            values = (
                tourist.get("addr1", None),
                tourist.get("addr2", None),
                tourist.get("areacode", None),
                tourist.get("booktour", None),
                tourist.get("cat1", None),
                tourist.get("cat2", None),
                tourist.get("cat3", None),
                tourist.get("contentid", None),
                tourist.get("contenttypeid", None),
                created_time,
                tourist.get("firstimage", None),
                tourist.get("firstimage2", None),
                tourist.get("cpyrhtDivCd", None),
                tourist.get("mapx", None),
                tourist.get("mapy", None),
                tourist.get("mlevel", None),
                modified_time,
                tourist.get("sigungucode", None),
                tourist.get("tel", None),
                tourist.get("title", None),
                tourist.get("zipcode", None)
            )
            cur.execute(sql, values)
            conn.commit()
        except psycopg2.errors.UniqueViolation:
            print(
                f"Data for contentid {tourist.get('contentid')} already exists. Skipping.")
            conn.rollback()
        except Exception as err:
            print(f"Database error inserting tourist_spot data: {err}")
            conn.rollback()


def create_non_blank_tourist_spot_table(cur, conn):
    print("Creating non_blank_tourist_spot table...")
    try:
        cur.execute("""
            CREATE TABLE non_blank_tourist_spot ( 
                id SERIAL PRIMARY KEY,
                addr1 VARCHAR(255) NOT NULL,
                addr2 VARCHAR(255),
                areacode VARCHAR(10),
                booktour VARCHAR(10),
                cat1 VARCHAR(10),
                cat2 VARCHAR(10),
                cat3 VARCHAR(10),
                contentid CHAR(20) UNIQUE,
                contenttypeid VARCHAR(10),
                createdtime TIMESTAMP,
                firstimage VARCHAR(255),
                firstimage2 VARCHAR(255),
                cpyrhtDivCd VARCHAR(10),
                mapx DECIMAL(15, 10),
                mapy DECIMAL(15, 10),
                mlevel VARCHAR(2),
                modifiedtime TIMESTAMP,
                sigungucode VARCHAR(10),
                tel VARCHAR(255),
                title VARCHAR(100),
                zipcode VARCHAR(10)
            );
        """)
        conn.commit()
        print("non_blank_tourist_spot table created successfully.")
    except psycopg2.errors.DuplicateTable:
        print("non_blank_tourist_spot table already exists.")
        conn.rollback()

    tourist_spot_json = get_spot_data()
    if not tourist_spot_json or "item" not in tourist_spot_json["response"]["body"]["items"]:
        print("No spot data to insert.")
        return

    items = tourist_spot_json["response"]["body"]["items"]["item"]

    for tourist in items:
        tourist["title"] = "".join(tourist.get("title", "").split(" "))
        try:
            created_time_str = tourist.get("createdtime", None)
            modified_time_str = tourist.get("modifiedtime", None)
            
            created_time = None
            if created_time_str:
                created_time = datetime.strptime(created_time_str, '%Y%m%d%H%M%S')

            modified_time = None
            if modified_time_str:
                modified_time = datetime.strptime(modified_time_str, '%Y%m%d%H%M%S')
            
            sql = """
                INSERT INTO non_blank_tourist_spot (
                    addr1, addr2, areacode, booktour, cat1, cat2, cat3, contentid,
                    contenttypeid, createdtime, firstimage, firstimage2, cpyrhtDivCd, mapx,
                    mapy, mlevel, modifiedtime, sigungucode, tel, title, zipcode
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """
            values = (
                tourist.get("addr1", None),
                tourist.get("addr2", None),
                tourist.get("areacode", None),
                tourist.get("booktour", None),
                tourist.get("cat1", None),
                tourist.get("cat2", None),
                tourist.get("cat3", None),
                tourist.get("contentid", None),
                tourist.get("contenttypeid", None),
                created_time,
                tourist.get("firstimage", None),
                tourist.get("firstimage2", None),
                tourist.get("cpyrhtDivCd", None),
                tourist.get("mapx", None),
                tourist.get("mapy", None),
                tourist.get("mlevel", None),
                modified_time,
                tourist.get("sigungucode", None),
                tourist.get("tel", None),
                tourist.get("title", None),
                tourist.get("zipcode", None)
            )
            cur.execute(sql, values)
            conn.commit()
        except psycopg2.errors.UniqueViolation:
            print(
                f"Data for contentid {tourist.get('contentid')} already exists. Skipping.")
            conn.rollback()
        except Exception as err:
            print(
                f"Database error inserting non_blank_tourist_spot data: {err}")
            conn.rollback()

# 실행부


def main():
    conn = None
    try:
        print("Connecting to the database...")
        conn = psycopg2.connect(
            host="localhost",
            user="root",
            password="root",
            dbname="dorock",
            port=5432
        )
        print("Database connection successful.")
        cur = conn.cursor()

        # 테이블 생성 및 데이터 삽입 함수 호출
        create_tourist_spot_table(cur, conn)
        create_areacode_table(cur, conn)
        create_non_blank_tourist_spot_table(cur, conn)

        cur.close()
    except psycopg2.OperationalError as e:
        print(f"Could not connect to the database: {e}")
        print("Please ensure the Docker PostgreSQL container is running.")
    except FileNotFoundError:
        print("DB_info.json file not found. Please check the path.")
    finally:
        if conn:
            conn.close()
            print("Database connection closed.")


if __name__ == "__main__":
    main()
