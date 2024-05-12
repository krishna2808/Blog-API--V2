#!/bin/bash

sudo apt-get update
sudo apt-get install -y git
sudo apt-get install -y nginx
sudo systemctl enable nginx
sudo touch /etc/nginx/sites-available/blog_project.conf
sudo chmod +777 /etc/nginx/sites-available/blog_project.conf

sudo mkdir -p /app
sudo git clone https://github.com/krishna2808/Blog-API--V2.git /app/blog_project
sudo cat /app/blog_project/nginx/nginx.conf > /etc/nginx/sites-available/blog_project.conf
sudo ln -s /etc/nginx/sites-available/blog_project.conf  /etc/nginx/sites-enabled/
sudo systemctl restart nginx

# python and venv setup 

sudo add-apt-repository ppa:deadsnakes/ppa -y 
sudo apt-get update -y 
sudo apt-get install python3.10 -y
sudo apt-get install python3.10-venv

# project setup in ec2 instance 
cd /app/blog_project/
python3.10 -m venv  venv
source venv/bin/activate
cd /app/blog_project/blog/
pip install -r requirements.txt
python manage.py makemigrations 
python manager.py migrate
python manager.py runserver 0.0.0.0:8000


