#!/bin/bash
# project setup in ec2 instance. if you want to configration in local then you need to use project setup with docker.sh. because it will harmfull your system or not easy setup.
# -------------------------------------------- Backend Setup --------------------------------------
sudo apt-get update
sudo apt-get install -y git
sudo apt-get install -y nginx
sudo systemctl enable nginx
sudo touch /etc/nginx/sites-available/project_blog.conf
sudo chmod 777 /etc/nginx/sites-available/project_blog.conf

# set linux environemnt 
GITHUB_ACCESS_TOKEN=""
GITHUB_USERNAME=""

sudo mkdir -p /app
# sudo git clone https://github.com/krishna2808/Blog-Aproject-blogPI--V2.git /app/app/project-blog/
sudo git clone https://${GITHUB_USERNAME}:${GITHUB_ACCESS_TOKEN}@github.com/krishna2808/Blog-API--V2.git /app/blog/
# sudo chmod -R 777 /app/*

sudo cat /app/project-blog/nginx/nginx.conf > /etc/nginx/sites-available/project_blog.conf
sudo ln -s /etc/nginx/sites-available/project_blog.conf  /etc/nginx/sites-enabled/
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
cd /app/blog/
sudo python3.10 -m venv venv
# change current user and group give ownership permission.
sudo chown -R $(whoami):$(whoami) /app

source venv/bin/activate
cd /app/blog/backend/
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py makemigrations --noinput
python manage.py migrate  --noinput
# python manage.py runserver 0.0.0.0:8000

# gunicorn setup in project. 
# sudo apt-get install gunicorn -y 
sudo cp /app/blog/backend/gunicorn/gunicorn.service /etc/systemd/system/  
sudo cp /app/blog/backend/gunicorn/gunicorn.socket /etc/systemd/system/   



# # manage log as gunicorn level but we will not use because we want to get more debugging information from django level log. nginx and gunicorn not give webapplication level debugging information.
# # sudo mkdir -p /var/log/gunicorn
# # sudo chown -R $(whoami):$(whoami) /var/log/gunicorn
# # sudo chmod -R 775 /var/log/gunicorn 

# # manage log as django level. django level log gives more debugging information compare to gunicorn and nginx. 
# sudo mkdir -p /var/log/django

# sudo touch /var/log/django/django.log /var/log/django/django_error.log
# sudo chown -R $(whoami):$(whoami) /var/log/django
# sudo chmod -R 775 /var/log/django



sudo systemctl start gunicorn.socket
sudo systemctl enable gunicorn.socket
sudo systemctl start gunicorn
sudo systemctl enable gunicorn
sudo systemctl daemon-reload	

# -------------------------------------------- Frontend Setup --------------------------------------

cd /app/blog/frontend
sudo apt-get remove nodejs npm
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Load nvm
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js version 20.9.0
nvm install 20.9.0

# Use Node.js version 20.9.0
nvm use 20.9.0

# Verify Node.js installation
node -v

# Install npm version 10.1.0
npm install -g npm@10.1.0

# Verify npm installation
npm -v
