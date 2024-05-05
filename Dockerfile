FROM python:3.10
RUN apt-get update -y && apt-get install nano -y && apt-get install nginx -y &&  apt-get install -y gunicorn systemd && apt-get install net-tools

WORKDIR /app
CMD ["python"]
