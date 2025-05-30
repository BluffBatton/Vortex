import pymysql

# "маскируем" pymysql под MySQLdb
pymysql.install_as_MySQLdb()