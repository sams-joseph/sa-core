FROM postgres:9.5

COPY docker/prepend.sh /usr/local/bin/prepend

COPY sql/init.sql /docker-entrypoint-initdb.d/10-init.sql