#!/bin/sh

until cd /app/project-blog/blog/
do
    echo "Waiting for server volume..."
done


until python manage.py migrate
do
    echo "Waiting for db to be ready..."
    sleep 2
done

python manage.py collectstatic --noinput
# we are using production environment. it is not restart everytime
#gunicorn bicycle.wsgi:application --bind 0.0.0.0:8000

# we are using development environment. it is restart everytime
gunicorn blog.wsgi:application --bind 0.0.0.0:8000 --reload



#python manage.py runserver 0.0.0.0:8000
