#!/bin/bash

sudo apt-get update
sudo apt-get install -y git
sudo apt-get install -y nginx
sudo systemctl enable nginx
sudo touch /etc/nginx/sites-available/blog_project.conf
sudo chmod 777 /etc/nginx/sites-available/blog_project.conf

sudo mkdir -p /app
# sudo git clone https://github.com/krishna2808/Blog-API--V2.git /app/blog_project
sudo git clone https://${GITHUB_USERNAME}:${GITHUB_ACCESS_TOKEN=}@github.com/krishna2808/Blog-API--V2.git /app/blog_project
sudo chmod -R 777 /app/*
sudo cat /app/blog_project/nginx/nginx.conf > /etc/nginx/sites-available/blog_project.conf
sudo ln -s /etc/nginx/sites-available/blog_project.conf  /etc/nginx/sites-enabled/
sudo systemctl restart nginx

# python and venv setup 

sudo add-apt-repository ppa:deadsnakes/ppa -y 
sudo apt-get update -y 
# sudo apt-get install python3.10 -y
sudo apt-get install python3.10-dev -y
sudo apt-get install python3.10-venv -y
sudo apt-get install python3-pip -y

# project setup in ec2 instance 
sudo apt-get install libmysqlclient-dev -y
sudo apt-get install pkg-config -y
cd /app/blog_project/
sudo python3.10 -m venv venv
sudo chmod -R 777 venv/*
source venv/bin/activate
cd /app/blog_project/blog/
pip install -r requirements.txt
python manage.py makemigrations 
python manage.py migrate
python manage.py runserver 0.0.0.0:8000


